# OpenBody API

Backend del MVP de OpenBody: API REST que sirve la metadata de los órganos (nombre, descripción y `mesh_id`) consumida por el visor 3D.

## Stack

- **FastAPI** (async) + **Pydantic v2**
- **SQLAlchemy 2.0** (async) + **Alembic** (migraciones)
- **SQLite** en desarrollo (vía `aiosqlite`) — migrar a PostgreSQL es solo cambiar `DATABASE_URL`
- **uv** como gestor de paquetes y entorno virtual

## Requisitos

- Python 3.13+
- [uv](https://docs.astral.sh/uv/)

## Arranque rápido

```bash
cd Server
cp .env.example .env

uv sync
uv run alembic upgrade head
uv run python scripts/seed.py

uv run fastapi dev app/main.py
```

> En consolas de Windows con codepage cp1252, `fastapi dev`/`fastapi run` puede fallar al imprimir su banner con emoji. Si ocurre, usa `uv run uvicorn app.main:app --reload` en su lugar (mismo resultado, sin el CLI decorativo).

Documentación interactiva en `http://127.0.0.1:8000/docs`.

## Comandos habituales

```bash
# Tests
uv run pytest -v

# Lint
uv run ruff check .

# Nueva migración tras cambiar modelos
uv run alembic revision --autogenerate -m "descripción del cambio"
uv run alembic upgrade head
```

## Estructura

```
app/
├── main.py          # instancia de FastAPI, CORS, lifespan
├── core/            # configuración y conexión a BD
├── models/          # modelos SQLAlchemy (System, Organ)
├── schemas/         # contratos Pydantic de la API
├── crud/            # queries a la base de datos
└── api/v1/          # rutas (health, systems, organs)
scripts/seed.py       # carga los órganos del MVP (idempotente)
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Healthcheck |
| GET | `/api/v1/systems` | Lista de sistemas |
| GET | `/api/v1/systems/{slug}` | Sistema + sus órganos publicados |
| GET | `/api/v1/organs?q=&system=` | Lista de órganos (búsqueda y filtro opcionales) |
| GET | `/api/v1/organs/{slug}` | Ficha de un órgano |
| GET | `/api/v1/organs/by-mesh/{mesh_id}` | Resuelve la ficha a partir del nombre de malla del glTF — el endpoint que usa el visor 3D al detectar un clic |

Solo se devuelven órganos con `is_published = true` (requiere validación médica previa, ver documento de MVP).

## Docker

Para desplegar el **stack completo** (frontend + backend tras un reverse proxy), ver [`../DEPLOY.md`](../DEPLOY.md). Lo que sigue es levantar solo el backend, que es lo habitual mientras se desarrolla el cliente con `npm run dev`.

El proyecto incluye `Dockerfile` (multi-stage con `uv`, imagen final sin `uv` ni herramientas de build) y un `docker-compose.yml` en la raíz del monorepo. El contenedor aplica las migraciones automáticamente al arrancar (`docker-entrypoint.sh`) y persiste la base SQLite en un volumen nombrado.

```bash
# desde la raíz del repo
docker compose up -d server
docker compose exec server python scripts/seed.py

curl http://localhost:8000/health
```

En este equipo, Docker corre dentro de WSL y se invoca con `wsl docker ...` / `wsl docker compose ...`. **Ojo**: si no hay ninguna sesión de WSL activa, la instancia se apaga sola pocos segundos después de que termina el último comando — y se lleva consigo `dockerd` y cualquier contenedor corriendo. Para pruebas largas, mantén una terminal de WSL abierta (`wsl`) mientras el contenedor esté en uso, o configura `vmIdleTimeout` en `%UserProfile%\.wslconfig` si quieres que la instancia no se apague automáticamente.

```bash
docker compose down        # detiene y elimina el contenedor (conserva el volumen)
docker compose down -v     # además borra los datos sembrados
docker compose logs -f server
```

## Migrar a PostgreSQL

```bash
uv add asyncpg
```

Cambiar en `.env`:

```
DATABASE_URL=postgresql+asyncpg://usuario:password@localhost/openbody
```

Y volver a aplicar las migraciones: `uv run alembic upgrade head`. No hace falta tocar código de la aplicación.
