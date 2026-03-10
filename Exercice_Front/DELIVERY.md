# Gestion des Prescriptions

## Couverture fonctionnelle

### Liste des prescriptions

Un tableau affiche pour chaque prescription le patient (nom et prénom), le médicament associé, les dates de début et de fin, le statut représenté par un chip coloré, ainsi que le commentaire éventuel. La pagination est déléguée au serveur et les colonnes sont triables via l'API.

### Création et édition

Un formulaire en Dialog permet de créer ou de modifier une prescription. Les champs patient et médicament sont sélectionnés via des Autocomplete avec recherche asynchrone vers l'API (debounce 300 ms, annulation des requêtes en cours via AbortController). La validation s'effectue côté client (champs requis, cohérence des dates) et les erreurs renvoyées par l'API sont parsées et redistribuées par champ. L'édition est déclenchée directement depuis le tableau.

### Filtrage

Une barre de filtres permet de restreindre la liste par recherche textuelle libre, patient, médicament, statut et plage de dates. Chaque filtre est transmis au backend sous forme de query params. Un bouton de réinitialisation remet tous les filtres à leur état initial.

---

## Stack technique

| Outil | Usage |
|---|---|
| React 19 + TypeScript | Framework UI et typage statique |
| Material UI v7 | Bibliothèque de composants |
| Redux Toolkit | Gestion de l'état global |
| Redux Persist + localForage | Cache IndexedDB automatique |
| React Router v6 | Routage avec layout Outlet |
| Vite | Bundler et serveur de développement |

## Architecture du projet

```
src/
├── controllers/            Providers globaux (Store Redux, Router)
├── views/                  Pages (Wrapper layout + vue Prescriptions)
├── components/
│   ├── PrescriptionTable/  Tableau principal et composant StatusChip
│   ├── PrescriptionFilters/Barre de filtres décomposée en sous-composants
│   ├── PrescriptionForm/   Dialog de création/édition et hook useFormState
│   └── Pagination/         Composant de pagination générique
├── store/
│   ├── patients/           Slice, thunks, selectors, interfaces
│   ├── medications/        Slice, thunks, selectors, interfaces
│   ├── prescriptions/      Slice, thunks, selectors, interfaces
│   └── utils/              fetchAllPages, buildQuery
├── hooks/                  useAppDispatch, useAppSelector typés, useAsyncSearch
└── theme.ts                Thème MUI AP-HP
```

## Installation et démarrage

```bash
npm install
npm run dev
```

La variable d'environnement `VITE_API_BASE_URL` doit pointer vers l'URL de l'API Django.

---

## Choix d'architecture et justifications

### Redux Toolkit et Redux Persist

Le store centralise trois domaines : patients, médicaments et prescriptions. Redux Persist avec localForage assure un cache automatique en IndexedDB. Au rechargement de la page, l'interface s'affiche instantanément avec les données en cache pendant que les fetches se relancent en arrière-plan. Chaque domaine suit une structure identique (slice / thunks / selectors / interfaces) pour la cohérence et la maintenabilité.

### Store normalisé

Les entités sont stockées par identifiant (`Record<number, T>`) plutôt qu'en tableau. Cela permet un accès en O(1) par ID , particulièrement utile pour le formulaire d'édition via `prescriptionById(id)` , et offre une déduplication naturelle. La conversion en tableau pour l'affichage est réalisée dans un `createSelector` mémoizé (`prescriptionsList`).

### Pagination serveur sur les prescriptions

Les prescriptions sont paginées côté API (`?offset=X&elements=Y`). Seule la page courante est conservée dans le store : le reducer vide `state.prescriptions` avant d'injecter les nouvelles données. Le total d'enregistrements provient de la réponse paginée et alimente le composant de pagination.

### Recherche asynchrone via `useAsyncSearch`

Les sélecteurs patient et médicament (filtres et formulaire) utilisent un hook générique `useAsyncSearch<T>` qui requête l'API à chaque frappe avec un debounce de 300 ms. Chaque nouvelle frappe annule la requête précédente via `AbortController`, évitant les race conditions. Les résultats sont à la fois affichés dans le dropdown et injectés dans le store Redux via un callback `onResults` qui dispatch une action `upsertPatients` / `upsertMedications`.

### Double alimentation du store

Le store patients/médicaments est alimenté par deux canaux complémentaires : le preload au montage du `Wrapper` (via `fetchAllPages`, charge l'intégralité du référentiel) et l'upsert incrémental à chaque recherche Autocomplete. Le preload garantit un cache complet dès le démarrage ; l'upsert enrichit le store avec d'éventuelles données créées après le preload initial. Le store normalisé (`Record<number, T>`) assure la déduplication naturelle des deux flux.

### Preload au niveau du Wrapper

Le chargement complet de patients et médicaments est déclenché dans le `Wrapper` (layout racine avec `<Outlet />`). Les données sont ainsi disponibles dès le montage de n'importe quelle route enfant. Combiné au cache Redux Persist, l'interface s'affiche instantanément avec les données en IndexedDB pendant que le preload rafraîchit en arrière-plan.

### Filtres en state local

Les filtres sont gérés par un `useState<PrescriptionFilters>` local à la vue `Prescriptions`, et non dans Redux. Ils sont volatiles et propres à la session de navigation : il n'y a pas de raison de les persister globalement. Un `useEffect` sur `filters` déclenche automatiquement le re-fetch via `loadPrescriptions`.

### Tri côté serveur

L'ordering est transmis à l'API Django via le paramètre `?ordering=field` (ou `-field` pour le sens descendant). Le cycle de clic suit la séquence asc → desc → aucun. Un tri côté client serait incohérent avec la pagination serveur.

### Composants filtres modulaires

La barre de filtres est décomposée en cinq sous-composants autonomes : `PatientSelect`, `MedicationSelect`, `StatusSelect`, `DateRangeFields` et un champ de recherche texte. `PatientSelect` et `MedicationSelect` utilisent `useAsyncSearch` pour interroger l'API en temps réel. Cette décomposition évite un composant monolithique et permet la réutilisation indépendante de chaque filtre.

### Hook `useFormState`

La logique du formulaire — state, validation client, soumission, gestion des erreurs API — est extraite dans un hook dédié, séparé du rendu. Le hook expose l'objet `existing` (prescription complète avec patient/médicament nestés) pour pré-remplir les Autocomplete en mode édition. Le composant `FormFields` est purement présentationnel. Cette séparation facilite les tests unitaires du hook indépendamment du composant.

### Alias d'import par domaine

Les alias `@store/*`, `@hooks/*`, `@views/*`, `@components/*` et `@controllers/*` sont déclarés dans `tsconfig` (paths) et dans Vite (`resolve.alias`). Les imports cross-domaine utilisent les alias ; les imports intra-domaine restent relatifs. `baseUrl` n'est pas utilisé, conformément aux recommandations TypeScript avec `moduleResolution: "bundler"`.

### Utilitaire `buildQuery`

Un helper générique transforme un objet de filtres en query string en ignorant les valeurs `undefined`, `null` et `''`. Il est utilisé par tous les thunks de fetch, ce qui évite la duplication de la logique de sérialisation.
