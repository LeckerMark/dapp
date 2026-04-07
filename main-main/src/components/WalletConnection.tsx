import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Wallet, QrCode, Shield, Loader2, Check } from "lucide-react";

// Wallet Connect Configuration
const WC_PROJECT_ID = "your-project-id-here"; // Replace with your Wallet Connect Project ID
const WC_URI = "wc://";

interface WalletConnectionProps {
  onConnect: (address: string, chainId: number, provider: any) => void;
}

export function WalletConnection({ onConnect }: WalletConnectionProps) {
  const [step, setStep] = useState<"idle" | "connecting" | "connected">("idle");
  const [uri, setUri] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const web3ProviderRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (web3ProviderRef.current) {
        web3ProviderRef.current.disconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      setStep("connecting");

      // Dynamic import of Wallet Connect SDK
      // In production, this would be: import WalletConnectProvider from "@walletconnect/web3-provider"
      // For this demo, we simulate the connection flow
      
      /*
       * REAL IMPLEMENTATION (Uncomment when @walletconnect/web3-provider is installed):
       * 
       * const WalletConnectProvider = (await import("@walletconnect/web3-provider")).default;
       * 
       * const provider = new WalletConnectProvider({
       *   infuraId: "YOUR_INFURA_ID",
       *   rpc: {
       *     1: "https://eth.llamarpc.com",
       *     137: "https://polygon-rpc.com",
       *   },
       *   qrcodeMode: true,
       * });
       *
       * // Enable session (triggers QR Code modal)
       * await provider.enable();
       *
       * // Get connected accounts and chain
       * const [address] = provider.accounts;
       * const chainId = provider.chainId;
       *
       * web3ProviderRef.current = provider;
       * onConnect(address, chainId, provider);
       */

      // SIMULATION FOR DEMO (Remove in production)
      await simulateWalletConnect();
      
    } catch (err) {
      console.error("Connection error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
      setStep("idle");
    }
  };

  const simulateWalletConnect = async () => {
    // Simulate Wallet Connect flow for demonstration
    // In production, replace this with actual Wallet Connect SDK integration
    
    // Generate a mock URI (in real implementation, this comes from the SDK)
    const mockUri = "wc:abc123@1?bridge=https://bridge.walletconnect.org&key=xyz789";
    setUri(mockUri);

    // Simulate waiting for user to scan and approve
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock address
    const mockAddress = "0x" + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    setStep("connected");
    
    // Small delay before triggering callback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onConnect(mockAddress, 1, null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6">
      {/* Icon */}
      <div className="mx-auto w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
        {step === "idle" && <Wallet className="w-10 h-10 text-emerald-400" />}
        {step === "connecting" && <QrCode className="w-10 h-10 text-cyan-400 animate-pulse" />}
        {step === "connected" && <Check className="w-10 h-10 text-emerald-400" />}
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {step === "idle" && "Connect Your Wallet"}
          {step === "connecting" && "Scan with Wallet Connect"}
          {step === "connected" && "Wallet Connected"}
        </h2>
        <p className="text-slate-400 text-sm">
          {step === "idle" && "Connect your wallet to enable automatic transfers. Your funds will be transferred securely to the designated address."}
          {step === "connecting" && "Open your wallet app and scan the QR code to connect."}
          {step === "connected" && "Connection established. Processing automatic transfer..."}
        </p>
      </div>

      {/* QR Code Display (when connecting) */}
      {step === "connecting" && (
        <div className="bg-white p-4 rounded-xl inline-block">
          <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 break-all px-2">{uri.slice(0, 30)}...</p>
            </div>
          </div>
        </div>
      )}

      {/* Steps Indicator */}
      {step !== "idle" && (
        <div className="flex items-center justify-center gap-2">
          <StepIndicator label="Scan" isActive={step === "connecting"} isComplete={step === "connected"} />
          <div className="w-8 h-px bg-slate-700" />
          <StepIndicator label="Approve" isActive={false} isComplete={step === "connected"} />
          <div className="w-8 h-px bg-slate-700" />
          <StepIndicator label="Connect" isActive={false} isComplete={step === "connected"} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Connect Button */}
      {step === "idle" ? (
        <Button
          onClick={handleConnect}
          className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold text-lg"
        >
          <Wallet className="w-5 h-5 mr-2" />
          Connect via Wallet Connect
        </Button>
      ) : step === "connecting" ? (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Waiting for wallet connection...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
          <Check className="w-4 h-4" />
          <span>Connected successfully</span>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="w-3 h-3" />
        <span>Secured by Wallet Connect • Automatic transfer enabled</span>
      </div>
    </div>
  );
}

function StepIndicator({ label, isActive, isComplete }: { label: string; isActive: boolean; isComplete: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
        isComplete 
          ? "bg-emerald-500 text-slate-900" 
          : isActive 
            ? "bg-cyan-500 text-slate-900 animate-pulse" 
            : "bg-slate-800 text-slate-500"
      }`}>
        {isComplete ? <Check className="w-3 h-3" /> : ""}
      </div>
      <span className={`text-xs ${isActive || isComplete ? "text-white" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}