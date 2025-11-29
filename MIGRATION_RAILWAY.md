# 🚂 Configuration Scallingo

## ✅ Changements effectués

### Fichiers créés

1. **`scallingo.json`** (racine)
   - Configuration Scallingo globale

2. **`backend/scallingo.json`**
   - Configuration spécifique au backend
   - Build et start commands

3. **`frontend/scallingo.json`**
   - Configuration spécifique au frontend
   - Support SPA avec `serve --single`

4. **`DEPLOY_RAILWAY.md`**
   - Guide de déploiement complet
   - Instructions étape par étape

5. **`README_RAILWAY.md`**
   - Guide rapide de déploiement
   - Instructions en 5 minutes

### Modifications

1. **`frontend/package.json`**
   - Ajout de `serve` pour servir le frontend en production
   - Nécessaire pour le routing SPA sur Scallingo

## 🚂 Configuration Scallingo

L'application est configurée pour être déployée sur Scallingo :

| Aspect | Configuration |
|--------|---------------|
| **Configuration** | `scallingo.json` (JSON) |
| **Base de données** | Service intégré PostgreSQL |
| **Variables d'env** | Définies dans Dashboard |
| **Monorepo** | Root Directory par service |
| **Déploiement** | Automatique via GitHub |
| **Coûts** | $5/mois (hobby plan) |

## 🚀 Avantages Scallingo

1. **Déploiement automatique** depuis GitHub
2. **Base de données intégrée** (PostgreSQL inclus)
3. **Interface simple** et intuitive
4. **Coûts réduits** (plan hobby $5/mois)
5. **Logs en temps réel** faciles à consulter
6. **Variables d'environnement** partagées automatiquement

## 📝 Prochaines étapes

### 1. Créer le projet Scallingo

1. Aller sur https://scallingo.app
2. Se connecter avec GitHub
3. Créer un nouveau projet
4. Connecter le repository

### 2. Déployer les services

Suivre le guide dans `DEPLOY_RAILWAY.md` ou `README_RAILWAY.md`

### 3. Migrer les données (si nécessaire)

Si vous avez des données à migrer depuis un autre service :

```bash
# Exporter depuis l'ancien service
pg_dump $OLD_DATABASE_URL > backup.sql

# Importer dans Scallingo
psql $RAILWAY_DATABASE_URL < backup.sql
```

### 4. Mettre à jour les URLs

- Mettre à jour `VITE_API_URL` dans le frontend
- Mettre à jour `FRONTEND_URL` et `CORS_ORIGIN` dans le backend

## 🔧 Configuration actuelle

### Backend
- **Root Directory** : `backend`
- **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command** : `npm start`
- **Port** : 5000 (ou variable PORT)

### Frontend
- **Root Directory** : `frontend`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npx serve -s dist -l $PORT --single`
- **Port** : Variable PORT (Scallingo assigne automatiquement)

### Base de données
- **Type** : PostgreSQL
- **Variables** : `DATABASE_URL` (injectée automatiquement)

## 📚 Documentation

- **Guide complet** : `DEPLOY_RAILWAY.md`
- **Guide rapide** : `README_RAILWAY.md`
- **Documentation Scallingo** : https://docs.scallingo.app

## ⚠️ Notes importantes

1. **Variables d'environnement** doivent être définies dans Scallingo Dashboard
2. **DATABASE_URL** est automatiquement partagée entre services
3. **Frontend** utilise `serve` pour le routing SPA
4. **Backend** doit avoir `FRONTEND_URL` et `CORS_ORIGIN` configurés

## 🐛 Dépannage

Voir la section "Dépannage" dans `DEPLOY_RAILWAY.md`

