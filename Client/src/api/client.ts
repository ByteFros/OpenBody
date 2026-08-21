import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'

import type { paths } from './schema'

export const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  // Resolvemos globalThis.fetch en cada llamada en vez de capturarlo al crear el
  // cliente: así los tests pueden sustituirlo y el comportamiento en producción
  // es idéntico.
  fetch: (request) => globalThis.fetch(request),
})

/** Cliente tipado contra el OpenAPI del backend. Expone hooks de TanStack Query. */
export const $api = createClient(fetchClient)
