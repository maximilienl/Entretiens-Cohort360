from __future__ import annotations

from rest_framework import viewsets

from medical.filters import MedicationFilter
from medical.models import Medication
from medical.serializers import MedicationSerializer


class MedicationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet **lecture seule** pour :class:`~medical.models.Medication`.

    :query code: Filtre ``icontains`` sur le code médicament.
    :query label: Filtre ``icontains`` sur le libellé.
    :query status: Filtre exact sur le statut (``actif`` | ``suppr``).
    """

    serializer_class = MedicationSerializer
    queryset = Medication.objects.all()
    filterset_class = MedicationFilter
    search_fields = ["code", "label"]
    ordering_fields = ["code", "label", "status"]
