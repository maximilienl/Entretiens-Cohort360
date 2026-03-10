# Gestion des Prescriptions

## Couverture fonctionnelle

### Consultation des prescriptions

L'API expose la liste des prescriptions avec les détails patient et médicament nestés dans la réponse. La pagination est configurable via `?offset=X&elements=Y`. Les résultats peuvent être filtrés par patient, médicament, statut et plages de dates (combinables), et triés par date ou statut.

### Création et mise à jour

Une prescription est créée via POST en fournissant les IDs patient et médicament, les dates et le statut. La mise à jour supporte PUT (complète) et PATCH (partielle). La validation s'applique à trois niveaux : serializer, méthode `clean()` du modèle, et check constraint en base.

### Pas de DELETE

Le DELETE est volontairement désactivé. La suppression logique se fait en passant le statut à `suppr`, conformément aux pratiques du domaine médical où la traçabilité impose de ne jamais détruire physiquement une donnée.

### Données de référence

Patients et médicaments sont exposés en lecture seule. Ce sont des référentiels existants que l'exercice ne demandait pas de modifier.

---

## Stack technique

| Outil | Usage |
|---|---|
| Django 4.2+ | Framework web |
| Django REST Framework | API REST |
| django-filter | Filtrage déclaratif par query params |
| django-cors-headers | CORS pour le front Vite |
| SQLite | Base de données (suffisant pour l'exercice) |

## Architecture du projet

```
medical/
├── models/
│   ├── patient.py          Données patient (lecture seule)
│   ├── medication.py       Référentiel médicaments (lecture seule)
│   └── prescription.py     Modèle principal avec contraintes
├── serializers/
│   ├── patient.py          Serializer flat
│   ├── medication.py       Serializer flat
│   └── prescription.py     Serializer hybride lecture/écriture
├── views/
│   ├── patient.py          ReadOnlyModelViewSet
│   ├── medication.py       ReadOnlyModelViewSet
│   └── prescription.py     ModelViewSet (sans DELETE)
├── filters/
│   ├── patient.py          Filtres nom, prénom, date, IDs multiples
│   ├── medication.py       Filtres code, label, statut
│   └── prescription.py     Filtres avancés avec intervalles de dates
├── pagination.py           Pagination LimitOffset à tailles contrôlées
├── management/commands/
│   └── seed_demo.py        Génération de données réalistes
├── tests/
│   ├── test_patient.py     3 tests
│   ├── test_medication.py  2 tests
│   └── test_prescription.py 21 tests (CRUD, validation, filtres)
└── urls.py                 Routage /Patient, /Medication, /Prescription
```

## Installation et démarrage

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo --patients 2500 --medications 150
python manage.py runserver
```

---

## Choix d'architecture et justifications

### Serializer hybride

Le `PrescriptionSerializer` accepte des clés primaires en écriture (`patient_id`, `medication_id`) et renvoie les objets complets en lecture (`patient`, `medication` nestés). Le front reçoit toutes les données nécessaires en un seul appel, sans avoir à résoudre les relations côté client.

### Validation à trois niveaux

La contrainte `end_date >= start_date` est vérifiée dans le serializer (retour 400 avec message explicite), dans `clean()` (protection au niveau ORM), et via une `CheckConstraint` en base (intégrité garantie même en cas d'écriture directe). Cette redondance est volontaire : chaque couche protège indépendamment.

### Soft-delete via statut

Aucune donnée n'est physiquement supprimée. Le statut `suppr` remplace le DELETE, ce qui préserve l'historique et la traçabilité. Le `http_method_names` exclut explicitement `delete` pour que l'API renvoie un 405 Method Not Allowed.

### `select_related` sur le queryset

Le queryset du `PrescriptionViewSet` utilise `select_related("patient", "medication")` pour éviter les requêtes N+1 lors de la sérialisation nestée. Un listing de 200 prescriptions génère une seule requête SQL avec des JOINs.

### Index ciblés

Les champs `start_date`, `end_date` et `status` sont indexés en base car ils sont les critères de filtrage les plus fréquents. Le `code` de Medication est unique (donc indexé nativement).

### Pagination à tailles contrôlées

La pagination accepte un paramètre `elements` mais ne tolère que les valeurs 20, 50, 100 ou 200. Toute autre valeur retombe sur la taille par défaut (20). Cela évite qu'un client demande `elements=999999` et charge toute la base.

### Filtres combinables avec intervalles

Les filtres de dates supportent les suffixes `_gte` et `_lte` pour permettre des recherches par intervalle. Tous les filtres sont combinables entre eux via `django-filter`.

### Patients et médicaments en lecture seule

Les `ReadOnlyModelViewSet` pour Patient et Medication exposent uniquement GET. Ces données de référence n'ont pas à être modifiées via cette API , elles existaient avant l'exercice et l'issue ne demandait pas d'y toucher.

### Commande `seed_demo`

La commande génère des données réalistes : noms français, codes médicaments uniques, distribution pondérée des statuts (50% valide, 35% en attente, 15% supprimé), et commentaires variés. Elle utilise `bulk_create` pour la performance.

### Tests

26 tests couvrent le CRUD, les validations (dates inversées, FK invalides, statut invalide, champs manquants), la vérification du 405 sur DELETE, et tous les filtres individuellement et en combinaison.
