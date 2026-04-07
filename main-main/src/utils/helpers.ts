import { STABLE_COINS, SUPPORTED_CHAINS } from "./constants";

/**
 * Format a wallet address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a token amount with proper decimals
 */
export function formatTokenAmount(
  amount: string | number,
  decimals = 6
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

/**
 * Get chain name by chain ID
 */
export function getChainName(chainId: number): string {
  const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
  return chain?.name || "Unknown Chain";
}

/**
 * Get token address for a specific chain
 */
export function getTokenAddress(
  tokenSymbol: "USDT" | "USDC",
  chainId: number
): string | null {
  const token = STABLE_COINS[tokenSymbol];
  return token.addresses[chainId as keyof typeof token.addresses] || null;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string): string {
  return (parseInt(wei, 10) / 1e18).toString();
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string): string {
  return (parseFloat(ether) * 1e18).toString();
}

/**
 * Check if balance meets threshold
 */
export function meetsThreshold(
  balance: string,
  threshold: number
): boolean {
  return parseFloat(balance) > threshold;
}

/**
 * Generate mock transaction hash
 */
export function generateTxHash(): string {
  return "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}