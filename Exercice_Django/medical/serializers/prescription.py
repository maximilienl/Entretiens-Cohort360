from __future__ import annotations

from typing import Any

from rest_framework import serializers

from medical.models import Medication, Patient, Prescription

from .medication import MedicationSerializer
from .patient import PatientSerializer


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer pour les prescriptions — lecture enrichie, écriture par ID."""

    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source="patient", write_only=True,
    )
    medication_id = serializers.PrimaryKeyRelatedField(
        queryset=Medication.objects.all(), source="medication", write_only=True,
    )
    patient = PatientSerializer(read_only=True)
    medication = MedicationSerializer(read_only=True)

    class Meta:
        model = Prescription
        fields = [
            "id",
            "patient_id",
            "patient",
            "medication_id",
            "medication",
            "start_date",
            "end_date",
            "status",
            "comment",
        ]

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end_date = attrs.get("end_date", getattr(self.instance, "end_date", None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                {"end_date": "La date de fin doit être postérieure ou égale à la date de début."}
            )
        return attrs
