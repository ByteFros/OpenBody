import { $api } from './client'

/**
 * Hooks de dominio. Las páginas consumen estos y nunca escriben rutas de la API
 * a mano, para que un cambio de endpoint se toque en un solo sitio.
 */

export function useHealth() {
  return $api.useQuery('get', '/health')
}

export function useSystems() {
  return $api.useQuery('get', '/api/v1/systems')
}

export function useSystem(slug: string) {
  return $api.useQuery('get', '/api/v1/systems/{slug}', {
    params: { path: { slug } },
  })
}

export function useOrgans(filters: { q?: string; system?: string } = {}) {
  return $api.useQuery('get', '/api/v1/organs', {
    params: { query: filters },
  })
}

export function useOrgan(slug: string) {
  return $api.useQuery('get', '/api/v1/organs/{slug}', {
    params: { path: { slug } },
  })
}

/**
 * Resuelve la ficha de un órgano a partir del nombre de su malla en el glTF.
 * Es el contrato que usa el visor 3D al detectar un clic sobre una malla.
 * `meshId` es `null` cuando no hay ningún órgano seleccionado: la query queda
 * deshabilitada en vez de pedir una ruta vacía.
 */
export function useOrganByMesh(meshId: string | null) {
  return $api.useQuery(
    'get',
    '/api/v1/organs/by-mesh/{mesh_id}',
    { params: { path: { mesh_id: meshId ?? '' } } },
    { enabled: meshId !== null },
  )
}
