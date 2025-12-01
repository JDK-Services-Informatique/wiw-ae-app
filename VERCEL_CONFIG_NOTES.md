# 📝 Notes Configuration Vercel

## ⚠️ Configuration Choisie : Déploiements Séparés

Nous utilisons **deux projets Vercel séparés** plutôt qu'un monorepo unique.

### Pourquoi ?

✅ **Avantages des déploiements séparés** :
- Configuration plus simple
- Builds indépendants (backend ne rebuild pas si frontend change)
- Logs et monitoring séparés
- Variables d'environnement isolées
- Domaines personnalisés plus faciles à configurer

❌ **Inconvénients du monorepo Vercel** :
- Configuration complexe
- Builds plus lents (tout rebuild ensemble)
- Difficile à débugger
- Conflits de configuration possibles

### Configuration Actuelle

#### Backend
- **Fichier config** : `backend/vercel.json`
- **Root Directory** : `backend/`
- **Build Command** : `npm run build` (exécute `prisma generate`)
- **Output Directory** : (aucun, serverless functions)

#### Frontend
- **Fichier config** : (aucun, configuration par défaut Vite)
- **Root Directory** : `frontend/`
- **Build Command** : `npm run build` (exécute `vite build`)
- **Output Directory** : `dist`

#### Racine
- **`vercel.json`** → Sauvegardé comme `vercel.json.monorepo.backup`
  - Ce fichier est conservé en backup au cas où vous voudriez tester l'approche monorepo
  - **Ne PAS utiliser** pour les déploiements actuels

### Comment Déployer

#### 1. Backend
```bash
# Dans Vercel Dashboard
Project Name: wiw-ae-backend
Root Directory: backend/
Framework: Other
Build Command: npm run build
Install Command: npm install
```

#### 2. Frontend
```bash
# Dans Vercel Dashboard
Project Name: wiw-ae-frontend
Root Directory: frontend/
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Si vous voulez utiliser le monorepo

1. **Supprimez les projets Vercel séparés**
2. **Restaurez** `vercel.json` :
   ```bash
   mv vercel.json.monorepo.backup vercel.json
   ```
3. **Déployez** avec Root Directory : `.` (racine)
4. **Attention** : plus complexe à maintenir

### Fichiers de Configuration

```
wiw-ae-app/
├── vercel.json.monorepo.backup   ← Backup (ne pas utiliser)
├── .vercelignore                 ← Ignore certains fichiers
├── backend/
│   └── vercel.json               ← Config backend (UTILISÉ)
└── frontend/
    └── (pas de vercel.json)      ← Config par défaut Vite
```

---

## 🔧 Résolution de l'Erreur "npm run build exited with 1"

### Cause
Le backend n'avait pas de script `build` dans `package.json`.

### Solution Appliquée
Ajout de `"build": "prisma generate"` dans `backend/package.json`.

### Vérification
```bash
cd backend
npm run build
# Devrait afficher : ✔ Generated Prisma Client
```

---

## 📚 Documentation Complète

Suivez le guide complet : **DEPLOYMENT_CHECKLIST.md**
