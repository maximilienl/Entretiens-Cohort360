from __future__ import annotations

import django_filters

from medical.models import Prescription


class PrescriptionFilter(django_filters.FilterSet):
    """Filtres avancés pour :class:`~medical.models.Prescription`.

    Tous les filtres sont combinables. Les filtres de dates acceptent
    les suffixes ``_gte`` et ``_lte`` pour les intervalles.
    """

    patient = django_filters.NumberFilter(field_name="patient_id")
    medication = django_filters.NumberFilter(field_name="medication_id")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    start_date = django_filters.DateFilter(field_name="start_date", lookup_expr="exact")
    start_date_gte = django_filters.DateFilter(field_name="start_date", lookup_expr="gte")
    start_date_lte = django_filters.DateFilter(field_name="start_date", lookup_expr="lte")

    end_date = django_filters.DateFilter(field_name="end_date", lookup_expr="exact")
    end_date_gte = django_filters.DateFilter(field_name="end_date", lookup_expr="gte")
    end_date_lte = django_filters.DateFilter(field_name="end_date", lookup_expr="lte")

    class Meta:
        model = Prescription
        fields = []
