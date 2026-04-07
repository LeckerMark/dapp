import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { WalletState } from "../App";
import { Coins, RefreshCw, TrendingUp } from "lucide-react";

interface BalanceCheckerProps {
  walletState: WalletState;
  updateWalletState: (updates: Partial<WalletState>) => void;
}

export function BalanceChecker({
  walletState,
  updateWalletState,
}: BalanceCheckerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshBalance = async () => {
    setIsRefreshing(true);

    // Simulate balance fetch
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newBalance = (Math.random() * 1000).toFixed(2);
    updateWalletState({ balance: newBalance });
    setLastUpdated(new Date());

    setIsRefreshing(false);
  };

  useEffect(() => {
    if (walletState.isConnected) {
      setLastUpdated(new Date());
    }
  }, [walletState.isConnected]);

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getChainName = (chainId: number | null) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      56: "BSC",
      42161: "Arbitrum",
    };
    return chainId ? chains[chainId] || "Unknown" : "Unknown";
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            Your Balance
          </div>
          <Button
            onClick={refreshBalance}
            disabled={isRefreshing || !walletState.isConnected}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-bold text-white mb-1">
              {formatBalance(walletState.balance)}
              <span className="text-lg text-slate-400 ml-2">USDT</span>
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Chain: {getChainName(walletState.chainId)}</span>
            </div>
          </div>

          {lastUpdated && (
            <p className="text-xs text-slate-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Threshold Status</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  parseFloat(walletState.balance) > 0
                    ? "bg-emerald-400"
                    : "bg-slate-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  parseFloat(walletState.balance) > 0
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {parseFloat(walletState.balance) > 0
                  ? "Above threshold - Transfer available"
                  : "Below threshold"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}