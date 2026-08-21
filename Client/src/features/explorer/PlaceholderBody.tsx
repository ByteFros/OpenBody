import { HumanBody } from './HumanBody'
import { ORGANS_BASE, preloadOrganGeometry } from './organGeometry'
import { RealOrganMesh } from './RealOrganMesh'

type PlaceholderBodyProps = {
  selectedMeshId: string | null
  onSelect: (meshId: string | null) => void
}

const REAL_ORGAN_MESH_IDS = [
  'heart',
  'liver',
  'lung_left',
  'lung_right',
  'kidney_left',
  'kidney_right',
  'stomach',
] as const

REAL_ORGAN_MESH_IDS.forEach((meshId) => preloadOrganGeometry(`${ORGANS_BASE}/${meshId}.glb`))

/**
 * Cada RealOrganMesh se nombra igual que el mesh_id real del seed (Server/scripts/seed.py).
 * El cuerpo de referencia es el HumanBase.glb exportado de Blender/MPFB (ver HumanBody.tsx).
 * Los 7 órganos (ver project_openbody_organos_human_atlas y project_openbody_organos_bodyparts3d)
 * ya vienen posicionados anatómicamente en Blender contra el mismo cuerpo — no llevan position
 * prop propia, RealOrganMesh reusa el offset de HumanBody.
 *
 * `BODY_SCALE` agranda el conjunto completo (cuerpo + órganos) para facilitar la interacción.
 */
const BODY_SCALE = 2

export function PlaceholderBody({ selectedMeshId, onSelect }: PlaceholderBodyProps) {
  return (
    <group scale={BODY_SCALE}>
      <HumanBody onSelect={onSelect} />

      {REAL_ORGAN_MESH_IDS.map((meshId) => (
        <RealOrganMesh key={meshId} meshId={meshId} isSelected={selectedMeshId === meshId} onSelect={onSelect} />
      ))}
    </group>
  )
}
