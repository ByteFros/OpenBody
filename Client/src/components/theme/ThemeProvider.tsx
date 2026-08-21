import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  ThemeContext,
  applyTheme,
  readStoredPreference,
  resolveTheme,
  storePreference,
  subscribeToSystemTheme,
  type ThemePreference,
} from '@/lib/theme'

/**
 * Mantiene la clase `.dark` del documento en sintonía con la preferencia elegida.
 * El primer pintado ya lo resuelve el script inline de index.html; esto se encarga
 * del resto de la vida de la app (cambios manuales y cambios del sistema).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference)
  const [resolved, setResolved] = useState(() => resolveTheme(preference))

  useEffect(() => {
    const next = resolveTheme(preference)
    setResolved(next)
    applyTheme(next)
  }, [preference])

  useEffect(() => {
    return subscribeToSystemTheme(() => {
      // Solo importa mientras se sigue al sistema; con una preferencia explícita se ignora.
      if (readStoredPreference() !== 'system') return
      const next = resolveTheme('system')
      setResolved(next)
      applyTheme(next)
    })
  }, [])

  const setPreference = useCallback((next: ThemePreference) => {
    storePreference(next)
    setPreferenceState(next)
  }, [])

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
