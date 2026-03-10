from __future__ import annotations

from rest_framework import viewsets

from medical.filters import PatientFilter
from medical.models import Patient
from medical.serializers import PatientSerializer


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet **lecture seule** pour :class:`~medical.models.Patient`.

    :query nom: Filtre ``icontains`` sur le nom de famille.
    :query prenom: Filtre ``icontains`` sur le prénom.
    :query date_naissance: Filtre exact sur la date de naissance.
    :query search: Recherche libre sur ``last_name``, ``first_name``.
    """

    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    filterset_class = PatientFilter
    search_fields = ["last_name", "first_name"]
    ordering_fields = ["last_name", "first_name", "birth_date"]
