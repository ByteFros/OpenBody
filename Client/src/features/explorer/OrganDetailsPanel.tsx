import { useOrganByMesh } from '@/api/queries'
import { QueryState } from '@/components/common/QueryState'

type OrganDetailsPanelProps = {
  meshId: string | null
}

export function OrganDetailsPanel({ meshId }: OrganDetailsPanelProps) {
  const { data: organ, isPending, error } = useOrganByMesh(meshId)

  if (meshId === null) {
    return <p className="text-sm text-muted-foreground">Selecciona un órgano en el visor.</p>
  }

  return (
    <QueryState isPending={isPending} error={error} skeletonCount={3}>
      {organ && (
        <article className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">{organ.name}</h2>
            <p className="text-sm text-muted-foreground">{organ.system.name}</p>
          </div>
          <p className="text-sm">{organ.description}</p>
        </article>
      )}
    </QueryState>
  )
}
