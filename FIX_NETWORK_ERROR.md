# 🔧 Résoudre l'erreur "Network Error"

## 🔍 Diagnostic rapide

### 1. Vérifier que le backend est démarré

**Dans un terminal, vérifiez :**
```powershell
# Vérifier si le port 4000 est utilisé
netstat -ano | findstr :4000
```

**Si rien n'apparaît**, le backend n'est pas démarré.

**Solution :** Démarrer le backend
```powershell
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Serveur accessible à:
   - Local:   http://localhost:4000
```

---

### 2. Vérifier l'URL API dans le frontend

**Ouvrir la console du navigateur (F12) et vérifier :**
- Les requêtes pointent vers `http://localhost:4000/api`
- Pas d'erreur `ERR_CONNECTION_REFUSED`
- Pas d'erreur CORS

**Si l'URL est incorrecte :**

1. **Vérifier `frontend/.env` :**
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

2. **Redémarrer le serveur frontend** (les variables `.env` ne sont chargées qu'au démarrage) :
   ```powershell
   # Arrêter (Ctrl+C)
   cd frontend
   npm run dev
   ```

---

### 3. Vérifier la configuration CORS du backend

**Le backend doit accepter l'origine du frontend.**

**Vérifier `backend/.env` :**
```env
CORS_ORIGIN=http://localhost:5174
FRONTEND_URL=http://localhost:5174
```

**OU** utiliser la variable `CORS_ALLOW_ALL` pour tester (développement uniquement) :
```env
CORS_ALLOW_ALL=true
```

**Redémarrer le backend après modification :**
```powershell
cd backend
# Arrêter (Ctrl+C)
npm run dev
```

---

### 4. Tester la connexion backend

**Dans le navigateur, ouvrir :**
- `http://localhost:4000/api/health`
- Devrait retourner : `{"status":"ok"}`

**Si erreur :**
- Le backend n'est pas démarré
- Le port est incorrect
- Le backend a crashé

---

## 🐛 Erreurs courantes

### ❌ `ERR_CONNECTION_REFUSED`

**Cause :** Le backend n'est pas démarré ou écoute sur un autre port.

**Solution :**
1. Démarrer le backend : `cd backend && npm run dev`
2. Vérifier le port dans `backend/.env` : `PORT=4000`
3. Vérifier que le frontend pointe vers le bon port : `VITE_API_URL=http://localhost:4000/api`

---

### ❌ `CORS policy: No 'Access-Control-Allow-Origin' header`

**Cause :** Le backend n'autorise pas l'origine du frontend.

**Solution :**

1. **Vérifier le port du frontend** (dans la barre d'adresse du navigateur)
   - Exemple : `http://localhost:5174/`

2. **Configurer `backend/.env` :**
   ```env
   CORS_ORIGIN=http://localhost:5174
   FRONTEND_URL=http://localhost:5174
   ```
   ⚠️ **Important :** Utiliser le **même port** que celui affiché dans votre navigateur.

3. **OU activer CORS_ALLOW_ALL (développement uniquement) :**
   ```env
   CORS_ALLOW_ALL=true
   ```

4. **Redémarrer le backend :**
   ```powershell
   cd backend
   # Arrêter (Ctrl+C)
   npm run dev
   ```

---

### ❌ `Network Error` (générique)

**Causes possibles :**
1. Backend non démarré
2. Mauvaise URL API
3. Problème CORS
4. Backend crashé

**Solution étape par étape :**

1. **Vérifier que le backend tourne :**
   ```powershell
   # Terminal 1 : Backend
   cd backend
   npm run dev
   ```

2. **Vérifier que le frontend pointe vers le bon port :**
   ```powershell
   # Terminal 2 : Frontend
   cd frontend
   # Vérifier frontend/.env
   cat .env  # ou type .env sur Windows
   # Doit contenir : VITE_API_URL=http://localhost:4000/api
   npm run dev
   ```

3. **Tester la connexion :**
   - Ouvrir `http://localhost:4000/api/health` dans le navigateur
   - Devrait retourner `{"status":"ok"}`

4. **Vérifier les logs backend :**
   - Regarder les logs dans le terminal backend
   - Chercher les erreurs (rouge)

---

## ✅ Checklist de vérification

- [ ] Backend démarré sur `http://localhost:4000`
- [ ] `/api/health` retourne `{"status":"ok"}`
- [ ] `frontend/.env` contient `VITE_API_URL=http://localhost:4000/api`
- [ ] Serveur frontend redémarré après modification de `.env`
- [ ] `backend/.env` contient `CORS_ORIGIN=http://localhost:5174` (ou le port du frontend)
- [ ] Backend redémarré après modification de `.env`
- [ ] Pas d'erreurs dans la console du navigateur (F12)
- [ ] Pas d'erreurs dans les logs backend

---

## 🚀 Solution rapide (tout réinitialiser)

### 1. Arrêter tous les serveurs
```powershell
# Dans chaque terminal, appuyer sur Ctrl+C
```

### 2. Configurer le backend
```powershell
cd backend

# Créer .env si nécessaire
if not exist .env copy env.example .env

# Éditer .env et ajouter :
# CORS_ORIGIN=http://localhost:5174
# FRONTEND_URL=http://localhost:5174
# PORT=4000
```

### 3. Configurer le frontend
```powershell
cd frontend

# Créer .env si nécessaire
if not exist .env copy env.example .env

# Éditer .env et ajouter :
# VITE_API_URL=http://localhost:4000/api
```

### 4. Démarrer le backend
```powershell
cd backend
npm run dev
```

**Attendre de voir :**
```
✅ Serveur accessible à: http://localhost:4000
```

### 5. Démarrer le frontend (dans un nouveau terminal)
```powershell
cd frontend
npm run dev
```

**Notez le port affiché** (ex: `http://localhost:5174/`)

### 6. Mettre à jour CORS si nécessaire
Si le frontend tourne sur un port différent de 5174, mettre à jour `backend/.env` :
```env
CORS_ORIGIN=http://localhost:[PORT]
FRONTEND_URL=http://localhost:[PORT]
```

Puis redémarrer le backend.

---

## 🔍 Test de diagnostic

**Ouvrir dans le navigateur :**
1. `http://localhost:4000/api/health` → Devrait retourner `{"status":"ok"}`
2. `http://localhost:4000/api/test-cors` → Devrait retourner les infos CORS

**Dans la console du navigateur (F12) :**
```javascript
// Tester la connexion API
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Si cela fonctionne, le problème vient du code frontend. Sinon, c'est un problème de configuration backend.

---

## 📞 Besoin d'aide ?

Si le problème persiste :
1. Vérifier les logs backend (terminal où `npm run dev` tourne)
2. Vérifier la console du navigateur (F12 > Console)
3. Vérifier l'onglet Network (F12 > Network) pour voir les requêtes échouées

