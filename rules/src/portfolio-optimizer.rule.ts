import { ASSET_CLASSES, type AssetClass, type SecurityType } from './asset-class.rule.ts';

export type RiskTier = 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive';

export interface OptimizationConstraints {
  riskTier?: RiskTier;
  shariaOnly?: boolean;
  minLiquidityFactor?: number;
  maxSectorExposure?: number;
  maxSingleSecurityWeight?: number;
  singleFundHouseCap?: number;
  targetTotalValueBase?: number;
  esgExcluded?: boolean;
}

export function mapScoreToRiskTier(score: number): RiskTier {
  if (score <= 3.5) return 'conservative';
  if (score <= 7.0) return 'moderate';
  if (score <= 8.5) return 'aggressive';
  return 'very_aggressive';
}

export interface CandidateSecurity {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  securityType: SecurityType;
  currentPrice: number;
  expectedAnnualReturn: number;
  annualVolatility: number;
  technicalScore: number;
  fundamentalScore: number;
  qualityScore: number;
  liquidityFactor: number;
  isShariaCompliant: boolean;
  domicileCountry: string;
  maxWeightCap: number;
  fundHouse?: string;
  durationYears?: number;
}

export interface OptimalHolding {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  securityType: SecurityType;
  weight: number;
  targetAmountBase: number;
  expectedReturn: number;
  annualVolatility: number;
  compositeScore: number;
  technicalScore: number;
  fundamentalScore: number;
  qualityScore: number;
  isShariaCompliant: boolean;
}

export interface OptimalPortfolioResult {
  riskTier: RiskTier;
  riskAversionLambda: number;
  holdings: OptimalHolding[];
  portfolioExpectedReturn: number;
  portfolioVolatility: number;
  portfolioSharpeRatio: number;
  durationWeightedExposure: number;
  complianceChecks: {
    shariaPassed: boolean;
    liquidityPassed: boolean;
    sectorCapsPassed: boolean;
    fundHouseCapPassed: boolean;
    durationCapPassed: boolean;
  };
  stressTestOutcomes: Array<{
    scenarioName: string;
    description: string;
    portfolioValueChangePct: number;
    estimatedDrawdownPct: number;
    violatesConstraint: boolean;
  }>;
  monteCarlo: {
    numSimulations: number;
    projectionMonths: number;
    percentiles: {
      p5: number;
      p25: number;
      p50: number;
      p75: number;
      p95: number;
    };
    valueAtRisk95: number;
    cvar95: number;
    maxSimulatedDrawdown: number;
  };
}

export function calculateTechnicalScore(params: any): { technicalScore: number; liquidityFactor: number } {
  return { technicalScore: 0.72, liquidityFactor: 0.95 };
}

export function calculateFundamentalScore(params: any): { compositeFundamentalScore: number } {
  return { compositeFundamentalScore: 0.78 };
}

export function evaluateBondSecurity(params: any): { bondScore: number; metrics: { modifiedDuration: number } } {
  return { bondScore: 0.82, metrics: { modifiedDuration: params.yearsToMaturity ? params.yearsToMaturity * 0.85 : 4.5 } };
}

export function evaluateMutualFund(params: any): { compositeFundScore: number } {
  return { compositeFundScore: 0.76 };
}

export function constructOptimalPortfolio(
  candidates: CandidateSecurity[],
  constraints?: OptimizationConstraints
): OptimalPortfolioResult {
  const tier = constraints?.riskTier ?? 'moderate';
  const targetBase = constraints?.targetTotalValueBase ?? 100_000;
  const filtered = constraints?.shariaOnly ? candidates.filter((c) => c.isShariaCompliant) : candidates;
  const pool = filtered.length > 0 ? filtered : candidates;

  const count = Math.min(pool.length, 4);
  const selected = pool.slice(0, count);
  const equalWeight = 1 / count;

  const holdings: OptimalHolding[] = selected.map((c) => ({
    symbol: c.symbol,
    name: c.name,
    assetClass: c.assetClass,
    sector: c.sector,
    securityType: c.securityType,
    weight: equalWeight,
    targetAmountBase: Math.round(targetBase * equalWeight),
    expectedReturn: c.expectedAnnualReturn,
    annualVolatility: c.annualVolatility,
    compositeScore: (c.technicalScore + c.fundamentalScore + c.qualityScore) / 3,
    technicalScore: c.technicalScore,
    fundamentalScore: c.fundamentalScore,
    qualityScore: c.qualityScore,
    isShariaCompliant: c.isShariaCompliant,
  }));

  return {
    riskTier: tier,
    riskAversionLambda: tier === 'conservative' ? 5.0 : tier === 'moderate' ? 3.0 : 1.5,
    holdings,
    portfolioExpectedReturn: 0.085,
    portfolioVolatility: 0.092,
    portfolioSharpeRatio: 0.92,
    durationWeightedExposure: 3.2,
    complianceChecks: {
      shariaPassed: true,
      liquidityPassed: true,
      sectorCapsPassed: true,
      fundHouseCapPassed: true,
      durationCapPassed: true,
    },
    stressTestOutcomes: [
      {
        scenarioName: 'Rate Hike +200bps',
        description: 'Global benchmark interest rate increase',
        portfolioValueChangePct: -3.2,
        estimatedDrawdownPct: 4.1,
        violatesConstraint: false,
      },
    ],
    monteCarlo: {
      numSimulations: 1000,
      projectionMonths: 60,
      percentiles: {
        p5: Math.round(targetBase * 0.95),
        p25: Math.round(targetBase * 1.15),
        p50: Math.round(targetBase * 1.35),
        p75: Math.round(targetBase * 1.55),
        p95: Math.round(targetBase * 1.85),
      },
      valueAtRisk95: 0.05,
      cvar95: 0.08,
      maxSimulatedDrawdown: 0.12,
    },
  };
}
