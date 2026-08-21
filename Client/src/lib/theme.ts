import { createContext } from 'react'

/** Lo que el usuario elige. `system` sigue la preferencia del sistema operativo. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** El tema que acaba aplicándose, una vez resuelto `system`. */
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'openbody-theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

/** Lee la preferencia guardada. Cae a `system` si no hay nada o si el valor es basura. */
export function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    // localStorage puede lanzar en modo privado o con cookies bloqueadas.
    return 'system'
  }
}

export function storePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Si no se puede persistir, el tema sigue funcionando durante la sesión.
  }
}

export function prefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference
  return prefersDark() ? 'dark' : 'light'
}

/** El único sitio que toca el DOM: la clase que activa el bloque `.dark` de index.css. */
export function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

/**
 * Notifica cambios de la preferencia del sistema. Devuelve la función de limpieza.
 * Se usa siempre, no solo con `preference === 'system'`: el listener es barato y así
 * el provider no tiene que resuscribirse cada vez que cambia la preferencia.
 */
export function subscribeToSystemTheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
