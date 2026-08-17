from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_db
from app.main import app
from app.models.base import Base
from app.models.organ import Organ
from app.models.system import System


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession]:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async def override_get_db() -> AsyncGenerator[AsyncSession]:
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    async with session_factory() as session:
        yield session

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def seeded_organs(db_session: AsyncSession) -> dict[str, Organ]:
    cardiovascular = System(slug="cardiovascular", name="Sistema cardiovascular")
    respiratory = System(slug="respiratory", name="Sistema respiratorio")
    db_session.add_all([cardiovascular, respiratory])
    await db_session.flush()

    heart = Organ(
        slug="heart",
        mesh_id="heart",
        name="Corazón",
        description="Bombea sangre.",
        system_id=cardiovascular.id,
        is_published=True,
    )
    lung_left = Organ(
        slug="lung-left",
        mesh_id="lung_left",
        name="Pulmón izquierdo",
        description="Respira.",
        system_id=respiratory.id,
        is_published=True,
    )
    draft_organ = Organ(
        slug="draft-organ",
        mesh_id="draft_mesh",
        name="Órgano sin publicar",
        description="No debe verse todavía.",
        system_id=respiratory.id,
        is_published=False,
    )
    db_session.add_all([heart, lung_left, draft_organ])
    await db_session.commit()

    return {"heart": heart, "lung_left": lung_left, "draft_organ": draft_organ}
