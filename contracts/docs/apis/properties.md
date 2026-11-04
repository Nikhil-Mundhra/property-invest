# Properties APIs

## GET /api/properties
- responsibility: return all real estate properties for the caller's scope (tenant and user). If no properties exist in the database for this caller, automatically seeds the standard Dubai portfolio (6 benchmark assets: Sobha Hartland, Dubai Hills Estate, JVC, Dubai Creek Harbour, Palm Jebel Ali, and Downtown Dubai) and returns them.
- contract: response `PropertyListResponse` 200, errors `CORE_DB_UNCONFIGURED`; auth optional Bearer (defaults to demo scope when unauthenticated).

## POST /api/properties
- responsibility: add a new real estate property to the caller's portfolio with full statutory parameters (price, financing type, down payment, mortgage parameters, expected rent, service charge, off-plan milestones, developer details).
- contract: request `CreatePropertyInputSchema`, response `PropertyResponse` 201, errors `CORE_INVALID_JSON`, `CORE_VALIDATION_FAILED`, `CORE_DB_UNCONFIGURED`; auth optional Bearer (persists under authenticated user or demo scope).

## GET /api/properties/:id
- responsibility: fetch a single property by its identifier within the caller's scope.
- contract: response `PropertyResponse` 200, errors `PR_1001`, `CORE_DB_UNCONFIGURED`; auth optional Bearer.

## PUT /api/properties/:id
- responsibility: update fields of an existing real estate property within the caller's scope.
- contract: request `UpdatePropertyInputSchema`, response `PropertyResponse` 200, errors `CORE_INVALID_JSON`, `CORE_VALIDATION_FAILED`, `PR_1001`, `CORE_DB_UNCONFIGURED`; auth optional Bearer.

## DELETE /api/properties/:id
- responsibility: remove a property from the caller's portfolio.
- contract: response `DeletePropertyResponse` 200, errors `PR_1001`, `CORE_DB_UNCONFIGURED`; auth optional Bearer.

## POST /api/properties/reset
- responsibility: reset the caller's property collection back to the 6 Dubai benchmark properties.
- contract: response `PropertyListResponse` 200, errors `CORE_DB_UNCONFIGURED`; auth optional Bearer.
