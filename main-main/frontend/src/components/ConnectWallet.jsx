import React, { useState } from 'react';
import { useConnect } from 'wagmi';
import { 
  Wallet, 
  ShieldCheck, 
  Lock, 
  Zap,
  ChevronRight,
  Loader2,
  AlertCircle,
  Smartphone,
  Fingerprint
} from 'lucide-react';
import { Button } from './ui/button';

// Wallet icons
const WalletIcons = {
  walletConnect: (
    <svg viewBox="0 0 300 185" className="w-6 h-6">
      <path d="M61.4385 36.2562C104.193 -5.16627 173.807 -5.16627 216.562 36.2562L221.948 41.4572C224.238 43.6675 224.238 47.2398 221.948 49.4501L203.639 67.0997C202.494 68.2049 200.653 68.2049 199.508 67.0997L192.133 59.9755C163.121 31.6668 116.879 31.6668 87.8672 59.9755L79.9388 67.6553C78.7937 68.7605 76.9525 68.7605 75.8074 67.6553L57.4982 50.0057C55.2077 47.7954 55.2077 44.2231 57.4982 42.0128L61.4385 36.2562ZM253.499 71.4089L269.806 87.0534C272.096 89.2637 272.096 92.8361 269.806 95.0464L196.628 165.618C194.338 167.828 190.656 167.828 188.365 165.618L133.622 112.673C133.049 112.121 132.129 112.121 131.557 112.673L76.8135 165.618C74.5231 167.828 70.8406 167.828 68.5501 165.618L-4.62713 95.0464C-6.91762 92.8361 -6.91762 89.2637 -4.62713 87.0534L11.68 71.4089C13.9705 69.1986 17.6531 69.1986 19.9436 71.4089L74.687 124.354C75.2598 124.906 76.1806 124.906 76.7534 124.354L131.497 71.4089C133.787 69.1986 137.47 69.1986 139.76 71.4089L194.504 124.354C195.077 124.906 195.998 124.906 196.57 124.354L251.314 71.4089C253.604 69.1986 257.287 69.1986 259.577 71.4089L253.499 71.4089Z" fill="#3B99FC"/>
    </svg>
  ),
  injected: (
    <svg viewBox="0 0 318 318" className="w-6 h-6">
      <polygon fill="#E17726" points="274.1,35.5 174.6,109.4 193,65.8"/>
      <polygon fill="#E27625" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
      <polygon fill="#E27625" points="238.3,206.8 211.8,247.4 268.5,263 285.8,207.7"/>
      <polygon fill="#E27625" points="33.9,207.7 51.1,263 107.8,247.4 81.3,206.8"/>
      <polygon fill="#E27625" points="104.9,138.2 88.7,162.1 144.1,164.6 142.1,104.1"/>
      <polygon fill="#E27625" points="214.9,138.2 175.9,103.4 174.6,164.6 229.9,162.1"/>
    </svg>
  ),
  coinbaseWallet: (
    <svg viewBox="0 0 1024 1024" className="w-6 h-6">
      <circle cx="512" cy="512" r="512" fill="#0052FF"/>
      <path d="M516.3 361.83c60.28 0 108.1 37.18 126.26 92.47H764C742 336.09 644.47 256 517.27 256 372.82 256 260 365.65 260 512.49S370 768 517.27 768c124.35 0 221.73-79.57 243.73-182.41H642.55c-17.86 55.08-65.65 92.07-126.26 92.07-72.6 0-135.22-62.65-135.22-135.37s62.63-135.36 135.22-135.36z" fill="#FFF"/>
    </svg>
  ),
};

const features = [
  { icon: ShieldCheck, text: 'Bank-grade security', color: 'var(--binance-gold)' },
  { icon: Lock, text: 'Non-custodial', color: 'var(--binance-green)' },
  { icon: Zap, text: 'Instant transfers', color: 'var(--binance-blue)' },
];

export function ConnectWallet() {
  const { connectors, connect, isPending, error } = useConnect();
  const [connectingId, setConnectingId] = useState(null);

  const handleConnect = async (connector) => {
    setConnectingId(connector.id);
    try {
      await connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
    }
    setConnectingId(null);
  };

  const getConnectorIcon = (connector) => {
    if (connector.id.includes('walletConnect')) return WalletIcons.walletConnect;
    if (connector.id.includes('coinbase')) return WalletIcons.coinbaseWallet;
    return WalletIcons.injected;
  };

  const getConnectorName = (connector) => {
    if (connector.id.includes('walletConnect')) return 'WalletConnect';
    if (connector.id.includes('coinbase')) return 'Coinbase Wallet';
    if (connector.id.includes('metaMask')) return 'MetaMask';
    return connector.name || 'Browser Wallet';
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up" data-testid="connect-wallet-container">
      <div className="premium-card overflow-hidden">
        {/* Header */}
        <div className="relative p-8 text-center border-b border-[var(--binance-gray-light)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--binance-gold)]/5 to-transparent" />
          <div className="relative">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--binance-gray)] to-[var(--binance-dark)] border border-[var(--binance-gray-light)] flex items-center justify-center mb-6 shadow-lg">
              <Fingerprint className="w-10 h-10 text-[var(--binance-gold)]" />
            </div>
            
            <h2 className="text-2xl font-semibold text-[var(--binance-text)] tracking-tight mb-2">
              Connect Wallet
            </h2>
            <p className="text-sm text-[var(--binance-text-secondary)] max-w-xs mx-auto">
              Connect your wallet to initiate secure automated transfers
            </p>
          </div>
        </div>

        {/* Wallet options */}
        <div className="p-6 space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              className="w-full flex items-center gap-4 p-4 bg-[var(--binance-gray)] hover:bg-[var(--binance-gray-light)] border border-[var(--binance-gray-light)] hover:border-[var(--binance-gold)]/30 rounded-lg transition-all group focus:ring-1 focus:ring-[var(--binance-gold)] focus:outline-none"
              data-testid={`connect-${connector.id}`}
            >
              <div className="w-12 h-12 bg-[var(--binance-dark)] rounded-lg flex items-center justify-center border border-[var(--binance-gray-light)]">
                {getConnectorIcon(connector)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--binance-text)]">{getConnectorName(connector)}</p>
                <p className="text-xs text-[var(--binance-text-secondary)]">
                  {connector.id.includes('walletConnect') ? 'Scan QR code' : 'Browser extension'}
                </p>
              </div>
              {connectingId === connector.id ? (
                <Loader2 className="w-5 h-5 animate-spin text-[var(--binance-gold)]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[var(--binance-text-secondary)] group-hover:text-[var(--binance-gold)] transition-colors" />
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-[var(--binance-red)]/10 border border-[var(--binance-red)]/20 rounded-lg flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-[var(--binance-red)] flex-shrink-0" />
            <p className="text-sm text-[var(--binance-red)]">{error.message || 'Connection failed'}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-[var(--binance-gray-light)]">
          {/* Features */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <feature.icon className="w-3.5 h-3.5" style={{ color: feature.color }} />
                <span className="text-xs text-[var(--binance-text-secondary)]">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Mobile tip */}
          <div className="flex items-center justify-center gap-2 p-3 bg-[var(--binance-gray)] rounded-lg">
            <Smartphone className="w-4 h-4 text-[var(--binance-gold)]" />
            <p className="text-xs text-[var(--binance-text-secondary)]">
              On mobile? Open in your wallet's browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
