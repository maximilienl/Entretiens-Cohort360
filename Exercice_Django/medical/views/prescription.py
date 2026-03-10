from __future__ import annotations

from rest_framework import viewsets

from medical.filters import PrescriptionFilter
from medical.models import Prescription
from medical.serializers import PrescriptionSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    """CRUD (sans DELETE) pour :class:`~medical.models.Prescription`.

    Le DELETE est volontairement désactivé ; le soft-delete se fait via
    le statut ``suppr``.

    :query patient: Filtre par ID patient.
    :query medication: Filtre par ID médicament.
    :query status: Filtre exact sur le statut.
    :query start_date_gte: Date de début >= valeur.
    :query start_date_lte: Date de début <= valeur.
    :query end_date_gte: Date de fin >= valeur.
    :query end_date_lte: Date de fin <= valeur.
    """

    serializer_class = PrescriptionSerializer
    queryset = Prescription.objects.select_related("patient", "medication").all()
    filterset_class = PrescriptionFilter
    search_fields = ["comment", "patient__last_name", "medication__label"]
    ordering_fields = ["start_date", "end_date", "status"]
    http_method_names = ["get", "post", "put", "patch", "head", "options"]
