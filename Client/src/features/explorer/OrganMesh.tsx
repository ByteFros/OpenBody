import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'

type OrganMeshProps = {
  meshId: string
  position: [number, number, number]
  isSelected: boolean
  onSelect: (meshId: string) => void
  children: React.ReactNode
}

const BASE_COLOR = '#f87171'
const HOVER_COLOR = '#fb923c'
const SELECTED_COLOR = '#facc15'

/** Primitiva clicable/hoverable de un órgano; el nombre de la malla es el mesh_id real del backend. */
export function OrganMesh({ meshId, position, isSelected, onSelect, children }: OrganMeshProps) {
  const [isHovered, setIsHovered] = useState(false)

  const color = isSelected ? SELECTED_COLOR : isHovered ? HOVER_COLOR : BASE_COLOR

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    onSelect(meshId)
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }

  function handlePointerOut() {
    setIsHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <mesh
      name={meshId}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}
      <meshStandardMaterial
        color={color}
        emissive={isSelected ? SELECTED_COLOR : '#000000'}
        emissiveIntensity={isSelected ? 0.4 : 0}
      />
    </mesh>
  )
}
