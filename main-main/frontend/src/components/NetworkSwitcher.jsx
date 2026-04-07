import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { getChainInfo, supportedChains } from '../config/wagmi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

// Chain icons
const ChainIcons = {
  56: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#F0B90B"/><path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002L16 13.706 14.294 15.4l-.002.002-.2.2-.856.856.003.003L16 19.294l2.293-2.293.001-.001-.002-.002z" fill="#fff"/></svg>,
  1: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="#fff" fillOpacity=".602"/><path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#fff"/><path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="#fff" fillOpacity=".602"/><path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379z" fill="#fff"/></svg>,
  137: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#8247E5"/><path d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653a1.16 1.16 0 00-.627-1.042l-4.17-2.372c-.369-.216-.848-.216-1.254 0l-4.244 2.372A1.16 1.16 0 006 11.076v4.78c0 .432.221.827.627 1.043l4.244 2.372c.369.215.849.215 1.254 0l2.879-1.618 1.955-1.114 2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.37.215.627.61.627 1.042v2.552c0 .431-.22.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.255 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .431.221.827.627 1.042l4.244 2.372c.369.216.848.216 1.254 0l4.244-2.372c.369-.215.627-.61.627-1.042v-4.78a1.16 1.16 0 00-.627-1.042l-4.28-2.409z" fill="#fff"/></svg>,
  42161: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#28A0F0"/><path d="M16.62 11.5l-4.93 7.56 2.1 3.24 5.73-8.8-2.9-2zm4.13 6.32l-2.03 3.12 4.32 2.7.56-4.5-2.85-1.32z" fill="#fff"/><path d="M11.02 19.06l2.77 4.28 3.1-4.76-2.9-1.95-2.97 2.43z" fill="#fff" fillOpacity=".6"/></svg>,
  10: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#FF0420"/><text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">OP</text></svg>,
  8453: <svg viewBox="0 0 32 32" className="w-5 h-5"><circle cx="16" cy="16" r="16" fill="#0052FF"/><path d="M15.998 24.32c4.593 0 8.318-3.725 8.318-8.32 0-4.594-3.725-8.32-8.318-8.32-4.287 0-7.823 3.247-8.266 7.417h10.96v1.805H7.732c.443 4.17 3.979 7.418 8.266 7.418z" fill="#fff"/></svg>,
};

export function NetworkSwitcher() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const currentChainInfo = chain ? getChainInfo(chain.id) : null;

  if (!isConnected) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-[var(--binance-gray)] hover:bg-[var(--binance-gray-light)] rounded-md border border-[var(--binance-gray-light)] transition-all focus:ring-1 focus:ring-[var(--binance-gold)] focus:outline-none"
          data-testid="network-switcher-trigger"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-[var(--binance-gold)]" />
          ) : chain ? (
            ChainIcons[chain.id] || <div className="w-5 h-5 rounded-full" style={{ backgroundColor: currentChainInfo?.color }} />
          ) : null}
          <span className="text-sm text-[var(--binance-text)] hidden sm:inline">{currentChainInfo?.name || 'Network'}</span>
          <ChevronDown className="w-4 h-4 text-[var(--binance-text-secondary)]" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-[var(--binance-dark)] border-[var(--binance-gray-light)] p-2">
        <p className="text-[10px] uppercase tracking-widest text-[var(--binance-text-secondary)] px-2 py-2">Select Network</p>
        
        {supportedChains.map((supportedChain) => {
          const chainInfo = getChainInfo(supportedChain.id);
          const isActive = chain?.id === supportedChain.id;
          
          return (
            <DropdownMenuItem
              key={supportedChain.id}
              onClick={() => !isActive && switchChain({ chainId: supportedChain.id })}
              disabled={isPending}
              className={`flex items-center justify-between px-3 py-3 rounded-md cursor-pointer transition-all ${
                isActive ? 'bg-[var(--binance-gold)]/10 border border-[var(--binance-gold)]/30' : 'hover:bg-[var(--binance-gray)]'
              }`}
              data-testid={`network-option-${supportedChain.id}`}
            >
              <div className="flex items-center gap-3">
                {ChainIcons[supportedChain.id]}
                <div>
                  <p className={`text-sm font-medium ${isActive ? 'text-[var(--binance-gold)]' : 'text-[var(--binance-text)]'}`}>
                    {chainInfo.name}
                  </p>
                </div>
              </div>
              {isActive && <Check className="w-4 h-4 text-[var(--binance-gold)]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NetworkSwitcher;
