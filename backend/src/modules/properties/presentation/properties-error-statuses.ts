import { PROPERTIES_ERROR_CODES, type PropertiesErrorCode } from '@wealth-advisor/rules';

export const PROPERTIES_ERROR_STATUSES: Readonly<Record<PropertiesErrorCode, number>> = {
  [PROPERTIES_ERROR_CODES.propertyNotFound]: 404,
  [PROPERTIES_ERROR_CODES.invariantViolated]: 500,
};
