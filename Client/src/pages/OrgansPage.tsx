import { useState } from 'react'
import { Link } from 'react-router'

import { useOrgans } from '@/api/queries'
import { QueryState } from '@/components/common/QueryState'
import { Input } from '@/components/ui/input'

export function OrgansPage() {
  const [search, setSearch] = useState('')
  const { data: organs, isPending, error } = useOrgans(search ? { q: search } : {})

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Órganos</h1>

      <Input
        type="search"
        placeholder="Buscar órgano…"
        aria-label="Buscar órgano"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <QueryState isPending={isPending} error={error}>
        {organs?.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay resultados.</p>
        ) : (
          <ul className="space-y-2">
            {organs?.map((organ) => (
              <li key={organ.id}>
                <Link
                  to={`/organs/${organ.slug}`}
                  className="flex items-baseline gap-3 rounded-md border px-4 py-3 hover:bg-accent"
                >
                  <span className="font-medium">{organ.name}</span>
                  <code className="text-xs text-muted-foreground">{organ.mesh_id}</code>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </QueryState>
    </div>
  )
}
