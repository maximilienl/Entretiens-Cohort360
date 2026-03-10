from __future__ import annotations

from django.db import models


class Medication(models.Model):
    """Représente un médicament référencé dans le système.

    :cvar STATUS_ACTIF: Médicament actif.
    :cvar STATUS_SUPPR: Médicament supprimé (soft-delete).
    :ivar code: Code unique du médicament (ex. ``MED1234A``).
    :ivar label: Libellé avec dosage (ex. ``Paracetamol 500mg``).
    :ivar status: Statut courant parmi :attr:`STATUS_CHOICES`.
    """

    STATUS_ACTIF = "actif"
    STATUS_SUPPR = "suppr"
    STATUS_CHOICES = (
        (STATUS_ACTIF, "actif"),
        (STATUS_SUPPR, "suppr"),
    )

    code = models.CharField(max_length=64, unique=True)
    label = models.CharField(max_length=255)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_ACTIF)

    class Meta:
        ordering = ["code"]

    def __str__(self) -> str:  # pragma: no cover - simple repr
        return f"{self.code} - {self.label} ({self.status})"
