import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QueryState } from './QueryState'

describe('QueryState', () => {
  it('muestra el contenido cuando hay datos', () => {
    render(
      <QueryState isPending={false} error={null}>
        <p>contenido</p>
      </QueryState>,
    )

    expect(screen.getByText('contenido')).toBeInTheDocument()
  })

  it('muestra el esqueleto mientras la query está pendiente', () => {
    render(
      <QueryState isPending error={null}>
        <p>contenido</p>
      </QueryState>,
    )

    expect(screen.getByLabelText('Cargando')).toBeInTheDocument()
    expect(screen.queryByText('contenido')).not.toBeInTheDocument()
  })

  it('prioriza el error sobre el estado pendiente', () => {
    // Un fallo con reintento en cola deja isPending en true y error a null hasta
    // agotarlos; cuando el error llega debe verse aunque siga pendiente.
    render(
      <QueryState isPending error={{ detail: 'not found' }}>
        <p>contenido</p>
      </QueryState>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByLabelText('Cargando')).not.toBeInTheDocument()
  })
})
