import { use } from 'react'

import { ThemeContext } from '@/lib/theme'

export function useTheme() {
  const context = use(ThemeContext)
  if (context === null) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}
