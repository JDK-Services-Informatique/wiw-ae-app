# 🔧 Fix CORS - Frontend pointe vers Koyeb au lieu de localhost

## ❌ Problème

Le frontend essaie d'accéder à `https://wilful-roundworm-wiw-app-ca3e9be0.koyeb.app` au lieu de `http://localhost:4000/api`, ce qui cause des erreurs CORS.

## ✅ Solution

### 1. Vérifier le fichier `.env` dans `frontend/`

**Windows (PowerShell) :**
```powershell
cd frontend
Get-Content .env
```

**Linux/Mac :**
```bash
cd frontend
cat .env
```

### 2. Si le fichier n'existe pas ou contient l'URL Koyeb

**Créer/modifier `frontend/.env` :**
```env
VITE_API_URL=http://localhost:4000/api
```

**Windows :**
```powershell
cd frontend
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

**Linux/Mac :**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

### 3. Redémarrer le serveur de développement

**Important :** Vite ne charge les variables `.env` qu'au démarrage. Il faut **redémarrer complètement** le serveur :

1. Arrêter le serveur (Ctrl+C)
2. Redémarrer : `npm run dev`

### 4. Vérifier que le backend tourne

Le backend doit être démarré sur `http://localhost:4000` :

```bash
cd backend
npm run dev
```

### 5. Vérifier dans la console du navigateur

Après redémarrage, les requêtes devraient pointer vers :
- ✅ `http://localhost:4000/api/...`
- ❌ PAS `https://wilful-roundworm-wiw-app-ca3e9be0.koyeb.app/...`

## 🔍 Vérification

Ouvrir la console du navigateur (F12) et vérifier :
- Les requêtes réseau doivent pointer vers `localhost:4000`
- Plus d'erreurs CORS
- Le backend doit répondre correctement

## ⚠️ Si le problème persiste

1. **Vider le cache du navigateur**
   - Ctrl+Shift+Delete
   - Cocher "Cache" et "Cookies"
   - Vider

2. **Vérifier localStorage**
   - Console : `localStorage.getItem('api_url')` ou similaire
   - Si une URL Koyeb est stockée, la supprimer

3. **Vérifier vite.config.js**
   - S'assurer qu'il n'y a pas d'URL Koyeb en dur

4. **Mode incognito**
   - Tester en mode navigation privée pour éviter le cache

