# 🔧 Corrections rapides pour erreurs locales

## ❌ Erreur CORS - API pointe vers Koyeb

**Problème :** Le frontend essaie d'accéder à `https://wilful-roundworm-wiw-app-ca3e9be0.koyeb.app` au lieu de `http://localhost:4000`

**Solution :** Vérifier que `frontend/.env` contient :
```env
VITE_API_URL=http://localhost:4000/api
```

**Action :**
1. Vérifier que `frontend/.env` existe
2. S'il n'existe pas, copier depuis `frontend/env.example`
3. S'assurer que `VITE_API_URL=http://localhost:4000/api`
4. Redémarrer le serveur de développement (`npm run dev`)

## ❌ Erreur `statutsAO is not defined`

**Problème :** Variable `statutsAO` utilisée mais non définie dans `Tenders.jsx`

**Solution :** Corrigé dans le code - `statutsAO` est maintenant récupéré depuis `useListesDeroulantes()`

**Action :** Redémarrer le serveur de développement après le commit

## ✅ Checklist rapide

- [ ] `frontend/.env` existe avec `VITE_API_URL=http://localhost:4000/api`
- [ ] Backend démarré sur `http://localhost:4000`
- [ ] Frontend redémarré après modifications
- [ ] Pas d'erreurs dans la console

