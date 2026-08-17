from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud import system as crud_system
from app.schemas.organ import SystemWithOrgans
from app.schemas.system import SystemRead

router = APIRouter(prefix="/systems", tags=["systems"])


@router.get("", response_model=list[SystemRead])
async def list_systems(db: AsyncSession = Depends(get_db)) -> list[SystemRead]:
    systems = await crud_system.list_systems(db)
    return [SystemRead.model_validate(system) for system in systems]


@router.get("/{slug}", response_model=SystemWithOrgans)
async def get_system(slug: str, db: AsyncSession = Depends(get_db)) -> SystemWithOrgans:
    system = await crud_system.get_system_by_slug(db, slug)
    if system is None:
        raise HTTPException(status_code=404, detail=f"System '{slug}' not found")
    return SystemWithOrgans.model_validate(system)
