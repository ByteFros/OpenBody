import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OrganPage } from './OrganPage'
import { jsonResponse, renderWithProviders, requestedUrls } from '@/test/utils'

const heart = {
  id: 1,
  slug: 'heart',
  mesh_id: 'heart',
  name: 'Corazón',
  description: 'Órgano muscular que bombea sangre.',
  system: { id: 1, slug: 'cardiovascular', name: 'Sistema cardiovascular', description: null },
}

function renderPage(slug = 'heart') {
  return renderWithProviders(<OrganPage />, {
    route: `/organs/${slug}`,
    path: '/organs/:slug',
  })
}

describe('OrganPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra la ficha del órgano con su sistema y mesh_id', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(heart)))
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Corazón' })).toBeInTheDocument()
    expect(screen.getByText('Sistema cardiovascular')).toBeInTheDocument()
    expect(screen.getByText(heart.description)).toBeInTheDocument()
  })

  it('pide a la API el slug que viene en la URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(heart))
    vi.stubGlobal('fetch', fetchMock)

    renderPage('liver')

    await screen.findByRole('heading', { name: 'Corazón' })
    expect(requestedUrls(fetchMock)[0]).toContain('/api/v1/organs/liver')
  })

  it('muestra un estado de error legible cuando el órgano no existe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ detail: "Organ 'noexiste' not found" }, 404)),
    )
    renderPage('noexiste')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /No se han podido cargar los datos/,
    )
  })
})
