from fastapi import APIRouter

from app.api.v1 import organs, systems

api_router = APIRouter()
api_router.include_router(systems.router)
api_router.include_router(organs.router)
