# WIW-AE+ 🏗️

Application web de gestion de projets pour agences d'architecture et bureaux d'études techniques (BET).

## 📋 Description

WIW-AE+ est une plateforme complète permettant aux architectes et ingénieurs de :
- 📊 Gérer leurs projets et devis
- 🎯 Suivre les appels d'offres
- 👥 Organiser les équipes et ressources
- 💰 Calculer les honoraires (formule OPC 1993)
- 📈 Analyser les performances avec tableaux de bord
- 📚 Utiliser une bibliothèque de templates

## 🚀 Stack Technique

### Backend
- **Runtime:** Node.js 18+ avec Express.js
- **Base de données:** PostgreSQL avec Prisma ORM
- **Authentification:** JWT avec httpOnly cookies
- **Sécurité:** Helmet, rate limiting, validation des inputs
- **Email:** Nodemailer pour les notifications

### Frontend
- **Framework:** React 18 avec Vite
- **Routing:** React Router v6 (flags v7 activés)
- **Styling:** Tailwind CSS 4.0
- **Icons:** Lucide React
- **Exports:** jsPDF et xlsx

## 🔒 Sécurité

Le projet implémente de nombreuses mesures de sécurité :

- ✅ JWT stockés dans httpOnly cookies (protection XSS)
- ✅ Rate limiting sur authentification (protection brute force)
- ✅ Validation et sanitization des inputs (express-validator)
- ✅ CORS configuré de manière stricte
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Hachage bcrypt pour les mots de passe
- ✅ Tokens de reset password sécurisés et à usage unique
- ✅ 0 vulnérabilités npm

**Voir [SECURITY.md](./SECURITY.md) pour le guide complet de sécurité.**

## 📦 Installation Locale

### Prérequis
- Node.js 18+
- PostgreSQL 14+ (ou SQLite pour le dev)
- npm ou yarn

### Backend

```bash
cd backend
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos valeurs (voir section Configuration)

# Base de données
npm run db:generate
npm run db:migrate

# Démarrage
npm run dev
```

Le backend sera accessible sur `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install

# Configuration
cp .env.example .env
# Éditer VITE_API_URL=http://localhost:4000/api

# Démarrage
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'Environnement Backend

Créer un fichier `.env` dans `backend/` :

```env
# Serveur
PORT=4000
NODE_ENV=development

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/wiw
# ou pour SQLite en dev:
# DATABASE_URL=file:./dev.db

# Sécurité (IMPORTANT: générer une vraie clé en production!)
JWT_SECRET=<générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")>
ALLOWED_ORIGINS=http://localhost:5173

# Email (optionnel pour dev, obligatoire pour reset password en prod)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@wiw-ae-plus.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100        # 100 requêtes max par fenêtre
```

### Variables d'Environnement Frontend

Créer un fichier `.env` dans `frontend/` :

```env
VITE_API_URL=http://localhost:4000/api
```

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Scripts Disponibles

### Backend
- `npm run dev` - Démarre le serveur en mode développement
- `npm start` - Démarre le serveur en production
- `npm test` - Lance les tests Jest
- `npm run lint` - Vérifie le code avec ESLint
- `npm run lint:fix` - Corrige automatiquement les erreurs ESLint
- `npm run format` - Formate le code avec Prettier
- `npm run db:migrate` - Applique les migrations Prisma
- `npm run db:generate` - Génère le client Prisma
- `npm run db:push` - Push le schéma sans migration
- `npm run db:seed` - Seed la base de données

### Frontend
- `npm run dev` - Démarre Vite en mode développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm test` - Lance les tests Vitest
- `npm run lint` - Lint (si configuré)

## 🏗️ Architecture

```
wiw-ae-app/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Logique métier
│   │   ├── middlewares/      # Auth, validation, rate limiting
│   │   ├── routes/           # Définition des routes API
│   │   ├── services/         # Services (email, business logic)
│   │   ├── utils/            # Utilitaires (logger, validation)
│   │   ├── prismaClient.js   # Client Prisma
│   │   └── server.js         # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma     # Schéma de base de données
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # API clients
│   │   ├── hooks/            # React hooks personnalisés
│   │   ├── utils/            # Fonctions utilitaires
│   │   └── App.jsx           # Composant racine
│   └── package.json
│
├── SECURITY.md               # Guide de sécurité
└── README.md                 # Ce fichier
```

## 🔑 Authentification

Le système utilise JWT avec httpOnly cookies :

1. **Login:** `POST /api/auth/login`
   - Body: `{ email, motDePasse }`
   - Retourne: `{ user, token }` + cookie httpOnly

2. **Register:** `POST /api/auth/register`
   - Body: `{ nom, prenom, email, motDePasse }`
   - Validation: min 8 caractères, majuscule, minuscule, chiffre

3. **Logout:** `POST /api/auth/logout`
   - Supprime le cookie httpOnly

4. **Reset Password:**
   - `POST /api/auth/forgot-password` - Envoie email avec token
   - `POST /api/auth/reset-password` - Réinitialise avec token

## 🎭 Rôles et Permissions

