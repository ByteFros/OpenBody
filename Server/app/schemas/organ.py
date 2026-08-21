from pydantic import BaseModel, ConfigDict, Field

from app.schemas.system import SystemRead


class OrganSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    mesh_id: str
    name: str


class OrganRead(OrganSummary):
    description: str
    system: SystemRead


class SystemWithOrgans(SystemRead):
    organs: list[OrganSummary] = Field(default_factory=list)
