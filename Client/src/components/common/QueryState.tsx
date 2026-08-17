import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

type QueryStateProps = {
  /**
   * `isPending` de TanStack Query, no `isLoading`: isLoading es
   * `isPending && isFetching`, así que se queda en false mientras la petición
   * está en espera de reintento y la pantalla acabaría vacía.
   */
  isPending: boolean
  error: unknown
  children: ReactNode
  skeletonCount?: number
}

/**
 * Envoltorio para los estados de carga y error de TanStack Query, para no
 * repetir el mismo `if (...) ...` en cada página.
 */
export function QueryState({ isPending, error, children, skeletonCount = 3 }: QueryStateProps) {
  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        No se han podido cargar los datos. ¿Está el servidor levantado?
      </p>
    )
  }

  if (isPending) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Cargando">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  return <>{children}</>
}
