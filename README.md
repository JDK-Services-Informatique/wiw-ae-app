# WIW-AE+ Application

Application complète de gestion pour architectes et bureaux d'études techniques.

## 🚀 Fonctionnalités

- **Gestion des Appels d'Offres** : Suivi complet des candidatures et missions
- **Calcul d'Honoraires** : Formule OPC 1993 intégrée
- **Gestion d'Équipe** : Collaboration et compétences
- **Références** : Portfolio de projets et BET
- **Analytics** : Tableaux de bord de rentabilité
- **Templates** : Bibliothèque de documents prête à l'emploi

## 📦 Structure du Projet

```
wiw-ae-app/
├── backend/          # API Node.js + Prisma
├── frontend/         # Application React + Vite
├── render.yaml       # Configuration Render Blueprint
└── scripts/         # Scripts utilitaires
```

## 🛠️ Installation Locale

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Déploiement sur Render

### Méthode 1 : Blueprint (Recommandé)

1. Connectez votre repository GitHub à Render
2. Allez sur https://dashboard.render.com
3. Cliquez "New" > "Blueprint"
4. Sélectionnez ce repository
5. Render détectera automatiquement `render.yaml`
6. Cliquez "Apply"

Le Blueprint créera automatiquement :
- **wiw-ae-backend** : Service web Node.js
- **wiw-ae-frontend** : Site statique React
- **wiw-ae-db** : Base de données PostgreSQL

### Méthode 2 : Configuration Manuelle

Voir [DEPLOY_RENDER.md](./DEPLOY_RENDER.md) pour les instructions détaillées.

## 📝 Technologies

- **Frontend** : React, Vite, Tailwind CSS, Lucide React
- **Backend** : Node.js, Express, Prisma
- **Base de données** : PostgreSQL
- **Déploiement** : Render.com

## 📄 Licence

Propriétaire - Tous droits réservés


