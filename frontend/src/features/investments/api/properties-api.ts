import {
  CreatePropertyInputSchema,
  type CreatePropertyInput,
  type DeletePropertyResponse,
  DeletePropertyResponse as DeletePropertyResponseSchema,
  PropertyListResponse,
  type PropertyItem,
  PropertyResponse,
  type UpdatePropertyInput,
  UpdatePropertyInputSchema,
} from '@wealth-advisor/contracts';
import { apiRequest } from '../../../lib/api-client.ts';

export const propertiesApi = {
  getProperties: async (): Promise<PropertyItem[]> => {
    const res = await apiRequest('/properties', {
      method: 'GET',
      response: PropertyListResponse,
      authenticated: true,
    });
    return res.properties;
  },

  getProperty: async (id: string): Promise<PropertyItem> => {
    const res = await apiRequest(`/properties/${encodeURIComponent(id)}`, {
      method: 'GET',
      response: PropertyResponse,
      authenticated: true,
    });
    return res.property;
  },

  createProperty: async (input: CreatePropertyInput): Promise<PropertyItem> => {
    const res = await apiRequest('/properties', {
      method: 'POST',
      body: input,
      response: PropertyResponse,
      authenticated: true,
    });
    return res.property;
  },

  updateProperty: async (id: string, input: UpdatePropertyInput): Promise<PropertyItem> => {
    const res = await apiRequest(`/properties/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
      response: PropertyResponse,
      authenticated: true,
    });
    return res.property;
  },

  deleteProperty: async (id: string): Promise<DeletePropertyResponse> => {
    return apiRequest(`/properties/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      response: DeletePropertyResponseSchema,
      authenticated: true,
    });
  },

  resetProperties: async (): Promise<PropertyItem[]> => {
    const res = await apiRequest('/properties/reset', {
      method: 'POST',
      response: PropertyListResponse,
      authenticated: true,
    });
    return res.properties;
  },
};
