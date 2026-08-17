import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router'

import { createQueryClient } from '@/lib/queryClient'

/**
 * Renderiza un componente dentro de un router en memoria y un QueryClient
 * aislado que reutiliza la configuración real de la app (solo desactiva los
 * reintentos, para que los tests de error no esperen).
 */
export function renderWithProviders(
  ui: ReactNode,
  { route = '/', path = '/' }: { route?: string; path?: string } = {},
) {
  const queryClient = createQueryClient({ retry: false })

  const router = createMemoryRouter([{ path, element: ui }], {
    initialEntries: [route],
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

/** Respuesta JSON real, para que openapi-fetch la parsee como en producción. */
export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** URLs pedidas por un mock de fetch. openapi-fetch le pasa objetos Request. */
export function requestedUrls(fetchMock: { mock: { calls: unknown[][] } }): string[] {
  return fetchMock.mock.calls.map((call) => {
    const [input] = call
    return input instanceof Request ? input.url : String(input)
  })
}
