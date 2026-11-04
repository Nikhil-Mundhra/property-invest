# C3: Frontend components

## Diagram
```mermaid
flowchart TB
  main[main.tsx] --> app
  subgraph app[app]
    providers[providers] --> router[router]
    router --> guest[GuestRoute: signup, login]
    router --> onboarding[ProtectedRoute: onboarding]
    router --> protected[ProtectedRoute + app shell: dashboard, investments, plan, property detail, portfolio, cashflow, advisory, settings]
    protected --> adminroute[AdminRoute: admin console, tenants, API keys, models]
    router --> share[public: /share/:token]
  end
  subgraph features[features]
    adminfeat[admin: admin api calls]
    advisor[advisor: advisory chat, rationale, evidence]
    aiconfig[ai-config: model provider selection, api keys]
    auth[auth: api, session, forms, error messages]
    finance[finance: cashflow, account queries]
    investments[investments: properties store, deal room, seed benchmarks, add modal]
    marketing[marketing: highlight panel]
    profiling[profiling: profile store, questionnaire, profiling modal, summary card]
    sharing[sharing: shared plan viewer, token link generator]
    wealth[wealth: portfolio state, asset allocation, rebalancing]
  end
  guest --> auth
  guest --> marketing
  protected --> auth
  protected --> profiling
  protected --> investments
  protected --> advisor
  protected --> finance
  protected --> wealth
  onboarding --> profiling
  adminroute --> adminfeat
  adminfeat --> lib
  advisor --> lib
  aiconfig --> lib
  finance --> lib
  investments --> lib
  investments --> ui
  profiling --> ui
  profiling --> lib
  sharing --> lib
  wealth --> lib
  app --> ui
  app --> lib
  auth --> ui[components: ui primitives, layout]
  marketing --> ui
  auth --> lib[lib: api client, query client, forms, errors, validation]
  ui --> lib
  lib --> api[(Backend /api)]
```

## Components
| Path | Responsibility | Depends on |
|---|---|---|
| `frontend/src/app/` | providers; router; `GuestRoute`, `ProtectedRoute`, `AdminRoute` guards; auth pages, onboarding page, signed-in pages inside the app shell (dashboard, investments, plan, property detail), admin console, public `/share/:token` page | features, components, lib, rules |
| `frontend/src/features/admin/` | admin API calls: tenants, API keys and revoke, model settings | lib, contracts |
| `frontend/src/features/advisor/` | advisory chat interface, recommendation stream, evidence drawer | components, lib, contracts |
| `frontend/src/features/ai-config/` | LLM model selection, active provider switching, API key configuration | lib, contracts |
| `frontend/src/features/auth/` | auth API calls, session, signup and login forms, auth error messages | components, lib, contracts, rules |
| `frontend/src/features/finance/` | cashflow queries, account and transaction views | lib, contracts |
| `frontend/src/features/investments/` | property store with optimistic updates and sync, deal room cards, add property modal, benchmark seed loader | components, lib, contracts, rules |
| `frontend/src/features/marketing/` | auth-page highlight panel | components |
| `frontend/src/features/profiling/` | profile store (`localStorage`, keyed by email), profiling questionnaire, country tag input, profiling modal, profile summary card, country list | components, lib, rules, `country-list` |
| `frontend/src/features/sharing/` | shared plan view and share link generation | components, lib, contracts |
| `frontend/src/features/wealth/` | portfolio display, asset allocation, rebalancing proposal queries | components, lib, contracts, rules |
| `frontend/src/components/` | shared UI primitives; layout: app shell (signed-in frame and navigation), split layout (auth pages) | lib |
| `frontend/src/lib/` | API client, query client, contract forms, error and validation messages, class helper, theme and locale stores, UI dictionaries, demo fixture, money formatting, motion hooks, chart colors | contracts, rules |
