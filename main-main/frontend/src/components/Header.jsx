import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ShieldCheck, LogOut, Wallet, ChevronDown, Globe } from 'lucide-react';
import { getChainInfo } from '../config/wagmi';
import { transferService } from '../services/TransferService';
import { NetworkSwitcher } from './NetworkSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header 
      className="sticky top-0 z-50 glass border-b border-[var(--binance-gray-light)]" 
      data-testid="app-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3" data-testid="logo">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--binance-gold)] to-[var(--binance-gold-dark)] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[var(--binance-black)]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-[var(--binance-text)] tracking-tight">
                CryptoTransfer <span className="text-[var(--binance-gold)]">Pro</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--binance-text-secondary)]">
                Secure Protocol
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                {/* Network Switcher */}
                <NetworkSwitcher />

                {/* Wallet dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-2 px-3 py-2 bg-[var(--binance-gray)] hover:bg-[var(--binance-gray-light)] rounded-md border border-[var(--binance-gray-light)] transition-all focus:ring-1 focus:ring-[var(--binance-gold)] focus:outline-none"
                      data-testid="wallet-dropdown-trigger"
                    >
                      <div className="w-2 h-2 rounded-full bg-[var(--binance-green)]" />
                      <span className="text-sm font-mono text-[var(--binance-text)]">
                        {transferService.formatAddress(address, 4)}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[var(--binance-text-secondary)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-[var(--binance-dark)] border-[var(--binance-gray-light)] p-2">
                    <div className="px-3 py-3 bg-[var(--binance-gray)] rounded-md mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--binance-text-secondary)] mb-1">Connected Wallet</p>
                      <p className="text-sm font-mono text-[var(--binance-text)] truncate">{address}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-[var(--binance-gray-light)]" />
                    <DropdownMenuItem 
                      onClick={() => disconnect()}
                      className="text-[var(--binance-red)] hover:text-[var(--binance-red)] hover:bg-[var(--binance-red)]/10 cursor-pointer rounded-md mt-1"
                      data-testid="disconnect-btn"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect Wallet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--binance-gray-light)] rounded-md">
                <Wallet className="w-4 h-4 text-[var(--binance-text-secondary)]" />
                <span className="text-sm text-[var(--binance-text-secondary)]">Not Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
