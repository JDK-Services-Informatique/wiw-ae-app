# 🔧 Résolution Erreur 404 - Frontend Render

## ❌ Problème
`https://wiw-ae-frontend.onrender.com/` retourne une erreur 404

---

## ✅ Solution Étape par Étape

### Étape 1 : Vérifier si le service existe sur Render

1. **Connectez-vous à Render Dashboard**
   - Allez sur https://dashboard.render.com
   - Connectez-vous avec votre compte

2. **Vérifiez la liste des services**
   - Dans le dashboard, regardez la liste des services
   - Cherchez `wiw-ae-frontend`

**Si le service n'existe PAS :**
→ Passez à l'**Étape 2** (Créer le service)

**Si le service existe :**
→ Passez à l'**Étape 3** (Vérifier le statut)

---

### Étape 2 : Créer le service via Blueprint

#### Option A : Via Blueprint (Recommandé)

1. **Accéder aux Blueprints**
   - Dans Render Dashboard, cliquez sur **"New"** (en haut à droite)
   - Sélectionnez **"Blueprint"**

2. **Connecter le repository**
   - Cliquez sur **"Connect account"** si GitHub n'est pas connecté
   - Sélectionnez votre repository : `JDK-Services-Informatique/wiw-ae-app`
   - Branche : `main`
   - Cliquez sur **"Connect"**

3. **Appliquer le Blueprint**
   - Render détectera automatiquement le fichier `render.yaml`
   - Vérifiez la configuration affichée :
     - ✅ `wiw-ae-backend` (Web Service)
     - ✅ `wiw-ae-frontend` (Static Site)
     - ✅ `wiw-ae-db` (PostgreSQL)
   - Cliquez sur **"Apply"**

4. **Attendre le déploiement**
   - Le déploiement prend généralement **5-10 minutes**
   - Surveillez la progression dans le dashboard
   - Attendez que tous les services soient **"Live"** (vert)

#### Option B : Création manuelle (Si Blueprint échoue)

1. **Créer le Static Site**
   - Cliquez sur **"New"** > **"Static Site"**
   - Connectez votre repository GitHub
   - Repository : `JDK-Services-Informatique/wiw-ae-app`
   - Branch : `main`

2. **Configuration**
   - **Name** : `wiw-ae-frontend`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

3. **Variables d'environnement**
   - Cliquez sur **"Advanced"**
   - Ajoutez :
     ```
     VITE_API_URL=https://wiw-ae-backend.onrender.com
     ```
     ⚠️ Remplacez par l'URL réelle du backend une fois déployé

4. **Routes SPA (Important !)**
   - Cliquez sur **"Advanced"** > **"Redirects/Rewrites"**
   - Cliquez sur **"Add Redirect/Rewrite"**
   - Configuration :
     - **Source** : `/*`
     - **Destination** : `/index.html`
     - **Type** : **Rewrite** (pas Redirect)
   - Cliquez sur **"Add"**

5. **Créer le service**
   - Cliquez sur **"Create Static Site"**

---

### Étape 3 : Vérifier le statut du service

1. **Ouvrir le service**
   - Cliquez sur `wiw-ae-frontend` dans le dashboard

2. **Vérifier le statut**
   - En haut de la page, vous verrez le statut :
     - ✅ **Live** (vert) : Le service fonctionne
     - 🟡 **Building** (jaune) : En cours de déploiement (attendre)
     - 🔴 **Failed** (rouge) : Le déploiement a échoué
     - ⚪ **Suspended** (gris) : Suspendu (plan gratuit)

3. **Si le statut est "Building"**
   - Attendez 3-5 minutes
   - Rafraîchissez la page
   - Le statut devrait passer à "Live"

4. **Si le statut est "Failed"**
   → Passez à l'**Étape 4** (Vérifier les logs)

5. **Si le statut est "Suspended"**
   - C'est normal pour le plan gratuit après 15 min d'inactivité
   - Faites une requête à l'URL
   - Attendez 30-60 secondes
   - Le service devrait se réveiller

---

### Étape 4 : Vérifier les logs de build

1. **Ouvrir les logs**
   - Dans le service `wiw-ae-frontend`
   - Cliquez sur l'onglet **"Logs"** (en haut)

2. **Chercher les erreurs**
   - Faites défiler jusqu'en haut des logs
   - Cherchez les lignes avec **"error"** ou **"Error"**

