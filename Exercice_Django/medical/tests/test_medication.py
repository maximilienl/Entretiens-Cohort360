from __future__ import annotations

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from medical.models import Medication

from .helpers import get_results


class MedicationApiTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        Medication.objects.create(code="PARA500", label="Paracétamol 500mg", status=Medication.STATUS_ACTIF)
        Medication.objects.create(code="IBU200", label="Ibuprofène 200mg", status=Medication.STATUS_SUPPR)

    def test_medication_list(self) -> None:
        r = self.client.get(reverse("medication-list"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(get_results(r)), 2)

    def test_medication_filter_status(self) -> None:
        r = self.client.get(reverse("medication-list"), {"status": "actif"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertTrue(all(m["status"] == "actif" for m in get_results(r)))
