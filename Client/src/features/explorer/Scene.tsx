import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { Button } from '@/components/ui/button'
import { PlaceholderBody } from './PlaceholderBody'

type SceneProps = {
  selectedMeshId: string | null
  onSelect: (meshId: string | null) => void
}

export function Scene({ selectedMeshId, onSelect }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <div className="relative h-[28rem] rounded-lg border">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1} />
        <Suspense fallback={null}>
          <PlaceholderBody selectedMeshId={selectedMeshId} onSelect={onSelect} />
        </Suspense>
        <OrbitControls ref={controlsRef} makeDefault minDistance={2} maxDistance={10} />
      </Canvas>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="absolute right-3 top-3"
        onClick={() => controlsRef.current?.reset()}
      >
        Resetear vista
      </Button>
    </div>
  )
}
