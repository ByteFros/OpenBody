"""Carga los sistemas y órganos del MVP. Idempotente: se puede correr varias veces."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.core.database import async_session_factory
from app.models.organ import Organ
from app.models.system import System

# NOTA: descripciones provisionales, pendientes de validación por personal médico
# antes de publicarse (ver hito 7 del documento de MVP).
SYSTEMS = [
    {
        "slug": "cardiovascular",
        "name": "Sistema cardiovascular",
        "description": "Encargado de bombear y distribuir la sangre por el cuerpo.",
    },
    {
        "slug": "respiratory",
        "name": "Sistema respiratorio",
        "description": "Encargado del intercambio de oxígeno y dióxido de carbono.",
    },
    {
        "slug": "digestive",
        "name": "Sistema digestivo",
        "description": "Encargado de procesar los alimentos y absorber nutrientes.",
    },
    {
        "slug": "urinary",
        "name": "Sistema urinario",
        "description": "Encargado de filtrar la sangre y eliminar desechos.",
    },
]

ORGANS = [
    {
        "slug": "heart",
        "mesh_id": "heart",
        "name": "Corazón",
        "description": "Órgano muscular que bombea sangre a través del sistema circulatorio. [Pendiente de validación médica]",
        "system_slug": "cardiovascular",
    },
    {
        "slug": "lung-left",
        "mesh_id": "lung_left",
        "name": "Pulmón izquierdo",
        "description": "Órgano respiratorio situado en el lado izquierdo de la caja torácica. [Pendiente de validación médica]",
        "system_slug": "respiratory",
    },
    {
        "slug": "lung-right",
        "mesh_id": "lung_right",
        "name": "Pulmón derecho",
        "description": "Órgano respiratorio situado en el lado derecho de la caja torácica. [Pendiente de validación médica]",
        "system_slug": "respiratory",
    },
    {
        "slug": "liver",
        "mesh_id": "liver",
        "name": "Hígado",
        "description": "Glándula encargada de metabolizar nutrientes y desintoxicar la sangre. [Pendiente de validación médica]",
        "system_slug": "digestive",
    },
    {
        "slug": "stomach",
        "mesh_id": "stomach",
        "name": "Estómago",
        "description": "Órgano donde se realiza la digestión inicial de los alimentos. [Pendiente de validación médica]",
        "system_slug": "digestive",
    },
    {
        "slug": "kidney-left",
        "mesh_id": "kidney_left",
        "name": "Riñón izquierdo",
        "description": "Órgano que filtra la sangre y produce orina, situado en el lado izquierdo. [Pendiente de validación médica]",
        "system_slug": "urinary",
    },
    {
        "slug": "kidney-right",
        "mesh_id": "kidney_right",
        "name": "Riñón derecho",
        "description": "Órgano que filtra la sangre y produce orina, situado en el lado derecho. [Pendiente de validación médica]",
        "system_slug": "urinary",
    },
]


async def seed() -> None:
    async with async_session_factory() as session:
        systems_by_slug: dict[str, System] = {}

        for data in SYSTEMS:
            result = await session.execute(select(System).where(System.slug == data["slug"]))
            system = result.scalar_one_or_none()
            if system is None:
                system = System(**data)
                session.add(system)
                await session.flush()
                print(f"  + sistema creado: {system.slug}")
            else:
                system.name = data["name"]
                system.description = data["description"]
                print(f"  = sistema actualizado: {system.slug}")
            systems_by_slug[system.slug] = system

        for data in ORGANS:
            system_slug = data["system_slug"]
            organ_data = {k: v for k, v in data.items() if k != "system_slug"}

            result = await session.execute(select(Organ).where(Organ.slug == organ_data["slug"]))
            organ = result.scalar_one_or_none()
            if organ is None:
                organ = Organ(**organ_data, system_id=systems_by_slug[system_slug].id, is_published=True)
                session.add(organ)
                print(f"  + órgano creado: {organ.slug}")
            else:
                organ.mesh_id = organ_data["mesh_id"]
                organ.name = organ_data["name"]
                organ.description = organ_data["description"]
                organ.system_id = systems_by_slug[system_slug].id
                organ.is_published = True
                print(f"  = órgano actualizado: {organ.slug}")

        await session.commit()


if __name__ == "__main__":
    print("Sembrando datos del MVP...")
    asyncio.run(seed())
    print("Listo.")
