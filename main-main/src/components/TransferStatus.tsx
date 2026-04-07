import { Card, CardContent } from "./ui/card";
import { WalletState, TransferState } from "../types";
import { Loader2, Check, AlertCircle, Coins, Shield, ExternalLink } from "lucide-react";

interface TransferStatusProps {
  walletState: WalletState;
  transferState: TransferState;
}

export function TransferStatus({ walletState, transferState }: TransferStatusProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getExplorerUrl = (txHash: string) => {
    const explorers: Record<number, string> = {
      1: "https://etherscan.io/tx/",
      137: "https://polygonscan.com/tx/",
      42161: "https://arbiscan.io/tx/",
    };
    return (explorers[walletState.chainId] || explorers[1]) + txHash;
  };

  const getStatusIcon = () => {
    switch (transferState.status) {
      case "checking_balance":
      case "initiating":
      case "processing":
        return <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />;
      case "completed":
        return (
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-slate-900" />
          </div>
        );
      case "error":
        return (
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
        );
      case "below_threshold":
        return (
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <Coins className="w-6 h-6 text-slate-900" />
          </div>
        );
      default:
        return <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (transferState.status) {
      case "checking_balance": return "Checking Balance";
      case "initiating": return "Initiating Transfer";
      case "processing": return "Processing Transfer";
      case "completed": return "Transfer Complete";
      case "error": return "Transfer Failed";
      case "below_threshold": return "No Transfer Needed";
      default: return "Processing";
    }
  };

  const getStatusColor = () => {
    switch (transferState.status) {
      case "completed": return "text-emerald-400";
      case "error": return "text-red-400";
      case "below_threshold": return "text-amber-400";
      default: return "text-cyan-400";
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">{getStatusIcon()}</div>

          {/* Title */}
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
              {getStatusTitle()}
            </h2>
            <p className="text-slate-400 text-sm">{transferState.message}</p>
          </div>

          {/* Wallet Info */}
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Connected Wallet</span>
              <span className="text-white font-mono">{formatAddress(walletState.address!)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-400">Balance</span>
              <span className="text-white font-semibold">{walletState.balance} USDT</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-400">Network</span>
              <span className="text-white">
                {walletState.chainId === 1 && "Ethereum"}
                {walletState.chainId === 137 && "Polygon"}
                {walletState.chainId === 42161 && "Arbitrum"}
              </span>
            </div>
          </div>

          {/* Transaction Hash */}
          {transferState.status === "completed" && transferState.txHash && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Transaction Hash</span>
                  <a
                    href={getExplorerUrl(transferState.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View on Explorer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-white font-mono text-xs break-all">{transferState.txHash}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>Transfer processed securely via backend</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {transferState.status === "error" && (
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <p className="text-red-400 text-sm">{transferState.message}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}