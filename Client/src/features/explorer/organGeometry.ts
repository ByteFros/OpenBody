import { useGLTF } from '@react-three/drei'

const DRACO_DECODER_PATH = '/draco/'
export const ORGANS_BASE = '/models/organs'

/**
 * Carga un GLB de órgano (ver project_openbody_organos_human_atlas). useGLTF ya expone `nodes`
 * indexado por el nombre exacto de cada objeto de Blender, que es igual al mesh_id
 * (heart.name = "heart" en el export), así que no hace falta recorrer la escena a mano.
 */
export function useOrganGLTF(url: string) {
  return useGLTF(url, DRACO_DECODER_PATH)
}

export function preloadOrganGeometry(url: string) {
  useGLTF.preload(url, DRACO_DECODER_PATH)
}
