# Application mobile de gestion de stock — CBX Conseil

Application mobile de gestion de stock pour un entrepôt fictif : consultation du stock, entrées/sorties d'articles, alertes de rupture.

## Architecture

- Frontend : application mobile React Native (Expo) en TypeScript, appelle l'API via HTTP.
- Backend : API REST Node.js / Express.
- Base de données : MySQL.

## Choix techniques

- Backend : Node.js + Express, standard et simple à faire tourner en local.
- Base de données : MySQL avec le driver `mysql2` (requêtes préparées, async/await).
- Pas d'ORM : une seule table principale, un ORM n'apporte pas de bénéfice ici.
- Frontend : Expo, démarrage avec `npx expo start`, pas besoin d'Android Studio / Xcode pour tester (Expo Go), utilisable aussi avec un émulateur.
- Langage frontend : TypeScript strict.
- Navigation : React Navigation (native stack).
- Gestion d'état : `useState` / `useMemo`, pas de librairie externe (état simple, une seule liste).
- Icônes : `@expo/vector-icons` (Font Awesome 5), aucune icône générée par IA.
- Notifications locales : `expo-notifications`, compatible Expo Go (seules les notifications push distantes nécessitent un development build depuis le SDK 53).

## Prérequis

- Node.js >= 18 et npm
- MySQL >= 8 installé et démarré en local
- Git
- Android Studio avec un émulateur configuré (AVD), ou Expo Go sur téléphone

## Installation et lancement — Backend

1. Cloner le dépôt
```
git clone https://github.com/stshauke/Application-mobile-de-gestion-de-stock---CBX-Conseil.git
cd backend
```

2. Installer les dépendances
```
npm install
```

3. Créer la base de données
```
mysql -u root -p < sql/schema.sql
```

4. Configurer les variables d'environnement
```
cp .env.example .env
```
Adapter `DB_USER` / `DB_PASSWORD` dans `.env` selon votre installation MySQL.

5. Démarrer le serveur
```
npm run dev
```
ou
```
npm start
```

Le serveur démarre sur `http://localhost:3000`.

## Tester l'API en local

```
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products
curl "http://localhost:3000/api/products?category=Audio"
curl "http://localhost:3000/api/products?search=casque"
curl http://localhost:3000/api/products/1

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam HD","reference":"VID-006","category":"Video","quantity":10,"alert_threshold":3}'

curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Nouveau nom","alert_threshold":4}'

curl -X PATCH http://localhost:3000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"type":"IN","quantity":5}'

curl -X PATCH http://localhost:3000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"type":"OUT","quantity":3}'

curl -X DELETE http://localhost:3000/api/products/1
```

Sous Windows (cmd.exe), échapper les guillemets :
```
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Webcam HD\",\"reference\":\"VID-006\",\"category\":\"Video\"}"
```

## Routes de l'API

| Méthode | Route | Description |
|---|---|---|
| GET | /api/health | Vérifie que l'API répond |
| GET | /api/products | Liste des produits (filtres ?category= et ?search=) |
| GET | /api/products/:id | Détail d'un produit |
| POST | /api/products | Création d'un produit |
| PUT | /api/products/:id | Modification d'un produit |
| PATCH | /api/products/:id/stock | Mouvement de stock : { "type": "IN"|"OUT", "quantity": n } |
| DELETE | /api/products/:id | Suppression d'un produit |

Règles de validation :
- `name`, `reference`, `category` obligatoires à la création
- `quantity` et `alert_threshold` doivent être des entiers >= 0
- Une sortie de stock ne peut jamais faire passer la quantité sous 0
- Une référence déjà utilisée renvoie une erreur 409

## Installation et lancement — Frontend

1. Ouvrir l'émulateur Android (Android Studio > Device Manager > lancer un appareil virtuel déjà créé).

2. Installer les dépendances
```
cd frontend
npm install
```

3. Démarrer le backend dans un autre terminal (le frontend en a besoin)
```
cd backend
npm run dev
```

4. Vérifier l'URL de l'API dans `frontend/src/services/api.ts` : `10.0.2.2` est l'alias standard vers `localhost` du PC depuis un émulateur Android. Pas de changement nécessaire si vous utilisez l'émulateur Android par défaut.

5. Démarrer Expo
```
npx expo start
```

6. Dans le terminal Expo, appuyer sur `a` pour lancer sur l'émulateur Android, `i` pour iOS (macOS uniquement), ou scanner le QR code avec Expo Go sur téléphone.

## Structure du projet

```
stock-app/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── sql/
│   │   └── schema.sql
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── productController.js
│       ├── routes/
│       │   └── productRoutes.js
│       └── middlewares/
│           └── validateProduct.js
└── frontend/
    ├── App.tsx
    ├── index.ts
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── types/
        │   └── index.ts
        ├── services/
        │   └── api.ts
        ├── utils/
        │   └── stockStatus.ts
        ├── navigation/
        │   └── AppNavigator.tsx
        ├── components/
        │   ├── ProductCard.tsx
        │   ├── SearchFilterBar.tsx
        │   ├── StockMovementModal.tsx
        │   └── FormField.tsx
        └── screens/
            ├── ProductListScreen.tsx
            ├── ProductDetailScreen.tsx
            ├── ProductFormScreen.tsx
            └── DashboardScreen.tsx
```

Le fichier `src/services/notifications.ts` gère la demande de permission et la programmation des notifications locales.

## Avancement

- [x] Étape 1 — Backend : GET /api/products (liste + filtres)
- [x] Étape 2 — Backend : GET /:id, POST, PUT, PATCH stock, DELETE
- [x] Étape 3 — Frontend : écran liste + navigation + recherche + filtre catégorie
- [x] Étape 4 — Frontend : détail produit + entrée/sortie de stock
- [x] Étape 5 — Frontend : formulaire création/modification + suppression
- [x] Étape 6 (bonus) — Dashboard (statistiques + graphique) + notifications locales de rupture

## Notes sur les notifications locales

Au lancement de l'application, si un ou plusieurs produits sont en rupture de stock (quantité à 0), le code tente d'envoyer une notification locale listant ces produits, via `expo-notifications`. En test sur Expo Go/Android (SDK 57), le module lève une erreur interne au chargement à cause d'une restriction liée aux notifications push (retirées d'Expo Go depuis le SDK 53) ; le code intercepte cette erreur avec un `try/catch` pour ne jamais faire planter l'application, mais la notification n'apparaît alors pas dans ce contexte précis. Sur un development build ou une app publiée (hors Expo Go), la fonctionnalité s'exécute normalement sans cette restriction.
