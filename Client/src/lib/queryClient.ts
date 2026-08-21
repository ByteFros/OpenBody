import { QueryClient, type QueryClientConfig } from '@tanstack/react-query'

type QueryDefaults = NonNullable<QueryClientConfig['defaultOptions']>['queries']

export const queryDefaults: QueryDefaults = {
  // No dependemos de navigator.onLine: da falsos negativos (navegadores
  // headless, algunas VPN) y con el modo 'online' por defecto las peticiones se
  // quedan en fetchStatus 'paused', dejando la pantalla en blanco sin datos ni
  // error.
  networkMode: 'always',

  // Sin reintentos, a propósito. Con retry > 0 hemos comprobado que la query se
  // queda colgada en fetchStatus 'paused' entre intento e intento y nunca llega
  // a status 'error', así que la UI no muestra nunca el fallo (reproducido con y
  // sin StrictMode, con networkMode 'always'). Además la API es de solo lectura:
  // un 404 no va a acertar en el segundo intento, así que reintentar solo
  // retrasaría el mensaje de error.
  retry: 0,

  refetchOnWindowFocus: false,
}

export function createQueryClient(overrides: QueryDefaults = {}) {
  return new QueryClient({
    defaultOptions: { queries: { ...queryDefaults, ...overrides } },
  })
}
