// Portfolio building blocks: global, regional and dedicated fixed-income sleeves; single-name
// India/UAE equities, corporate bonds and sukuk carry reference prices until a live feed is wired.
// Rebalance drift corridor: 5% absolute drift triggers rebalance recommendations.
// Source: Vanguard Research (Zilbering et al. 2015) on rebalancing corridors balancing transaction drag vs risk tracking.
export const REBALANCE_DRIFT_CORRIDOR_PERCENT = 5;

export const ASSET_CLASSES = [
  'EQUITY_GLOBAL',
  'EQUITY_US',
  'EQUITY_INDIA',
  'EQUITY_UAE',
  'FIXED_INCOME_GOV',
  'FIXED_INCOME_CORP',
  'SUKUK_SOVEREIGN',
  'SUKUK_CORP',
  'MONEY_MARKET',
  'FX_HEDGE',
] as const;
export type AssetClass = (typeof ASSET_CLASSES)[number];

export const SECURITY_TYPES = ['ETF', 'STOCK', 'BOND', 'SUKUK', 'FUND', 'CASH', 'MUTUAL_FUND_ETF'] as const;
export type SecurityType = (typeof SECURITY_TYPES)[number];

export const BOND_SOLVENCY_GRADES = ['INVESTMENT_GRADE', 'HIGH_YIELD', 'DISTRESSED', 'DEFAULT'] as const;
export const FUNDAMENTAL_SIGNALS = ['STRONG_BUY', 'BUY', 'HOLD', 'UNDERWEIGHT', 'SELL'] as const;
export const TACTICAL_TILTS = ['OVERWEIGHT', 'NEUTRAL', 'UNDERWEIGHT'] as const;


export function isAssetClass(value: string): value is AssetClass {
  return (ASSET_CLASSES as readonly string[]).includes(value);
}
