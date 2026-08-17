# OpenBody Client

Frontend del MVP de OpenBody. Por ahora contiene **solo la arquitectura**: routing, capa de conexión con la API y páginas placeholder que ya leen datos reales. El diseño visual y el visor 3D llegan en la siguiente iteración.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (configuración CSS-first, sin `tailwind.config.js`) + **shadcn/ui** sobre Radix
- **React Router v7** en modo librería
- **TanStack Query** vía `openapi-react-query`, con tipos generados desde el OpenAPI del backend
- **Vitest** + Testing Library · **oxlint**

## Arranque

Necesita el backend corriendo (ver [`../Server/README.md`](../Server/README.md)).

```bash
cd Client
cp .env.example .env
npm install
npm run dev
```

La app queda en `http://localhost:5173`.

## Scripts

```bash
npm run dev         # servidor de desarrollo
npm run build       # typecheck + build de producción
npm run typecheck   # solo tipos
npm run test        # tests (vitest)
npm run lint        # oxlint
npm run api:types   # regenera src/api/schema.d.ts desde el backend
```

## Estructura

```
src/
├── main.tsx          # providers (QueryClient + Router)
├── routes.tsx        # árbol de rutas
├── api/              # ← capa de conexión con el servidor
│   ├── schema.d.ts   # GENERADO — no editar a mano
│   ├── client.ts     # cliente tipado ($api)
│   ├── queries.ts    # hooks de dominio
│   └── types.ts      # alias legibles de los tipos generados
├── components/
│   ├── ui/           # shadcn (lo genera su CLI)
│   └── common/       # componentes propios reutilizables
├── layouts/          # shell de la app
├── pages/            # una por ruta
└── lib/              # utilidades y config del QueryClient
```

## Tipos de la API

`src/api/schema.d.ts` se genera desde el OpenAPI del backend y **se commitea**, para que el typecheck de CI no necesite un servidor levantado.

Cada vez que cambie un schema del backend, con el servidor corriendo:

```bash
npm run api:types
```

Si algo dejó de encajar, TypeScript lo señala en el `npm run typecheck`.

## Notas de implementación

**Los hooks viven en `src/api/queries.ts`.** Las páginas no escriben rutas de la API a mano, así que un cambio de endpoint se toca en un único sitio. Ahí está también `useOrganByMesh`, que resuelve la ficha a partir del nombre de malla del glTF — es el contrato que usará el visor 3D al detectar un clic.

**Sin reintentos en las queries.** Con `retry > 0`, TanStack Query se queda colgado en `fetchStatus: 'paused'` entre intentos y nunca alcanza `status: 'error'`, así que la pantalla se queda en blanco en vez de mostrar el fallo (reproducido con y sin StrictMode, y con `networkMode: 'always'`). Como además la API es de solo lectura y un 404 no va a acertar al segundo intento, `retry: 0` es también lo razonable. Está en [`src/lib/queryClient.ts`](src/lib/queryClient.ts).

**`QueryState` usa `isPending`, no `isLoading`.** `isLoading` es `isPending && isFetching`, así que vale false mientras una petición está en espera y deja la pantalla vacía.
