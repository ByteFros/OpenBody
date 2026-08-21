import '@testing-library/jest-dom/vitest'

// jsdom no implementa matchMedia y el ThemeProvider lo necesita para resolver
// la preferencia del sistema. Se declara claro por defecto: los tests no dependen
// del tema, solo necesitan que la consulta no reviente.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
