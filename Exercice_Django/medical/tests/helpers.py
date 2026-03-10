from __future__ import annotations


def get_results(response) -> list[dict]:
    """Extrait la liste de résultats d'une réponse paginée."""
    return response.json()["results"]
