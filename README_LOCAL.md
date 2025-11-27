# 🚀 Démarrage rapide en local

## Méthode rapide (Windows)

```bash
# Double-cliquer sur start-local.bat
# Ou dans PowerShell :
.\start-local.bat
```

## Méthode rapide (Linux/Mac)

```bash
chmod +x start-local.sh
./start-local.sh
```

## Méthode manuelle

### 1. Configuration

**Backend :**
```bash
cd backend
cp env.example .env
# Éditer .env et configurer DATABASE_URL et JWT_SECRET
```

**Frontend :**
```bash
cd frontend
cp env.example .env
# VITE_API_URL est déjà configuré pour localhost
```

### 2. Installation

```bash
# Backend
cd backend
npm install
npm run db:generate

# Frontend
cd frontend
npm install
```

### 3. Base de données

**Option SQLite (rapide) :**
```env
# Dans backend/.env
DATABASE_URL="file:./prisma/dev.db"
```

Puis :
```bash
cd backend
npm run db:push
```

**Option PostgreSQL :**
1. Installer PostgreSQL
2. Créer la base : `CREATE DATABASE wiw_db;`
3. Configurer `DATABASE_URL` dans `backend/.env`
4. Migrer : `npm run db:migrate`

### 4. Démarrer

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### 5. Accéder

- Frontend : http://localhost:5173
- Backend API : http://localhost:4000/api
- Health check : http://localhost:4000/api/health

## 🔧 Générer un JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans `backend/.env` comme valeur de `JWT_SECRET`.

## 📚 Documentation complète

Voir [LOCAL_SETUP.md](./LOCAL_SETUP.md) pour plus de détails.

