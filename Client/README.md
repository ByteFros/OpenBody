# OpenBody Client

Frontend del MVP de OpenBody: routing, capa de conexión con la API, y un visor 3D funcional en `/explorer` con el cuerpo humano y los 7 órganos del MVP en malla real. El diseño visual (estilos, layout definitivo) todavía está pendiente — las páginas funcionan pero no están maquetadas.

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

## Despliegue

En producción el cliente se sirve con nginx, que además hace de reverse proxy hacia el backend (mismo origen, sin CORS). Ver [`../DEPLOY.md`](../DEPLOY.md).

Importante: `VITE_API_BASE_URL` se hornea en el bundle **en tiempo de compilación**. La imagen se construye con ese valor vacío para que el cliente use rutas relativas.

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
├── features/
│   └── explorer/     # ← visor 3D (ver sección abajo)
├── layouts/          # shell de la app
├── pages/            # una por ruta
└── lib/              # utilidades y config del QueryClient
```

## Visor 3D (`/explorer`)

React Three Fiber + drei. El cuerpo y los 7 órganos del MVP son mallas reales (no geometría procedural), exportadas de Blender y servidas como `.glb` estáticos desde `public/`:

- `public/models/HumanBase.glb` — cuerpo base (MPFB/MakeHuman, CC0). Ver `HumanBody.tsx`.
- `public/models/organs/{mesh_id}.glb` — uno por cada `mesh_id` de `Server/scripts/seed.py` (`heart`, `liver`, `lung_left`, `lung_right`, `kidney_left`, `kidney_right`, `stomach`). 6 vienen del [Human Reference Atlas](https://apps.humanatlas.io/kg-explorer/?do=ref-organ) (CC BY 4.0); `stomach` de [BodyParts3D](https://lifesciencedb.jp/bp3d/) (CC BY 4.0) porque el Atlas no lo tiene. **Ambas fuentes requieren atribución visible en la app — pendiente de añadir a la UI.**
- `public/draco/` — decoder de Draco vendorizado (todos los `.glb` están comprimidos con Draco).

Piezas del visor, en `src/features/explorer/`:

| Archivo | Rol |
|---|---|
| `Scene.tsx` | `<Canvas>` de R3F, luces, `OrbitControls`. Envuelve el contenido en `<Suspense>` — imprescindible con varios `useGLTF` cargando a la vez, si no el árbol se queda colgado sin lanzar ninguna petición. |
| `PlaceholderBody.tsx` | Compone `HumanBody` + los 7 `RealOrganMesh`, escalados x2 (`BODY_SCALE`) para facilitar el clic. El nombre es historia: ya no queda ningún placeholder ahí dentro. |
| `HumanBody.tsx` | Carga `HumanBase.glb`, semi-transparente, para que los órganos se vean a través de la piel. |
| `RealOrganMesh.tsx` | Carga el `.glb` de un órgano, extrae su geometría (`nodes[meshId].geometry` — `useGLTF` ya expone ese mapa, no hace falta recorrer la escena a mano) y la pasa a `OrganMesh`. |
| `OrganMesh.tsx` | Primitiva clicable/hoverable compartida: un único `<mesh>` con el color de hover/selección, sin cambios desde antes de las mallas reales. |
| `organGeometry.ts` | Wrapper de `useGLTF` con la ruta del decoder Draco y el preload de los 7 órganos. |
| `OrganDetailsPanel.tsx` | Resuelve el órgano seleccionado contra el backend (`useOrganByMesh`) y muestra su ficha. |

**Pendiente conocido:** la posición de los 7 órganos dentro del cuerpo no es correcta todavía (se ven, pero no encajan en su sitio anatómico) — el usuario la está ajustando a mano.

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
