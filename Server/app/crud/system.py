from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.organ import Organ
from app.models.system import System


async def list_systems(db: AsyncSession) -> list[System]:
    result = await db.execute(select(System).order_by(System.name))
    return list(result.scalars().all())


async def get_system_by_slug(db: AsyncSession, slug: str) -> System | None:
    result = await db.execute(
        select(System)
        .where(System.slug == slug)
        .options(selectinload(System.organs.and_(Organ.is_published.is_(True))))
    )
    return result.scalar_one_or_none()
