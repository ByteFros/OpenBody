import { OrganMesh } from './OrganMesh'
import { ORGANS_BASE, useOrganGLTF } from './organGeometry'

// Mismo offset que HumanBody.tsx: los organos se exportaron en el sistema de coordenadas
// del cuerpo (pies en Y=0), no en el ya centrado que usa el grupo del visor.
const BODY_POSITION: [number, number, number] = [0, -0.87, 0]

type RealOrganMeshProps = {
  meshId: string
  isSelected: boolean
  onSelect: (meshId: string) => void
}

/** Órgano real exportado de Blender (ver project_openbody_organos_human_atlas). */
export function RealOrganMesh({ meshId, isSelected, onSelect }: RealOrganMeshProps) {
  const { nodes } = useOrganGLTF(`${ORGANS_BASE}/${meshId}.glb`)
  const geometry = nodes[meshId]?.geometry

  if (!geometry) {
    throw new Error(`Organ GLB for "${meshId}" has no mesh geometry on node "${meshId}"`)
  }

  return (
    <OrganMesh meshId={meshId} position={BODY_POSITION} isSelected={isSelected} onSelect={onSelect}>
      <primitive object={geometry} attach="geometry" />
    </OrganMesh>
  )
}
