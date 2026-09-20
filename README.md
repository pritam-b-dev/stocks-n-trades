# Stocks-N-Trades

## Overview

Original mobile concept inspired by the broad insider-activity product category; all displayed content is fictional mock/demo data.

**Stocks-N-Trades** is an executive-level mobile application prototype built with React Native and TypeScript. It enables users to browse, search, and analyze simulated corporate insider trading records through interactive dashboards, advanced multi-criteria filtering, and detailed transaction breakdowns.

---

## Key Features & User Flows

### 1. Market Pulse (`MarketPulseScreen`)

- **Executive Overview:** Displays key aggregated indicators (e.g., Total Volume, Top Buy Sector, Active Insiders).
- **Top Signals:** Quick-glance cards highlighting high-conviction trades based on fictional scoring algorithms.
- **Latest Activity Feed:** Shows exactly the 4 most recently filed insider transactions sorted chronologically by timestamp.

### 2. Advanced Screener (`ScreenerScreen`)

- **Real-time Search:** Search transactions instantly by ticker symbol or company name.
- **Multi-Filter Engine (Logical AND):**
  - **Transaction Type:** Toggle between Purchases (`P`) and Sales (`S`).
  - **Insider Role:** Filter by executive rank (`CEO`, `CFO`, `Director`, `Officer`).
  - **Value Threshold:** Segment trades by total value magnitude ($100K+, $1M+, $5M+).
- **State Feedback:** Item counts update dynamically with a fallback state when no trades match the selected criteria.

### 3. Trade Details & Analytics (`TradeDetailsScreen`)

- **Full Transaction Profile:** In-depth view showing shares, price per share, total dollar value, and exact filing timestamp.
- **Insider Profile:** View role, executive title, and industry sector classification.
- **Mock 7-Day Activity Chart:** Visual representation of fake stock price movements preceding the filing.
- **Signal Breakdown:** Contextual breakdown explaining assigned signal strength (High / Medium / Low).

---

## Project Architecture & Directory Structure

```text
stocks-n-trades/
├── App.tsx                    # Root application entry point & Safe Area Provider
├── src/
│   ├── components/            # Reusable UI primitives
│   │   ├── FilterChip.tsx     # Interactive toggle chip with accessibility attributes
│   │   ├── SignalBadge.tsx    # Color-coded signal strength badge
│   │   ├── SummaryCard.tsx    # Metric display card for Market Pulse
│   │   └── TradeCard.tsx      # Comprehensive transaction card component
│   ├── data/
│   │   └── mockTrades.ts      # 8 fully fictional mock trades (DEMO-A to DEMO-H)
│   ├── navigation/
│   │   └── RootNavigator.tsx  # React Navigation stack configuration & screen routing
│   ├── screens/
│   │   ├── MarketPulseScreen.tsx
│   │   ├── ScreenerScreen.tsx
│   │   └── TradeDetailsScreen.tsx
│   ├── theme/
│   │   └── theme.ts           # Design tokens (palette, spacing, typography)
│   └── types/
│       └── InsiderTrade.ts    # TypeScript interfaces for trade data structures
├── package.json
├── tsconfig.json
└── README.md
```
