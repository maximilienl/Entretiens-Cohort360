from __future__ import annotations

from rest_framework import serializers

from medical.models import Medication


class MedicationSerializer(serializers.ModelSerializer):
    """Serializer lecture pour :class:`~medical.models.Medication`."""

    class Meta:
        model = Medication
        fields = ["id", "code", "label", "status"]
