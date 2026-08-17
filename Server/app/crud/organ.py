from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.organ import Organ
from app.models.system import System


def _published_organs_stmt():
    return select(Organ).where(Organ.is_published.is_(True)).options(selectinload(Organ.system))


async def list_organs(
    db: AsyncSession, *, q: str | None = None, system_slug: str | None = None
) -> list[Organ]:
    stmt = _published_organs_stmt().order_by(Organ.name)

    if q:
        stmt = stmt.where(Organ.name.ilike(f"%{q}%"))

    if system_slug:
        stmt = stmt.join(Organ.system).where(System.slug == system_slug)

    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_organ_by_slug(db: AsyncSession, slug: str) -> Organ | None:
    stmt = _published_organs_stmt().where(Organ.slug == slug)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_organ_by_mesh_id(db: AsyncSession, mesh_id: str) -> Organ | None:
    stmt = _published_organs_stmt().where(Organ.mesh_id == mesh_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
