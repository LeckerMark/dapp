import { http, createConfig, createStorage } from 'wagmi';
import { bsc, mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '3f7bf9e0bf29451960f66c57c7143567';

// Supported chains - BNB Chain (BSC) is default
export const supportedChains = [bsc, mainnet, polygon, arbitrum, optimism, base];

// Create wagmi config with persistent storage
export const config = createConfig({
  chains: supportedChains,
  connectors: [
    walletConnect({ 
      projectId,
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-accent-color': '#F0B90B',
          '--wcm-background-color': '#0B0E11',
        },
      },
    }),
    injected({ target: 'metaMask' }),
    coinbaseWallet({ appName: 'SecureTransfer' }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [base.id]: http('https://mainnet.base.org'),
  },
  // Persistent storage for session persistence
  storage: createStorage({ storage: window.localStorage }),
  syncConnectedChain: true,
});

// Chain info helper
export const getChainInfo = (chainId) => {
  const chainMap = {
    56: { name: 'BNB Chain', symbol: 'BNB', explorer: 'https://bscscan.com', color: '#F0B90B' },
    1: { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io', color: '#627EEA' },
    137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com', color: '#8247E5' },
    42161: { name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io', color: '#28A0F0' },
    10: { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io', color: '#FF0420' },
    8453: { name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org', color: '#0052FF' },
  };
  return chainMap[chainId] || { name: 'Unknown', symbol: 'ETH', explorer: '', color: '#848E9C' };
};

// USDT/Stablecoin addresses per chain
export const USDT_ADDRESSES = {
  56: '0x55d398326f99059fF775485246999027B3197955',   // BSC - USDT
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',    // Ethereum - USDT
  137: '0xc2132D05D31c6B0cB1B7dB5A80A2E6F3d15AE60B', // Polygon - USDT
  42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Arbitrum - USDT
  10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',   // Optimism - USDT
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base - USDC
};

// Get token address safely
export const getTokenAddress = (chainId) => {
  return USDT_ADDRESSES[chainId] || null;
};

export default config;
