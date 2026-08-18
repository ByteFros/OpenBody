import { useState } from 'react'

import { OrganDetailsPanel } from '@/features/explorer/OrganDetailsPanel'
import { Scene } from '@/features/explorer/Scene'

export function ExplorerPage() {
  const [selectedMeshId, setSelectedMeshId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Explorador 3D</h1>

      <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
        <Scene selectedMeshId={selectedMeshId} onSelect={setSelectedMeshId} />

        <aside className="rounded-lg border p-4">
          <OrganDetailsPanel meshId={selectedMeshId} />
        </aside>
      </div>
    </div>
  )
}
