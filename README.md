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
- Frontend : Expo, démarrage avec `npx expo start`, pas besoin d'Android Studio / Xcode.
- Langage frontend : TypeScript.
- Navigation : React Navigation.
- Icônes : Font Awesome / Bootstrap Icons uniquement.

## Prérequis

- Node.js >= 18 et npm
- MySQL >= 8 installé et démarré en local
- Git
- Pour le frontend : l'application Expo Go sur téléphone (Android/iOS), ou un émulateur

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

À compléter à l'étape 3.

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
```

## Avancement

- [x] Étape 1 — Backend : GET /api/products (liste + filtres)
- [x] Étape 2 — Backend : GET /:id, POST, PUT, PATCH stock, DELETE
- [ ] Étape 3 — Frontend : écran liste + navigation
- [ ] Étape 4 — Frontend : détail produit + entrée/sortie de stock
- [ ] Étape 5 — Frontend : formulaire création/modification
- [ ] Étape 6 (bonus) — Dashboard + notifications locales
