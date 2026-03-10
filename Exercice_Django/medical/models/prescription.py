from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import models

from .medication import Medication
from .patient import Patient


class Prescription(models.Model):
    """Prescription d'un médicament pour un patient sur une période donnée.

    :cvar STATUS_VALIDE: Prescription validée.
    :cvar STATUS_EN_ATTENTE: Prescription en attente de validation.
    :cvar STATUS_SUPPR: Prescription supprimée (soft-delete).
    :ivar patient: Patient concerné (cascade on delete).
    :ivar medication: Médicament prescrit (protégé contre la suppression).
    :ivar start_date: Date de début de la prescription.
    :ivar end_date: Date de fin, doit être >= ``start_date``.
    :ivar status: Statut courant parmi :attr:`STATUS_CHOICES`.
    :ivar comment: Commentaire libre (optionnel).

    :raises ValidationError: Si ``end_date < start_date``.
    """

    STATUS_VALIDE = "valide"
    STATUS_EN_ATTENTE = "en_attente"
    STATUS_SUPPR = "suppr"
    STATUS_CHOICES = (
        (STATUS_VALIDE, "valide"),
        (STATUS_EN_ATTENTE, "en attente"),
        (STATUS_SUPPR, "supprimé"),
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="prescriptions",
    )
    medication = models.ForeignKey(
        Medication,
        on_delete=models.PROTECT,
        related_name="prescriptions",
    )
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)
    status = models.CharField(
        max_length=16,
        choices=STATUS_CHOICES,
        default=STATUS_EN_ATTENTE,
        db_index=True,
    )
    comment = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Prescription"
        verbose_name_plural = "Prescriptions"
        ordering = ["-start_date", "id"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_date__gte=models.F("start_date")),
                name="prescription_end_date_gte_start_date",
            ),
        ]

    def clean(self) -> None:
        super().clean()
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValidationError(
                {"end_date": "La date de fin doit être postérieure ou égale à la date de début."}
            )

    def __str__(self) -> str:  # pragma: no cover - simple repr
        return f"Prescription #{self.pk} — {self.patient} → {self.medication} ({self.status})"