**Erreurs courantes :**

#### Erreur : "Build failed"
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```
**Solution :**
- Vérifiez que `package.json` contient le script `build`
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les erreurs de syntaxe dans le code

#### Erreur : "Cannot find module"
```
Error: Cannot find module './i18n/config'
```
**Solution :**
- Vérifiez que tous les fichiers importés existent
- Vérifiez les chemins d'import dans `main.jsx`

#### Erreur : "Missing files"
```
Error: ENOENT: no such file or directory
```
**Solution :**
- Vérifiez que `dist/` contient `index.html`
- Vérifiez que `staticPublishPath: dist` est correct dans `render.yaml`

#### Erreur : "Build timeout"
```
Build timed out after 20 minutes
```
**Solution :**
- Le build prend trop de temps
- Optimisez les dépendances
- Contactez le support Render

---

### Étape 5 : Vérifier la configuration

1. **Vérifier render.yaml**
   - Le fichier doit être à la racine du projet
   - Vérifiez la syntaxe YAML (pas d'erreurs d'indentation)

2. **Vérifier la structure**
   ```
   wiw-ae-app/
   ├── render.yaml          ✅ À la racine
   ├── frontend/
   │   ├── package.json     ✅
   │   ├── vite.config.js   ✅
   │   ├── index.html       ✅
   │   └── src/
   │       └── main.jsx     ✅
   ```

3. **Vérifier les routes SPA**
   - Dans Render Dashboard > Service > Settings
   - Vérifiez que la route `/*` → `/index.html` existe
   - Type : **Rewrite** (pas Redirect)

---

### Étape 6 : Redéployer manuellement

Si le service existe mais ne fonctionne pas :

1. **Redéployer**
   - Dans le service `wiw-ae-frontend`
   - Cliquez sur **"Manual Deploy"** (en haut à droite)
   - Sélectionnez **"Deploy latest commit"**
   - Cliquez sur **"Deploy"**

2. **Attendre le déploiement**
   - Surveillez les logs en temps réel
   - Attendez que le statut passe à "Live"

---

### Étape 7 : Vérifier l'URL

1. **Vérifier l'URL exacte**
   - Dans Render Dashboard > Service
   - L'URL est affichée en haut : `https://wiw-ae-frontend.onrender.com`
   - Vérifiez qu'il n'y a pas de typo

2. **Tester l'URL**
   - Ouvrez l'URL dans un navigateur
   - Si 404, attendez 30 secondes (service suspendu)
   - Réessayez

3. **Vérifier avec curl**
   ```bash
   curl -I https://wiw-ae-frontend.onrender.com
   ```
   - Devrait retourner `200 OK`
   - Si `404`, le service n'est pas déployé correctement

---

## 🔍 Checklist de vérification

- [ ] Le service `wiw-ae-frontend` existe sur Render
- [ ] Le statut est **"Live"** (pas Building/Failed)
- [ ] Le build a réussi (voir les logs)
- [ ] Le dossier `dist/` contient `index.html`
- [ ] La route SPA est configurée (`/*` → `/index.html`)
- [ ] Les variables d'environnement sont définies
- [ ] L'URL est correcte (pas de typo)
- [ ] Le service n'est pas suspendu (plan gratuit)

---

## 🚨 Solutions d'urgence

### Solution 1 : Supprimer et recréer le service

1. **Supprimer le service**
   - Render Dashboard > Service > Settings
   - Scroll jusqu'en bas
   - Cliquez sur **"Delete Service"**
   - Confirmez la suppression

2. **Recréer via Blueprint**
   - Suivez l'**Étape 2** ci-dessus

### Solution 2 : Vérifier le build local

```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
ls dist/
```

Si `dist/index.html` n'existe pas, il y a un problème avec le build.

### Solution 3 : Contacter le support Render

Si rien ne fonctionne :
1. Allez sur https://dashboard.render.com
2. Cliquez sur **"Support"** (en bas)
3. Décrivez le problème avec :
   - L'URL du service
   - Les logs de build
   - Les étapes déjà tentées

---

## 📞 Support

- **Documentation Render** : https://render.com/docs
- **Status Render** : https://status.render.com
- **Support Render** : support@render.com

---

**Dernière mise à jour** : Décembre 2024

