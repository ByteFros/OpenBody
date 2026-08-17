from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud import organ as crud_organ
from app.schemas.organ import OrganRead, OrganSummary

router = APIRouter(prefix="/organs", tags=["organs"])


@router.get("", response_model=list[OrganSummary])
async def list_organs(
    q: str | None = Query(default=None, description="Búsqueda por nombre"),
    system: str | None = Query(default=None, description="Filtrar por slug de sistema"),
    db: AsyncSession = Depends(get_db),
) -> list[OrganSummary]:
    organs = await crud_organ.list_organs(db, q=q, system_slug=system)
    return [OrganSummary.model_validate(organ) for organ in organs]


@router.get("/by-mesh/{mesh_id}", response_model=OrganRead)
async def get_organ_by_mesh(mesh_id: str, db: AsyncSession = Depends(get_db)) -> OrganRead:
    organ = await crud_organ.get_organ_by_mesh_id(db, mesh_id)
    if organ is None:
        raise HTTPException(status_code=404, detail=f"Organ with mesh_id '{mesh_id}' not found")
    return OrganRead.model_validate(organ)


@router.get("/{slug}", response_model=OrganRead)
async def get_organ(slug: str, db: AsyncSession = Depends(get_db)) -> OrganRead:
    organ = await crud_organ.get_organ_by_slug(db, slug)
    if organ is None:
        raise HTTPException(status_code=404, detail=f"Organ '{slug}' not found")
    return OrganRead.model_validate(organ)
