# 🚨 IMPORTANT: Configuration Railway pour ce Monorepo

Ce projet est un **monorepo** avec `backend/` et `frontend/` séparés.

## ❌ NE PAS DÉPLOYER depuis la racine !

Railway NE PEUT PAS builder depuis la racine de ce projet.

## ✅ Configuration Correcte

### Créer 3 Services Séparés:

#### 1. PostgreSQL Database
```
Railway → + New → Database → Add PostgreSQL
```

#### 2. Backend Service
```
Railway → + New → GitHub Repo → wiw-ae-app
Settings → Source:
  Root Directory: backend    ← OBLIGATOIRE !
```

**Variables à ajouter:**
- Voir: `backend/.env.production.railway`

#### 3. Frontend Service
```
Railway → + New → GitHub Repo → wiw-ae-app
Settings → Source:
  Root Directory: frontend   ← OBLIGATOIRE !
```

**Variables à ajouter:**
- `VITE_API_URL=https://backend-url.up.railway.app/api`

## 📚 Guides Complets

- **Démarrage rapide:** `QUICKSTART_RAILWAY.md`
- **Guide détaillé:** `DEPLOY_PRODUCTION_RAILWAY.md`
- **Checklist:** `RAILWAY_DEPLOYMENT_CHECKLIST.md`

## ⚠️ Fichiers de Config Supprimés

Les fichiers suivants ont été **supprimés** car ils causaient des conflits:
- ❌ `nixpacks.toml` (racine)
- ❌ `railway.json` (racine)

Chaque service utilise maintenant:
- ✅ `backend/railway.toml` pour le backend
- ✅ Configuration Root Directory dans Railway

## 🎯 Architecture

```
Railway Project
├─ Postgres (Database)
├─ wiw-backend (repo: wiw-ae-app, root: backend/)
└─ wiw-frontend (repo: wiw-ae-app, root: frontend/)
```

**Chaque service doit pointer vers le MÊME repo GitHub mais avec un Root Directory différent !**

---

**Ne pas oublier:** Configurer le **Root Directory** dans Railway Settings !
