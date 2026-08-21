import { Link, useParams } from 'react-router'

import { useOrgan } from '@/api/queries'
import { QueryState } from '@/components/common/QueryState'

export function OrganPage() {
  const { slug = '' } = useParams()
  const { data: organ, isPending, error } = useOrgan(slug)

  return (
    <div className="space-y-6">
      <Link to="/organs" className="text-sm text-muted-foreground hover:text-foreground">
        ← Volver a órganos
      </Link>

      <QueryState isPending={isPending} error={error} skeletonCount={4}>
        {organ && (
          <article className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">{organ.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{organ.system.name}</p>
            </div>

            <p>{organ.description}</p>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <dt>slug</dt>
              <dd>
                <code>{organ.slug}</code>
              </dd>
              <dt>mesh_id</dt>
              <dd>
                <code>{organ.mesh_id}</code>
              </dd>
            </dl>
          </article>
        )}
      </QueryState>
    </div>
  )
}
