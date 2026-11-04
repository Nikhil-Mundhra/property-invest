import type { ObjectId } from 'mongodb';
import type { PropertyItem } from '@wealth-advisor/contracts';

export const PROPERTIES_COLLECTION = 'properties';

export interface PropertyDocument extends PropertyItem {
  _id?: ObjectId | string;
  tenantId: string;
  userId: string;
  updatedAt?: string;
}
