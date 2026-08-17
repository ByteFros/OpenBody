from httpx import AsyncClient

from app.models.organ import Organ


async def test_list_organs_returns_only_published(
    client: AsyncClient, seeded_organs: dict[str, Organ]
) -> None:
    response = await client.get("/api/v1/organs")

    assert response.status_code == 200
    slugs = {organ["slug"] for organ in response.json()}
    assert slugs == {"heart", "lung-left"}
    assert "draft-organ" not in slugs


async def test_list_organs_search_by_name(
    client: AsyncClient, seeded_organs: dict[str, Organ]
) -> None:
    response = await client.get("/api/v1/organs", params={"q": "pulm"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "lung-left"


async def test_list_organs_filter_by_system(
    client: AsyncClient, seeded_organs: dict[str, Organ]
) -> None:
    response = await client.get("/api/v1/organs", params={"system": "cardiovascular"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "heart"


async def test_get_organ_by_slug(client: AsyncClient, seeded_organs: dict[str, Organ]) -> None:
    response = await client.get("/api/v1/organs/heart")

    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "heart"
    assert data["mesh_id"] == "heart"
    assert data["system"]["slug"] == "cardiovascular"


async def test_get_organ_by_slug_not_found(client: AsyncClient) -> None:
    response = await client.get("/api/v1/organs/does-not-exist")

    assert response.status_code == 404


async def test_get_organ_by_mesh_id(client: AsyncClient, seeded_organs: dict[str, Organ]) -> None:
    response = await client.get("/api/v1/organs/by-mesh/heart")

    assert response.status_code == 200
    assert response.json()["slug"] == "heart"


async def test_get_organ_by_mesh_id_not_found(client: AsyncClient) -> None:
    response = await client.get("/api/v1/organs/by-mesh/does-not-exist")

    assert response.status_code == 404


async def test_unpublished_organ_is_not_reachable(
    client: AsyncClient, seeded_organs: dict[str, Organ]
) -> None:
    by_slug = await client.get("/api/v1/organs/draft-organ")
    by_mesh = await client.get("/api/v1/organs/by-mesh/draft_mesh")

    assert by_slug.status_code == 404
    assert by_mesh.status_code == 404