- **USER:** Utilisateur basique
- **ASSISTANT:** Assistant de projet
- **CHEF_PROJET:** Chef de projet (accès complet aux projets)
- **ADMIN:** Administrateur (accès total)

## 📊 API Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/forgot-password` - Demande reset password
- `POST /api/auth/reset-password` - Reset password

### Projets (protégés)
- `GET /api/projets` - Liste des projets
- `POST /api/projets` - Créer un projet
- `GET /api/projets/:id` - Détails d'un projet
- `PUT /api/projets/:id` - Mettre à jour un projet
- `DELETE /api/projets/:id` - Supprimer un projet

### Devis (protégés)
- `GET /api/devis` - Liste des devis
- `POST /api/devis` - Créer un devis

### Appels d'Offres (protégés)
- `GET /api/appels` - Liste des AO
- `POST /api/appels` - Créer un AO

### Honoraires (protégés + protection données financières)
- `GET /api/honoraires` - Calculs d'honoraires
- `POST /api/honoraires` - Nouveau calcul

### Health Checks
- `GET /api/health` - Status du serveur
- `GET /api/ready` - Status de la base de données

## 🚢 Déploiement

### Railway.app (recommandé)

Voir les guides détaillés :
- [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) - Guide complet
- [README_RAILWAY.md](./README_RAILWAY.md) - Guide rapide
- [RAILWAY_ENV_SETUP.md](./RAILWAY_ENV_SETUP.md) - Configuration des variables

**Étapes rapides :**
1. Connecter le repository GitHub à Railway
2. Ajouter un service PostgreSQL
3. Déployer le backend (Root: `backend`)
4. Configurer les variables d'environnement
5. Déployer le frontend (Root: `frontend`)

### Autres Plateformes

- **Backend:** Render, Heroku, AWS, Vercel
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Database:** Supabase, Heroku Postgres, AWS RDS

### Checklist de Production

Avant de déployer en production :

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` généré avec crypto (256 bits min)
- [ ] `ALLOWED_ORIGINS` configuré avec domaines spécifiques
- [ ] Configuration SMTP pour emails
- [ ] Base de données de production prête
- [ ] SSL/HTTPS activé
- [ ] Backups configurés
- [ ] Monitoring configuré
- [ ] Tests passants

## 🐛 Débogage

### Erreurs Communes

**CORS Error:**
```
Access-Control-Allow-Origin header
```
→ Vérifier `ALLOWED_ORIGINS` dans `.env` backend

**JWT Error:**
```
jwt must be provided / jwt malformed
```
→ Vérifier `JWT_SECRET` est défini et identique entre sessions

**Database Error:**
```
Can't reach database server
```
→ Vérifier `DATABASE_URL` et que PostgreSQL est accessible

**Email Error:**
```
Connection timeout SMTP
```
→ Vérifier configuration SMTP (optionnel en dev)

## 📈 Historique des Versions

### Version 0.2.0 (2025-11-29) - Améliorations Majeures

🔒 **Sécurité:**
- Migration JWT vers httpOnly cookies (protection XSS)
- Implémentation rate limiting complet (brute force protection)
- Validation et sanitization des inputs (express-validator)
- Security headers stricts (CSP, HSTS, X-Frame-Options)
- Suppression credentials exposés dans git
- Configuration CORS sécurisée (suppression wildcards)

🚀 **Fonctionnalités:**
- Service email avec nodemailer
- Templates HTML professionnels pour emails
- Endpoint logout fonctionnel
- Vérifications d'autorisation basées sur rôles
- Correction autorisation hardcodée

📝 **Documentation:**
- Guide de sécurité complet (SECURITY.md)
- README amélioré et détaillé
- Configuration .env documentée

🔧 **Qualité de Code:**
- ESLint et Prettier configurés
- 0 vulnérabilités npm (multer v2.0.2, js-yaml patché)
- Logger centralisé (Winston)
- Middlewares de validation réutilisables

### Version 0.1.0 - Version Initiale

- Fonctionnalités de base
- Authentification JWT
- CRUD projets, devis, AO
- Calcul d'honoraires
- Interface React

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Code

- Utiliser ESLint (`npm run lint`)
- Formater avec Prettier (`npm run format`)
- Tester avant commit (`npm test`)
- Suivre les conventions de commit (conventional commits)

## 📜 Licence

Propriétaire - Tous droits réservés

## 👥 Équipe

- Développement: Équipe WIW-AE+

## 📞 Support & Documentation

### Guides Disponibles

- [SECURITY.md](./SECURITY.md) - Guide de sécurité complet
- [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) - Déploiement Railway
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Installation locale
- [FIX_NETWORK_ERROR.md](./FIX_NETWORK_ERROR.md) - Résolution erreurs réseau
- [DOCUMENTATION_FONCTIONNALITES.md](./DOCUMENTATION_FONCTIONNALITES.md) - Fonctionnalités détaillées

### Pour Signaler un Problème

- **Bug:** Créer une issue GitHub
- **Sécurité:** Voir SECURITY.md (ne pas créer d'issue publique)
- **Question:** Consulter la documentation d'abord

---

**Version:** 0.2.0
**Dernière mise à jour:** 2025-11-29
**Status:** ✅ Production-ready
