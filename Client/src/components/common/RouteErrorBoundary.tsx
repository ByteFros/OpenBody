import { isRouteErrorResponse, useRouteError } from 'react-router'

export function RouteErrorBoundary() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Error desconocido'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8" role="alert">
      <h1 className="text-xl font-semibold">Algo ha fallado</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
