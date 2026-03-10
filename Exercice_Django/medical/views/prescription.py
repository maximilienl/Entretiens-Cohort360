from __future__ import annotations

from rest_framework import viewsets

from medical.filters import PrescriptionFilter
from medical.models import Prescription
from medical.serializers import PrescriptionSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    """CRUD des prescriptions avec filtrage avancé."""

    serializer_class = PrescriptionSerializer
    queryset = Prescription.objects.select_related("patient", "medication").all()
    filterset_class = PrescriptionFilter
    search_fields = ["comment", "patient__last_name", "medication__label"]
    ordering_fields = ["start_date", "end_date", "status"]
    http_method_names = ["get", "post", "put", "patch", "head", "options"]
