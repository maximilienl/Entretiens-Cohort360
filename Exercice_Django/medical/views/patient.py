from __future__ import annotations

from rest_framework import viewsets

from medical.filters import PatientFilter
from medical.models import Patient
from medical.serializers import PatientSerializer


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """Lecture seule des patients avec filtrage via query params."""

    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    filterset_class = PatientFilter
    search_fields = ["last_name", "first_name"]
    ordering_fields = ["last_name", "first_name", "birth_date"]
