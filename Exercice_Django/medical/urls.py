from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import MedicationViewSet, PatientViewSet, PrescriptionViewSet

router = SimpleRouter(trailing_slash=False)
router.register(r"Patient", PatientViewSet, basename="patient")
router.register(r"Medication", MedicationViewSet, basename="medication")
router.register(r"Prescription", PrescriptionViewSet, basename="prescription")

urlpatterns = [
    path("", include(router.urls)),
]
