from __future__ import annotations

import random
import string
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from medical.models import Medication, Patient, Prescription


def random_date(start_year: int = 1940, end_year: int = 2025) -> date:
    start_dt = date(start_year, 1, 1)
    end_dt = date(end_year, 12, 31)
    days = (end_dt - start_dt).days
    return start_dt + timedelta(days=random.randint(0, days))


class Command(BaseCommand):
    help = "Seed the database with demo Patients, Medications and Prescriptions"

    def add_arguments(self, parser):
        parser.add_argument("--patients", type=int, default=10)
        parser.add_argument("--medications", type=int, default=5)
        parser.add_argument("--prescriptions", type=int, default=30)

    def handle(self, *args, **options):
        Prescription.objects.all().delete()
        Medication.objects.all().delete()
        Patient.objects.all().delete()

        created_patients = self._seed_patients(options["patients"])
        created_meds = self._seed_medications(options["medications"])
        created_prescriptions = self._seed_prescriptions(
            options["prescriptions"], created_patients, created_meds,
        )

        self.stdout.write(self.style.SUCCESS(
            f"Created {len(created_patients)} patients, "
            f"{len(created_meds)} medications and "
            f"{len(created_prescriptions)} prescriptions."
        ))

    def _seed_patients(self, count: int) -> list[Patient]:
        last_names = [
            "Martin", "Bernard", "Thomas", "Petit", "Robert",
            "Richard", "Durand", "Dubois", "Moreau", "Laurent",
            "Michel", "Garcia", "David", "Bertrand", "Roux",
            "Vincent", "Fournier", "Morel", "Lefebvre", "Mercier",
            "Dupont", "Lambert", "Bonnet", "Francois", "Martinez",
            "Legrand", "Garnier", "Faure", "Andre", "Rousseau",
            "Simon", "Leroy", "Girard", "Colin", "Lefevre",
            "Boyer", "Chevalier", "Robin", "Masson", "Picard",
            "Blanc", "Gautier", "Nicolas", "Henry", "Perrin",
            "Morin", "Mathieu", "Clement", "Gauthier", "Dumont",
            "Lopez", "Fontaine", "Schmitt", "Rodriguez", "Dufour",
            "Blanchard", "Meunier", "Brunet", "Roy",
        ]
        first_names = [
            "Jean", "Jeanne", "Marie", "Luc", "Lucie",
            "Paul", "Camille", "Pierre", "Sophie", "Emma",
            "Louis", "Louise", "Alice", "Gabriel", "Jules",
            "Lucas", "Hugo", "Arthur", "Adam", "Raphael",
            "Leo", "Nathan", "Tom", "Zoe", "Chloe",
            "Ines", "Lea", "Lena", "Eva", "Nina",
            "Ethan", "Noah", "Liam", "Rose", "Anna",
            "Jade", "Maeva", "Sarah", "Laura", "Clara",
            "Julie", "Nicolas", "Thomas", "Antoine", "Emilie",
            "Mathilde", "Charlotte", "Manon", "Julia", "Elise",
            "Victor", "Alex", "Samuel", "Valentin", "Axel",
            "Simon", "Romain", "Vincent", "Marc", "David",
        ]
        patients = [
            Patient(
                last_name=random.choice(last_names),
                first_name=random.choice(first_names),
                birth_date=random_date(),
            )
            for _ in range(count)
        ]
        return Patient.objects.bulk_create(patients)

    def _seed_medications(self, count: int) -> list[Medication]:
        base_labels = [
            "Paracetamol", "Ibuprofen", "Amoxicillin", "Aspirin", "Omeprazole",
            "Metformin", "Loratadine", "Cetirizine", "Azithromycin", "Atorvastatin",
            "Simvastatin", "Lisinopril", "Amlodipine", "Metoprolol", "Sertraline",
            "Fluoxetine", "Escitalopram", "Gabapentin", "Pregabalin", "Tramadol",
            "Oxycodone", "Hydrocodone", "Morphine", "Diazepam", "Alprazolam",
            "Clonazepam", "Zolpidem", "Trazodone", "Cyclobenzaprine", "Meloxicam",
            "Prednisone", "Methylprednisolone", "Hydrocortisone", "Fluticasone", "Montelukast",
            "Albuterol", "Fluconazole", "Terbinafine", "Metronidazole", "Ciprofloxacin",
            "Doxycycline", "Cephalexin", "Nitrofurantoin", "Pantoprazole", "Ranitidine",
            "Famotidine", "Dicyclomine", "Ondansetron", "Promethazine", "Meclizine",
        ]
        dosages = [15, 20, 25, 50, 100, 200, 250, 300, 400, 500, 800, 1000]
        units = ["mg", "g", "µg"]

        codes: set[str] = set()
        medications: list[Medication] = []
        for _ in range(count):
            code = f"MED{random.randint(1000, 9999)}{random.choice(string.ascii_uppercase)}"
            while code in codes:
                code = f"MED{random.randint(1000, 9999)}{random.choice(string.ascii_uppercase)}"
            codes.add(code)
            medications.append(
                Medication(
                    code=code,
                    label=f"{random.choice(base_labels)} {random.choice(dosages)}{random.choice(units)}",
                    status=random.choices(
                        [Medication.STATUS_ACTIF, Medication.STATUS_SUPPR], weights=[0.8, 0.2],
                    )[0],
                )
            )
        return Medication.objects.bulk_create(medications)

    def _seed_prescriptions(
        self,
        count: int,
        patients: list[Patient],
        medications: list[Medication],
    ) -> list[Prescription]:
        statuses = [
            Prescription.STATUS_VALIDE,
            Prescription.STATUS_EN_ATTENTE,
            Prescription.STATUS_SUPPR,
        ]
        status_weights = [0.5, 0.35, 0.15]
        comments = [
            "", "", "",
            "Renouvellement trimestriel",
            "Posologie adaptée selon tolérance",
            "À réévaluer dans 3 mois",
            "Prescription initiale",
            "Suite hospitalisation",
            "Surveillance renforcée",
        ]

        prescriptions: list[Prescription] = []
        for _ in range(count):
            start = random_date(start_year=2023, end_year=2025)
            duration = timedelta(days=random.randint(7, 365))
            prescriptions.append(
                Prescription(
                    patient=random.choice(patients),
                    medication=random.choice(medications),
                    start_date=start,
                    end_date=start + duration,
                    status=random.choices(statuses, weights=status_weights)[0],
                    comment=random.choice(comments),
                )
            )
        return Prescription.objects.bulk_create(prescriptions)
