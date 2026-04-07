import React from 'react';
import { useAccount } from 'wagmi';
import { WalletProvider } from './components/WalletProvider';
import { Header } from './components/Header';
import { ConnectWallet } from './components/ConnectWallet';
import { TransferDashboard } from './components/TransferDashboard';
import { Footer } from './components/Footer';
import './App.css';

function AppContent() {
  const { isConnected, isConnecting, isReconnecting } = useAccount();

  return (
    <div className="min-h-screen flex flex-col" data-testid="app-container">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {isConnecting || isReconnecting ? (
          <div className="text-center animate-fade-in" data-testid="reconnecting-state">
            <div className="w-16 h-16 border-2 border-[var(--binance-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[var(--binance-text-secondary)]">
              {isReconnecting ? 'Reconnecting...' : 'Connecting...'}
            </p>
          </div>
        ) : isConnected ? (
          <TransferDashboard />
        ) : (
          <ConnectWallet />
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
