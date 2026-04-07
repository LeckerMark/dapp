export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  chainId: number;
}

export type TransferStatusType = 
  | "idle"
  | "connecting"
  | "signing"
  | "checking_balance"
  | "below_threshold"
  | "initiating"
  | "processing"
  | "completed"
  | "error";

export interface TransferState {
  status: TransferStatusType;
  message: string | null;
  txHash: string | null;
}

export interface TransferResult {
  success: boolean;
  txHash: string;
  amount: string;
  timestamp: number;
}