/**
 * Allowed insider transaction types.
 */
export type TransactionType = "Purchase" | "Sale";

/**
 * Common insider roles for filtering and display.
 */
export type InsiderRole = "CEO" | "CFO" | "Director" | "Officer" | "10% Owner";

/**
 * Signal strength ratings for insider transactions.
 */
export type SignalStrength = "High" | "Medium" | "Low";

/**
 * Core interface representing a single SEC Form 4 insider trading transaction record.
 */
export interface InsiderTrade {
  /** Unique transaction record identifier */
  id: string;

  /** Stock ticker symbol (e.g., "AAPL", "NVDA") */
  ticker: string;

  /** Full registered name of the company */
  companyName: string;

  /** Industry sector */
  sector: string;

  /** Name of the executive or insider making the trade */
  insiderName: string;

  /** Corporate role of the insider */
  insiderRole: InsiderRole;

  /** Classification of transaction (Purchase or Sale) */
  transactionType: TransactionType;

  /** Official SEC Form 4 transaction code (e.g., "P" = Purchase, "S" = Sale) */
  transactionCode: string;

  /** Number of shares transacted */
  shares: number;

  /** Price per share in USD at time of transaction */
  pricePerShare: number;

  /** Total USD value of the trade (shares * pricePerShare) */
  totalValue: number;

  /** Date when the transaction was executed (YYYY-MM-DD) */
  transactionDate: string;

  /** ISO timestamp when the SEC Form 4 filing was submitted */
  filedAt: string;

  /** Algorithm/analytics signal rating */
  signalStrength: SignalStrength;

  /** 7-day closing stock prices for rendering the historical trend chart */
  priceHistory7d: number[];
}
