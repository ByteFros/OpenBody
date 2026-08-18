import { HumanBody } from './HumanBody'
import { OrganMesh } from './OrganMesh'

type PlaceholderBodyProps = {
  selectedMeshId: string | null
  onSelect: (meshId: string | null) => void
}

/**
 * Cada OrganMesh se nombra igual que el mesh_id real del seed (Server/scripts/seed.py).
 * El cuerpo de referencia es el HumanBase.glb exportado de Blender/MPFB (ver HumanBody.tsx).
 * Las posiciones/tamaños de los órganos están calculadas contra el bounding box real del
 * modelo (ancho ±0.30, alto -0.87..0.87, profundidad -0.10..0.22 en este mismo sistema de
 * coordenadas) para que entren dentro de la silueta; siguen siendo placeholders geométricos
 * hasta tener las mallas anatómicas reales.
 *
 * `BODY_SCALE` agranda el conjunto completo (cuerpo + órganos) para facilitar la interacción;
 * al aplicarse sobre este `<group>` no rompe la correspondencia con el modelo real, y cuando
 * lleguen las mallas de órganos reales (exportadas del mismo Blender) heredarán la misma escala.
 */
const BODY_SCALE = 2

export function PlaceholderBody({ selectedMeshId, onSelect }: PlaceholderBodyProps) {
  return (
    <group scale={BODY_SCALE}>
      <HumanBody onSelect={onSelect} />

      <OrganMesh meshId="heart" position={[-0.03, 0.38, 0.1]} isSelected={selectedMeshId === 'heart'} onSelect={onSelect}>
        <sphereGeometry args={[0.09, 24, 24]} />
      </OrganMesh>

      <OrganMesh
        meshId="lung_left"
        position={[-0.14, 0.4, 0.05]}
        isSelected={selectedMeshId === 'lung_left'}
        onSelect={onSelect}
      >
        <sphereGeometry args={[0.115, 16, 24]} />
      </OrganMesh>

      <OrganMesh
        meshId="lung_right"
        position={[0.14, 0.4, 0.05]}
        isSelected={selectedMeshId === 'lung_right'}
        onSelect={onSelect}
      >
        <sphereGeometry args={[0.115, 16, 24]} />
      </OrganMesh>

      <OrganMesh meshId="liver" position={[0.13, 0.22, 0.1]} isSelected={selectedMeshId === 'liver'} onSelect={onSelect}>
        <boxGeometry args={[0.16, 0.11, 0.1]} />
      </OrganMesh>

      <OrganMesh meshId="stomach" position={[-0.12, 0.18, 0.09]} isSelected={selectedMeshId === 'stomach'} onSelect={onSelect}>
        <sphereGeometry args={[0.09, 16, 16]} />
      </OrganMesh>

      <OrganMesh
        meshId="kidney_left"
        position={[-0.1, 0.12, -0.06]}
        isSelected={selectedMeshId === 'kidney_left'}
        onSelect={onSelect}
      >
        <boxGeometry args={[0.06, 0.1, 0.05]} />
      </OrganMesh>

      <OrganMesh
        meshId="kidney_right"
        position={[0.1, 0.12, -0.06]}
        isSelected={selectedMeshId === 'kidney_right'}
        onSelect={onSelect}
      >
        <boxGeometry args={[0.06, 0.1, 0.05]} />
      </OrganMesh>
    </group>
  )
}
