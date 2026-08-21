import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

/**
 * Alterna entre claro y oscuro. Al pulsarlo se fija una preferencia explícita, así que
 * se deja de seguir al sistema: es el comportamiento que espera quien toca el interruptor.
 */
export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()
  const goingToDark = resolved === 'light'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={goingToDark ? 'Activar el tema oscuro' : 'Activar el tema claro'}
      onClick={() => setPreference(goingToDark ? 'dark' : 'light')}
    >
      {goingToDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  )
}
