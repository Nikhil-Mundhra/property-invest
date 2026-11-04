import type { Context, MiddlewareHandler } from 'hono';
import {
  CreatePropertyInputSchema,
  DeletePropertyResponse,
  PropertyListResponse,
  PropertyResponse,
  UpdatePropertyInputSchema,
} from '@wealth-advisor/contracts';
import { RouteBuilder, type RouteDefinition } from '#core/http/route-builder.ts';
import type { PropertiesApi } from '../../properties.api.ts';

export function propertiesRoutes(api: PropertiesApi, auth: MiddlewareHandler): readonly RouteDefinition[] {
  const guard = [auth];
  const scope = (c: Context) => {
    const principal = c.get('principal') as { tenantId: string; userId: string };
    return { tenantId: principal.tenantId, userId: principal.userId };
  };

  return [
    RouteBuilder.get('/')
      .use(...guard)
      .responds(PropertyListResponse)
      .handle(async ({ c }) => {
        const { tenantId, userId } = scope(c);
        const properties = await api.listProperties(tenantId, userId);
        return { properties };
      }),

    RouteBuilder.post('/')
      .use(...guard)
      .body(CreatePropertyInputSchema)
      .responds(PropertyResponse, 201)
      .handle(async ({ c, body }) => {
        const { tenantId, userId } = scope(c);
        const property = await api.createProperty(tenantId, userId, body);
        return { property };
      }),

    RouteBuilder.post('/reset')
      .use(...guard)
      .responds(PropertyListResponse)
      .handle(async ({ c }) => {
        const { tenantId, userId } = scope(c);
        const properties = await api.resetProperties(tenantId, userId);
        return { properties };
      }),

    RouteBuilder.get('/:id')
      .use(...guard)
      .responds(PropertyResponse)
      .handle(async ({ c }) => {
        const { tenantId, userId } = scope(c);
        const id = c.req.param('id') ?? '';
        const property = await api.getProperty(tenantId, userId, id);
        return { property };
      }),

    RouteBuilder.put('/:id')
      .use(...guard)
      .body(UpdatePropertyInputSchema)
      .responds(PropertyResponse)
      .handle(async ({ c, body }) => {
        const { tenantId, userId } = scope(c);
        const id = c.req.param('id') ?? '';
        const property = await api.updateProperty(tenantId, userId, id, body);
        return { property };
      }),

    RouteBuilder.delete('/:id')
      .use(...guard)
      .responds(DeletePropertyResponse)
      .handle(async ({ c }) => {
        const { tenantId, userId } = scope(c);
        const id = c.req.param('id') ?? '';
        return api.deleteProperty(tenantId, userId, id);
      }),
  ];
}
