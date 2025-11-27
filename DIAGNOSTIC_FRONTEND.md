# 🔍 Diagnostic Frontend - Guide de dépannage

## ❌ Problème : Le frontend ne fonctionne pas

### Questions à se poser

1. **Où le frontend ne fonctionne-t-il pas ?**
   - [ ] En local (npm run dev)
   - [ ] Après build local (npm run build)
   - [ ] Sur Render (déploiement)
   - [ ] Erreur dans la console du navigateur

2. **Quel est le message d'erreur exact ?**
   - Notez le message d'erreur complet
   - Vérifiez la console du navigateur (F12)
   - Vérifiez les logs Render

---

## 🔧 Diagnostic étape par étape

### 1. Vérifier le build local

```bash
cd frontend
npm install
npm run build
```

**Si le build échoue :**
- Vérifiez les erreurs dans le terminal
- Vérifiez que toutes les dépendances sont installées
- Vérifiez les imports dans les fichiers

**Erreurs courantes :**
- `Cannot find module` → Dépendance manquante
- `Unexpected token` → Erreur de syntaxe
- `Failed to resolve import` → Chemin d'import incorrect

### 2. Vérifier le serveur de développement

```bash
cd frontend
npm run dev
```

**Si le serveur ne démarre pas :**
- Vérifiez le port 5173 (peut être occupé)
- Vérifiez les erreurs dans le terminal
- Vérifiez la console du navigateur

### 3. Vérifier les logs Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez le service `wiw-ae-frontend`
3. Cliquez sur l'onglet **"Logs"**
4. Vérifiez les erreurs de build ou de déploiement

**Erreurs courantes sur Render :**
- `Build failed` → Erreur dans le build
- `Missing files` → Fichiers manquants dans `dist/`
- `Timeout` → Le build prend trop de temps

### 4. Vérifier la console du navigateur

Ouvrez la console (F12) et vérifiez :

**Erreurs JavaScript :**
- `Uncaught Error` → Erreur d'exécution
- `Failed to load resource` → Fichier manquant
- `CORS error` → Problème de CORS avec l'API

**Erreurs réseau :**
- `404 Not Found` → Fichier ou route manquante
- `500 Internal Server Error` → Erreur serveur
- `Network Error` → Problème de connexion

---

## 🐛 Problèmes courants et solutions

### Problème 1 : Erreur "Cannot find module './i18n/config'"

**Cause :** Le fichier i18n n'existe pas ou le chemin est incorrect.

**Solution :**
```bash
# Vérifier que le fichier existe
ls frontend/src/i18n/config.js

# Si absent, créer la structure
mkdir -p frontend/src/i18n/locales
# Créer les fichiers nécessaires (voir RENDER_API_SETUP.md)
```

### Problème 2 : Erreur "Cannot find module './services/analytics'"

**Cause :** Le fichier analytics n'existe pas.

**Solution :**
```bash
# Vérifier que le fichier existe
ls frontend/src/services/analytics.js

# Si absent, créer le fichier (voir DOCUMENTATION_AVANCEE.md)
```

### Problème 3 : Erreur Service Worker

**Cause :** Le fichier `sw.js` n'existe pas dans `public/`.

**Solution :**
```bash
# Vérifier que le fichier existe
ls frontend/public/sw.js

# Si absent, créer le fichier (voir DOCUMENTATION_AVANCEE.md)
```

### Problème 4 : Erreur de build sur Render

**Cause :** Variables d'environnement manquantes ou build qui échoue.

**Solution :**
1. Vérifier les variables d'environnement dans Render Dashboard
2. Vérifier que `VITE_API_URL` est défini
3. Vérifier les logs de build dans Render

### Problème 5 : Page blanche

**Causes possibles :**
- Erreur JavaScript non gérée
- Problème avec React Router
- Erreur dans `main.jsx` ou `App.jsx`

**Solution :**
1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. Vérifier que `#root` existe dans `index.html`
4. Vérifier que `main.jsx` charge correctement

### Problème 6 : Erreur CORS

**Cause :** Le backend n'autorise pas les requêtes depuis le frontend.

**Solution :**
1. Vérifier `CORS_ORIGIN` dans le backend
2. Vérifier que `FRONTEND_URL` est correct
3. Vérifier que l'URL du frontend est autorisée

---

## ✅ Checklist de vérification

### Configuration de base
- [ ] `package.json` existe et est valide
- [ ] `vite.config.js` existe et est valide
- [ ] `index.html` existe et contient `<div id="root"></div>`
- [ ] `src/main.jsx` existe et importe `App.jsx`
- [ ] `src/App.jsx` existe et est valide

### Dépendances
- [ ] `node_modules/` existe (après `npm install`)
- [ ] Toutes les dépendances sont installées
- [ ] Pas de conflits de versions

### Fichiers requis
- [ ] `src/i18n/config.js` existe
- [ ] `src/i18n/locales/fr.json` existe
- [ ] `src/i18n/locales/en.json` existe
- [ ] `src/services/analytics.js` existe
- [ ] `public/sw.js` existe (optionnel mais recommandé)
- [ ] `public/manifest.json` existe (optionnel mais recommandé)

### Build
- [ ] `npm run build` fonctionne localement
- [ ] Le dossier `dist/` est créé après le build
- [ ] `dist/index.html` existe
- [ ] `dist/assets/` contient les fichiers JS/CSS

### Déploiement Render
- [ ] Le service `wiw-ae-frontend` existe sur Render
- [ ] Le statut est "Live" (pas "Building" ou "Failed")
- [ ] Les variables d'environnement sont configurées
- [ ] Les routes SPA sont configurées (`/*` → `/index.html`)
- [ ] Le build a réussi (voir les logs)

---

## 🚀 Solutions rapides

### Solution 1 : Rebuild complet

```bash
cd frontend
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Solution 2 : Vérifier les imports

Vérifiez que tous les imports dans `main.jsx` existent :
- `./App` → `src/App.jsx`
- `./styles/index.css` → `src/styles/index.css`
- `./i18n/config` → `src/i18n/config.js`
- `./services/analytics` → `src/services/analytics.js`

### Solution 3 : Désactiver temporairement les fonctionnalités

Si une fonctionnalité cause problème, commentez-la temporairement :

```jsx
// Dans main.jsx
// import './i18n/config';  // Désactiver temporairement
// import { initAnalytics } from './services/analytics';  // Désactiver temporairement
// initAnalytics();  // Désactiver temporairement
```

### Solution 4 : Redéployer sur Render

1. Allez sur Render Dashboard
2. Sélectionnez `wiw-ae-frontend`
3. Cliquez sur **"Manual Deploy"** > **"Deploy latest commit"**

---

## 📞 Obtenir de l'aide

### Informations à fournir

1. **Message d'erreur exact** (copier-coller)
2. **Console du navigateur** (screenshot ou copier les erreurs)
3. **Logs Render** (copier les dernières lignes)
4. **Configuration** :
   - Version de Node.js
   - Version de npm
   - Système d'exploitation
5. **Étapes pour reproduire** le problème

### Ressources

- **Documentation Render** : https://render.com/docs
- **Documentation Vite** : https://vitejs.dev
- **Documentation React** : https://react.dev
- **Troubleshooting Render** : `TROUBLESHOOTING_RENDER.md`

---

**Dernière mise à jour** : Décembre 2024


