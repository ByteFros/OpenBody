import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OrganDetailsPanel } from './OrganDetailsPanel'
import { jsonResponse, renderWithProviders } from '@/test/utils'

const heart = {
  id: 1,
  slug: 'heart',
  mesh_id: 'heart',
  name: 'Corazón',
  description: 'Órgano muscular que bombea sangre.',
  system: { id: 1, slug: 'cardiovascular', name: 'Sistema cardiovascular', description: null },
}

describe('OrganDetailsPanel', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('invita a seleccionar un órgano cuando no hay ninguno elegido', () => {
    renderWithProviders(<OrganDetailsPanel meshId={null} />)

    expect(screen.getByText(/Selecciona un órgano/)).toBeInTheDocument()
  })

  it('muestra la ficha del órgano resuelto por mesh_id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(heart)))
    renderWithProviders(<OrganDetailsPanel meshId="heart" />)

    expect(await screen.findByRole('heading', { name: 'Corazón' })).toBeInTheDocument()
    expect(screen.getByText('Sistema cardiovascular')).toBeInTheDocument()
  })

  it('muestra un estado de error legible si el mesh_id no resuelve ningún órgano', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ detail: "Organ with mesh_id 'x' not found" }, 404)),
    )
    renderWithProviders(<OrganDetailsPanel meshId="x" />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/No se han podido cargar los datos/)
  })
})
