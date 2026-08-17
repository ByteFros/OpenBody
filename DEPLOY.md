# Despliegue con Docker

El stack se despliega tras un **reverse proxy**: nginx sirve el frontend estático y redirige `/api` y `/health` al backend por la red interna de Docker. El navegador ve todo en el mismo origen, así que no hay peticiones cross-origin y CORS no interviene.

```
navegador ──▶ nginx (:8080) ──┬──▶ / , /organs/...  →  ficheros estáticos (build de Vite)
                              ├──▶ /api/...         →  server:8000  (FastAPI)
                              └──▶ /health          →  server:8000
```

El backend **no publica ningún puerto**: solo es accesible desde dentro de la red de Docker.

## Levantar el stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

La app queda en `http://localhost:8080`. Para usar otro puerto:

```bash
WEB_PORT=80 docker compose -f docker-compose.prod.yml up -d --build
```

La primera vez, sembrar los datos del MVP:

```bash
docker compose -f docker-compose.prod.yml exec server python scripts/seed.py
```

## Operación

```bash
docker compose -f docker-compose.prod.yml ps        # estado y healthchecks
docker compose -f docker-compose.prod.yml logs -f   # logs de ambos servicios
docker compose -f docker-compose.prod.yml down      # parar (conserva los datos)
docker compose -f docker-compose.prod.yml down -v   # parar y borrar los datos
```

Las migraciones de Alembic se aplican solas al arrancar el contenedor del backend (ver [`Server/docker-entrypoint.sh`](Server/docker-entrypoint.sh)).

## Desarrollo vs producción

| | Desarrollo | Producción |
|---|---|---|
| Fichero | `docker-compose.yml` | `docker-compose.prod.yml` |
| Frontend | `npm run dev` (Vite, :5173) | nginx dentro del contenedor |
| Backend | publicado en :8000 | solo en la red interna |
| Origen de la API | `http://localhost:8000` (CORS) | mismo origen (sin CORS) |

En desarrollo el frontend sí es cross-origin, y por eso `Server/app/core/config.py` mantiene `localhost:5173` en `cors_origins`. En producción `CORS_ORIGINS` va vacío a propósito.

## La URL de la API se hornea en el build

Vite sustituye `import.meta.env.*` **en tiempo de compilación**, así que la URL de la API queda dentro del bundle. El [`Client/Dockerfile`](Client/Dockerfile) construye con `VITE_API_BASE_URL` vacío, lo que hace que el cliente use rutas relativas (`/api/v1/...`) — exactamente lo que necesita el modelo de mismo origen, y lo que permite que la misma imagen valga para cualquier entorno.

Si algún día el frontend se sirve desde un dominio distinto al de la API:

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.ejemplo.com ./Client
```

…y entonces habrá que volver a poner el origen del frontend en `CORS_ORIGINS` del backend.

## Pendiente para producción real

- **PostgreSQL.** Hoy se usa SQLite sobre un volumen. Funciona para una demo, pero no permite réplicas ni backups en caliente. Migrar es `uv add asyncpg`, cambiar `DATABASE_URL` a `postgresql+asyncpg://…` y añadir el servicio al compose; el código de la aplicación no cambia.
- **HTTPS.** nginx sirve HTTP plano. Detrás de un balanceador que termine TLS ya vale; si no, hay que añadir certificados.
- **Assets 3D.** Cuando lleguen los modelos glTF irán a un bucket/CDN, no dentro de la imagen.

## Nota sobre Docker en este equipo

Docker corre dentro de WSL y se invoca como `wsl docker compose …`. Si no hay ninguna sesión de WSL abierta, la instancia se apaga sola pocos segundos después del último comando y se lleva por delante los contenedores. Para trabajar con el stack levantado, mantén una terminal con `wsl` abierta, o fija `vmIdleTimeout` en `%UserProfile%\.wslconfig`.
