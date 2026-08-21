import type * as THREE from 'three'

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
  const node = nodes[meshId] as THREE.Mesh | undefined

  if (!node?.geometry) {
    throw new Error(`Organ GLB for "${meshId}" has no mesh geometry on node "${meshId}"`)
  }

  const geometry = node.geometry

  // El Human Atlas exporta cada órgano con su propia traslación de nodo (para alinearlo dentro
  // de su escena de origen); al extraer solo `geometry` esa traslación se perdía y los 7 órganos
  // acababan superpuestos en el mismo punto. Hay que sumarla al offset del cuerpo, no descartarla.
  const position: [number, number, number] = [
    node.position.x + BODY_POSITION[0],
    node.position.y + BODY_POSITION[1],
    node.position.z + BODY_POSITION[2],
  ]

  return (
    <OrganMesh meshId={meshId} position={position} isSelected={isSelected} onSelect={onSelect}>
      <primitive object={geometry} attach="geometry" />
    </OrganMesh>
  )
}
