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
├── scallingo.json      # Configuration Scallingo
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

## 🌐 Déploiement sur Scallingo

### Déploiement rapide

1. Connectez votre repository GitHub à Scallingo
2. Allez sur https://scallingo.app
3. Créez un nouveau projet
4. Ajoutez PostgreSQL (Database)
5. Déployez le backend (Root Directory: `backend`)
6. Déployez le frontend (Root Directory: `frontend`)

Voir [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) pour le guide complet ou [README_RAILWAY.md](./README_RAILWAY.md) pour le guide rapide.

## 📝 Technologies

- **Frontend** : React, Vite, Tailwind CSS, Lucide React
- **Backend** : Node.js, Express, Prisma
- **Base de données** : PostgreSQL
- **Déploiement** : Scallingo.app

## 📄 Licence

Propriétaire - Tous droits réservés


