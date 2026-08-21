import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { OrgansPage } from './OrgansPage'
import { jsonResponse, renderWithProviders, requestedUrls } from '@/test/utils'

const organs = [
  { id: 1, slug: 'heart', mesh_id: 'heart', name: 'Corazón' },
  { id: 2, slug: 'lung-left', mesh_id: 'lung_left', name: 'Pulmón izquierdo' },
]

function renderPage() {
  return renderWithProviders(<OrgansPage />, { route: '/organs', path: '/organs' })
}

describe('OrgansPage', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(jsonResponse(organs))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista los órganos devueltos por la API', async () => {
    renderPage()

    expect(await screen.findByText('Corazón')).toBeInTheDocument()
    expect(screen.getByText('Pulmón izquierdo')).toBeInTheDocument()
  })

  it('enlaza cada órgano a su ficha por slug', async () => {
    renderPage()

    const link = await screen.findByRole('link', { name: /Corazón/ })
    expect(link).toHaveAttribute('href', '/organs/heart')
  })

  it('envía el texto del buscador como parámetro q a la API', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('Corazón')

    await user.type(screen.getByLabelText('Buscar órgano'), 'pulm')

    await waitFor(() => {
      expect(requestedUrls(fetchMock).some((url) => url.includes('q=pulm'))).toBe(true)
    })
  })

  it('muestra un aviso cuando la API falla', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /No se han podido cargar los datos/,
    )
  })
})
