from __future__ import annotations

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from medical.models import Patient

from .helpers import get_results


class PatientApiTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        Patient.objects.create(last_name="Martin", first_name="Jeanne", birth_date="1992-03-10")
        Patient.objects.create(last_name="Durand", first_name="Jean", birth_date="1980-05-20")
        Patient.objects.create(last_name="Bernard", first_name="Paul")

    def test_patient_list(self) -> None:
        r = self.client.get(reverse("patient-list"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(get_results(r)), 3)

    def test_patient_filter_nom(self) -> None:
        r = self.client.get(reverse("patient-list"), {"nom": "mart"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertTrue(all("mart" in p["last_name"].lower() for p in get_results(r)))

    def test_patient_filter_date(self) -> None:
        r = self.client.get(reverse("patient-list"), {"date_naissance": "1980-05-20"})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertTrue(all(p["birth_date"] == "1980-05-20" for p in get_results(r)))
