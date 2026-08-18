import { OrganMesh } from './OrganMesh'

type PlaceholderBodyProps = {
  selectedMeshId: string | null
  onSelect: (meshId: string | null) => void
}

/**
 * Cuerpo de prueba hecho con geometrías de Three.js, sin ningún asset externo.
 * Cada OrganMesh se nombra igual que el mesh_id real del seed (Server/scripts/seed.py),
 * así que el día que llegue el glTF de Blender solo hay que sustituir este componente.
 */
export function PlaceholderBody({ selectedMeshId, onSelect }: PlaceholderBodyProps) {
  return (
    <group>
      {/* Torso de referencia visual, no es un órgano: clicarlo deselecciona */}
      <mesh position={[0, 0, 0]} onClick={() => onSelect(null)}>
        <capsuleGeometry args={[1.1, 2, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      <OrganMesh meshId="heart" position={[0.2, 0.6, 0.5]} isSelected={selectedMeshId === 'heart'} onSelect={onSelect}>
        <sphereGeometry args={[0.28, 24, 24]} />
      </OrganMesh>

      <OrganMesh
        meshId="lung_left"
        position={[-0.55, 0.7, 0.2]}
        isSelected={selectedMeshId === 'lung_left'}
        onSelect={onSelect}
      >
        <sphereGeometry args={[0.35, 16, 24]} />
      </OrganMesh>

      <OrganMesh
        meshId="lung_right"
        position={[0.65, 0.7, 0.2]}
        isSelected={selectedMeshId === 'lung_right'}
        onSelect={onSelect}
      >
        <sphereGeometry args={[0.35, 16, 24]} />
      </OrganMesh>

      <OrganMesh meshId="liver" position={[0.4, -0.1, 0.4]} isSelected={selectedMeshId === 'liver'} onSelect={onSelect}>
        <boxGeometry args={[0.6, 0.35, 0.4]} />
      </OrganMesh>

      <OrganMesh meshId="stomach" position={[-0.35, -0.15, 0.45]} isSelected={selectedMeshId === 'stomach'} onSelect={onSelect}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </OrganMesh>

      <OrganMesh
        meshId="kidney_left"
        position={[-0.5, -0.5, -0.3]}
        isSelected={selectedMeshId === 'kidney_left'}
        onSelect={onSelect}
      >
        <boxGeometry args={[0.25, 0.4, 0.2]} />
      </OrganMesh>

      <OrganMesh
        meshId="kidney_right"
        position={[0.5, -0.5, -0.3]}
        isSelected={selectedMeshId === 'kidney_right'}
        onSelect={onSelect}
      >
        <boxGeometry args={[0.25, 0.4, 0.2]} />
      </OrganMesh>
    </group>
  )
}
