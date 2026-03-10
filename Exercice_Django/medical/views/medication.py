from __future__ import annotations

from rest_framework import viewsets

from medical.filters import MedicationFilter
from medical.models import Medication
from medical.serializers import MedicationSerializer


class MedicationViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des médicaments avec filtrage via query params."""

    serializer_class = MedicationSerializer
    queryset = Medication.objects.all()
    filterset_class = MedicationFilter
    search_fields = ["code", "label"]
    ordering_fields = ["code", "label", "status"]
