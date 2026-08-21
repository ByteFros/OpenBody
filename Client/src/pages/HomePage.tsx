import { Link } from 'react-router'

import { useHealth } from '@/api/queries'
import { Button } from '@/components/ui/button'

function ApiStatus() {
  const { data, isPending, error } = useHealth()

  if (error) return <span className="text-destructive">sin conexión</span>
  if (isPending) return <span className="text-muted-foreground">comprobando…</span>

  return <span className="text-muted-foreground">{data?.status ?? 'desconocido'}</span>
}

export function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">OpenBody</h1>
        <p className="mt-2 text-muted-foreground">
          Explorador interactivo del cuerpo humano.
        </p>
      </div>

      <p className="text-sm">
        Estado de la API: <ApiStatus />
      </p>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/explorer">Abrir explorador</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/organs">Ver órganos</Link>
        </Button>
      </div>
    </div>
  )
}
