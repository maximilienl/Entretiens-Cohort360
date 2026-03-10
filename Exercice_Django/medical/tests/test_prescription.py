from __future__ import annotations

from datetime import date

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from medical.models import Medication, Patient, Prescription

from .helpers import get_results


class PrescriptionApiTests(TestCase):
    """Tests CRUD + filtrage pour l'endpoint /Prescription."""

    def setUp(self) -> None:
        self.client = APIClient()

        self.patient_a = Patient.objects.create(
            last_name="Martin", first_name="Jeanne", birth_date="1992-03-10",
        )
        self.patient_b = Patient.objects.create(
            last_name="Durand", first_name="Jean", birth_date="1980-05-20",
        )
        self.med_a = Medication.objects.create(
            code="PARA500", label="Paracétamol 500mg", status=Medication.STATUS_ACTIF,
        )
        self.med_b = Medication.objects.create(
            code="IBU200", label="Ibuprofène 200mg", status=Medication.STATUS_ACTIF,
        )

        self.prescription = Prescription.objects.create(
            patient=self.patient_a,
            medication=self.med_a,
            start_date=date(2025, 1, 1),
            end_date=date(2025, 3, 31),
            status=Prescription.STATUS_VALIDE,
            comment="Traitement initial",
        )

    # ── LIST ────────────────────────────────────────────────────────────

    def test_list_prescriptions(self) -> None:
        r = self.client.get(reverse("prescription-list"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        results = get_results(r)
        self.assertEqual(len(results), 1)

    def test_list_contains_nested_details(self) -> None:
        r = self.client.get(reverse("prescription-list"))
        item = get_results(r)[0]
        self.assertIn("patient", item)
        self.assertIn("medication", item)
        self.assertEqual(item["patient"]["last_name"], "Martin")
        self.assertEqual(item["medication"]["code"], "PARA500")

    # ── CREATE ──────────────────────────────────────────────────────────

    def test_create_prescription_valid(self) -> None:
        payload = {
            "patient_id": self.patient_b.pk,
            "medication_id": self.med_b.pk,
            "start_date": "2025-06-01",
            "end_date": "2025-06-30",
            "status": "en_attente",
            "comment": "Nouveau traitement",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Prescription.objects.count(), 2)

    def test_create_prescription_same_dates(self) -> None:
        """start_date == end_date est valide (prescription d'un jour)."""
        payload = {
            "patient_id": self.patient_a.pk,
            "medication_id": self.med_a.pk,
            "start_date": "2025-07-01",
            "end_date": "2025-07-01",
            "status": "valide",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)

    def test_create_prescription_end_before_start_rejected(self) -> None:
        payload = {
            "patient_id": self.patient_a.pk,
            "medication_id": self.med_a.pk,
            "start_date": "2025-06-30",
            "end_date": "2025-06-01",
            "status": "valide",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("end_date", r.json())

    def test_create_prescription_invalid_patient_rejected(self) -> None:
        payload = {
            "patient_id": 99999,
            "medication_id": self.med_a.pk,
            "start_date": "2025-06-01",
            "end_date": "2025-06-30",
            "status": "valide",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("patient_id", r.json())

    def test_create_prescription_invalid_medication_rejected(self) -> None:
        payload = {
            "patient_id": self.patient_a.pk,
            "medication_id": 99999,
            "start_date": "2025-06-01",
            "end_date": "2025-06-30",
            "status": "valide",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("medication_id", r.json())

    def test_create_prescription_invalid_status_rejected(self) -> None:
        payload = {
            "patient_id": self.patient_a.pk,
            "medication_id": self.med_a.pk,
            "start_date": "2025-06-01",
            "end_date": "2025-06-30",
            "status": "inexistant",
        }
        r = self.client.post(reverse("prescription-list"), payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", r.json())

    def test_create_prescription_missing_required_fields(self) -> None:
        r = self.client.post(reverse("prescription-list"), {}, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        errors = r.json()
        for field in ("patient_id", "medication_id", "start_date", "end_date"):
            self.assertIn(field, errors)
        self.assertNotIn("comment", errors, "comment should be optional")

    # ── UPDATE (PUT) ────────────────────────────────────────────────────

    def test_update_prescription_put(self) -> None:
        url = reverse("prescription-detail", args=[self.prescription.pk])
        payload = {
            "patient_id": self.patient_a.pk,
            "medication_id": self.med_b.pk,
            "start_date": "2025-02-01",
            "end_date": "2025-04-30",
            "status": "valide",
            "comment": "Changement de médicament",
        }
        r = self.client.put(url, payload, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.prescription.refresh_from_db()
        self.assertEqual(self.prescription.medication, self.med_b)

    # ── UPDATE (PATCH) ──────────────────────────────────────────────────

    def test_update_prescription_patch_status(self) -> None:
        url = reverse("prescription-detail", args=[self.prescription.pk])
        r = self.client.patch(url, {"status": "suppr"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.prescription.refresh_from_db()
        self.assertEqual(self.prescription.status, Prescription.STATUS_SUPPR)

    def test_update_prescription_patch_invalid_dates_rejected(self) -> None:
        url = reverse("prescription-detail", args=[self.prescription.pk])
        r = self.client.patch(url, {"end_date": "2024-12-01"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    # ── DELETE interdit ─────────────────────────────────────────────────

    def test_delete_not_allowed(self) -> None:
        url = reverse("prescription-detail", args=[self.prescription.pk])
        r = self.client.delete(url)
        self.assertEqual(r.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # ── FILTRES ─────────────────────────────────────────────────────────

    def test_filter_by_patient(self) -> None:
        Prescription.objects.create(
            patient=self.patient_b, medication=self.med_a,
            start_date=date(2025, 2, 1), end_date=date(2025, 2, 28),
            status=Prescription.STATUS_VALIDE,
        )
        r = self.client.get(reverse("prescription-list"), {"patient": self.patient_a.pk})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(r)), 1)

    def test_filter_by_medication(self) -> None:
        Prescription.objects.create(
            patient=self.patient_a, medication=self.med_b,
            start_date=date(2025, 4, 1), end_date=date(2025, 4, 30),
            status=Prescription.STATUS_EN_ATTENTE,
        )
        r = self.client.get(reverse("prescription-list"), {"medication": self.med_a.pk})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(r)), 1)

    def test_filter_by_status(self) -> None:
        Prescription.objects.create(
            patient=self.patient_a, medication=self.med_a,
            start_date=date(2025, 5, 1), end_date=date(2025, 5, 31),
            status=Prescription.STATUS_EN_ATTENTE,
        )
        r = self.client.get(reverse("prescription-list"), {"status": "en_attente"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertTrue(all(p["status"] == "en_attente" for p in get_results(r)))

    def test_filter_by_start_date_range(self) -> None:
        r = self.client.get(
            reverse("prescription-list"),
            {"start_date_gte": "2025-01-01", "start_date_lte": "2025-01-31"},
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(r)), 1)

    def test_filter_by_end_date_range(self) -> None:
        r = self.client.get(reverse("prescription-list"), {"end_date_lte": "2025-02-28"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(r)), 0)

    def test_filter_combined(self) -> None:
        """Combinaison de plusieurs filtres simultanément."""
        Prescription.objects.create(
            patient=self.patient_a, medication=self.med_b,
            start_date=date(2025, 1, 15), end_date=date(2025, 2, 15),
            status=Prescription.STATUS_EN_ATTENTE,
        )
        r = self.client.get(
            reverse("prescription-list"),
            {"patient": self.patient_a.pk, "status": "valide", "start_date_gte": "2025-01-01"},
        )
        results = get_results(r)
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["status"], "valide")
