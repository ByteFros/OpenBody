from httpx import AsyncClient

from app.models.organ import Organ


async def test_list_systems(client: AsyncClient, seeded_organs: dict[str, Organ]) -> None:
    response = await client.get("/api/v1/systems")

    assert response.status_code == 200
    slugs = {system["slug"] for system in response.json()}
    assert slugs == {"cardiovascular", "respiratory"}


async def test_get_system_includes_only_published_organs(
    client: AsyncClient, seeded_organs: dict[str, Organ]
) -> None:
    response = await client.get("/api/v1/systems/respiratory")

    assert response.status_code == 200
    data = response.json()
    organ_slugs = {organ["slug"] for organ in data["organs"]}
    assert organ_slugs == {"lung-left"}
    assert "draft-organ" not in organ_slugs


async def test_get_system_not_found(client: AsyncClient) -> None:
    response = await client.get("/api/v1/systems/does-not-exist")

    assert response.status_code == 404
