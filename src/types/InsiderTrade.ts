export type TransactionType = "Purchase" | "Sale" | "purchase" | "sale";

export type SignalStrength = "High" | "Medium" | "Low";

export type InsiderRole = "CEO" | "CFO" | "Director" | "Officer";

export interface InsiderTrade {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  insiderName: string;
  insiderRole: InsiderRole;
  transactionType: TransactionType;
  transactionCode: "P" | "S";
  shares: number;
  pricePerShare: number;
  totalValue: number;
  transactionDate: string;
  filedAt: string;
  signalStrength: SignalStrength;
  signal: string;
  priceHistory7d: number[];
}
