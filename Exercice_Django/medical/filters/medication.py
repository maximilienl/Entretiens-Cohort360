from __future__ import annotations

import django_filters

from medical.models import Medication


class MedicationFilter(django_filters.FilterSet):
    code = django_filters.CharFilter(field_name="code", lookup_expr="icontains")
    label = django_filters.CharFilter(field_name="label", lookup_expr="icontains")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = Medication
        fields = ["code", "label", "status"]
