import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_URL = '/models/HumanBase.glb'
const DRACO_DECODER_PATH = '/draco/'

// El export de Blender arrastra objetos de la escena que no son el cuerpo (ej. el Cube por defecto).
const IGNORED_NODE_NAMES = new Set(['Cube'])

type HumanBodyProps = {
  onSelect: (meshId: string | null) => void
}

/**
 * Cuerpo base exportado de Blender/MPFB (ver Client/public/models/HumanBase.glb).
 * Se muestra semi-transparente para que los OrganMesh se vean a través de la piel.
 */
export function HumanBody({ onSelect }: HumanBodyProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH)

  useEffect(() => {
    scene.traverse((child) => {
      if (IGNORED_NODE_NAMES.has(child.name)) {
        child.visible = false
        return
      }

      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.transparent = true
            material.opacity = 0.25
            material.depthWrite = false
          }
        })
      }
    })
  }, [scene])

  function handleClick(event: ThreeEvent<MouseEvent>) {
    // La piel está siempre más cerca de la cámara que los órganos reales (que ahora viven dentro
    // de la cavidad torácica, no fuera de ella como las esferas placeholder). Si el rayo también
    // atraviesa un órgano detrás de la piel, hay que dejarlo pasar para que reciba el clic en vez
    // de deseleccionar aquí.
    if (event.intersections.length > 1) return

    event.stopPropagation()
    onSelect(null)
  }

  // El modelo tiene los pies en y=0 y la cabeza en y≈1.73 (metros);
  // se baja a la mitad para centrarlo verticalmente, igual que la cápsula de referencia anterior.
  return <primitive object={scene} position={[0, -0.87, 0]} onClick={handleClick} />
}

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH)
