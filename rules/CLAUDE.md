# Rules

## Route
- error catalogue: prefixes, number bands, code → status → meaning → `rules/docs/index.md`

## Axes
- adding an error code → `backend/agents/errors.md`
- field validation text → `frontend/agents/forms.md`

## Rules
- Imports nothing (no zod, no node, no other repo); exports constants, pure `is*`/`normalize*` functions and their types; `is*` expects normalized input.
- Error codes and validation keys are wire-visible: never reuse, rename or renumber; keys are `<field>.<reason>`.
- `EMAIL_PATTERN` copies zod's `z.email()`; re-check it on zod upgrades.

## Workflow
- new validation key: `rules/src/validation-keys.ts` → contract field → text in `frontend/src/lib/validation/validation-messages.ts`

## File structure

```
rules/package.json : exports src/index.ts directly; no dependencies
rules/src/analytics.rule.ts : trading days per year, snapshot window days, minimum snapshot observations
rules/src/asset-class.rule.ts : ASSET_CLASSES, AssetClass, isAssetClass
rules/src/burn-rate.rule.ts : RUNWAY_CRITICAL/HEALTHY_MONTHS, RunwayBand, runwayBand
rules/src/client-type.rule.ts : CLIENT_TYPES, ClientType, isClientType
rules/src/currency.rule.ts : supported currencies including AED and INR, Currency, CURRENCY_MINOR_UNITS, isCurrency
rules/src/display-name.rule.ts : max length, normalize, isDisplayName
rules/src/email.rule.ts : max length, pattern (copied from zod), normalize, isEmail
rules/src/error-codes.ts : module prefixes, CORE, AUTH, MARKET, PROPERTIES, and ANALYTICS codes, ErrorCode types
rules/src/household-mode.rule.ts : HOUSEHOLD_MODES, HouseholdMode, isHouseholdMode
rules/src/index.ts : public barrel
rules/src/llm-provider.rule.ts : LLM_PROVIDERS, LlmProvider, isLlmProvider
rules/src/locale.rule.ts : LOCALES, Locale, DEFAULT_LOCALE, isLocale
rules/src/market-data.rule.ts : Marketstack quota, page size and page cap; history depth; provider timeout; FX lookback days
rules/src/password.rule.ts : min/max length, isPasswordLength
rules/src/permission-tier.rule.ts : PERMISSION_TIERS, PermissionTier, isPermissionTier
rules/src/personal-housing.rule.ts : calculateTotalMonthlyCostOfOwnership, calculateLifestyleSuitabilityScore
rules/src/portfolio-optimizer.rule.ts : RISK_TIERS, mapScoreToRiskTier, constructOptimalPortfolio
rules/src/profiling.rule.ts : PROFILING_QUESTIONS, per-currency holdings, calculateBaseRiskScore, mapStressAnswerToRiskBand, deriveTimeHorizonYears, deriveCorridorCurrencies
rules/src/property-yield.rule.ts : calculatePropertyReturns, calculateGrossRentalYield, calculateNetRentalYield, calculateCashOnCashReturn
rules/src/refresh-token.rule.ts : byte count, base64url pattern, isRefreshToken
rules/src/role.rule.ts : ROLES (USER, ADVISOR, ADMIN), Role, ADVISOR_ROLE, ADMIN_ROLE, DEFAULT_ROLES, USER_STATUSES, UserStatus, hasAdvisorRole
rules/src/tenant.rule.ts : TENANT_PLANS, TENANT_STATUSES, API_KEY_PERMISSIONS, API_KEY_STATUSES
rules/src/uae-golden-visa.rule.ts : checkGoldenVisaEligibility (2026 circular standards: 0% equity minimum, AED 2M threshold, spouse combining)
rules/src/uae-mortgage.rule.ts : getUaeMortgageMaxLtv, calculateMonthlyEmi, evaluateDebtBurdenRatio (CBUAE Circular No. 31/2013)
rules/src/uae-property-fees.rule.ts : calculateAcquisitionFees (4% DLD fee, 2% broker commission, trustee fee, direct developer off-plan exemptions)
rules/src/validation-keys.ts : VALIDATION_KEYS, ValidationKey, isValidationKey
rules/src/viewport.rule.ts : MIN_TOUCH_TARGET_PX, MOBILE_BREAKPOINT_PX
rules/tsconfig.json : typecheck settings
```
