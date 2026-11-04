import { PROPERTIES_ERROR_CODES } from '@wealth-advisor/rules';
import { DomainError } from '#core/domain/domain-error.ts';

export class PropertiesErrors {
  static propertyNotFound(id: string): DomainError {
    return new DomainError(PROPERTIES_ERROR_CODES.propertyNotFound, `property ${id} not found`);
  }

  static invariantViolated(detail: string): DomainError {
    return new DomainError(PROPERTIES_ERROR_CODES.invariantViolated, detail);
  }
}
