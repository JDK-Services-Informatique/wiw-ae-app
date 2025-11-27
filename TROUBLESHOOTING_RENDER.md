# 🔧 Dépannage Render - Erreur 404

## ❌ Problème : `wiw-ae-frontend.onrender.com` introuvable (404)

### Causes possibles

1. **Service non déployé** : Le service n'a pas été créé sur Render
2. **Service supprimé** : Le service a été supprimé ou suspendu
3. **Déploiement en cours** : Le service est en cours de déploiement
4. **Déploiement échoué** : Le build a échoué
5. **Nom incorrect** : Le nom du service est différent

---

## ✅ Solutions

### Solution 1 : Vérifier le statut sur Render Dashboard

1. Allez sur https://dashboard.render.com
2. Connectez-vous à votre compte
3. Vérifiez si le service `wiw-ae-frontend` existe :
   - Si **OUI** : Vérifiez le statut (Live, Building, Failed)
   - Si **NON** : Passez à la Solution 2

### Solution 2 : Déployer via Blueprint (Recommandé)

Si le service n'existe pas, déployez-le via le Blueprint :

1. **Aller sur Render Dashboard**
   - https://dashboard.render.com
   - Cliquez sur **"New"** > **"Blueprint"**

2. **Connecter le repository GitHub**
   - Sélectionnez votre repository : `JDK-Services-Informatique/wiw-ae-app`
   - Branche : `main`

3. **Appliquer le Blueprint**
   - Render détectera automatiquement `render.yaml`
   - Cliquez sur **"Apply"**
   - Render créera automatiquement :
     - ✅ `wiw-ae-backend` (Web Service)
     - ✅ `wiw-ae-frontend` (Static Site)
     - ✅ `wiw-ae-db` (PostgreSQL Database)

4. **Attendre le déploiement**
   - Le frontend prend généralement **3-5 minutes**
   - Surveillez les logs dans le dashboard

### Solution 3 : Créer le service manuellement

Si le Blueprint ne fonctionne pas, créez le service manuellement :

#### Frontend (Static Site)

1. **"New"** > **"Static Site"**
2. **Connecter le repository** :
   - Repository : `JDK-Services-Informatique/wiw-ae-app`
   - Branch : `main`
3. **Configuration** :
   - **Name** : `wiw-ae-frontend`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
4. **Environment Variables** :
   ```
   VITE_API_URL=https://wiw-ae-backend.onrender.com
   ```
   ⚠️ **Important** : Remplacez par l'URL réelle du backend une fois déployé
5. **Routes (SPA Routing)** :
   - Cliquez sur **"Advanced"** > **"Redirects/Rewrites"**
   - Ajoutez :
     - Source : `/*`
     - Destination : `/index.html`
     - Type : **Rewrite**
6. **Cliquez sur "Create Static Site"**

### Solution 4 : Vérifier les logs de déploiement

Si le service existe mais affiche une erreur :

1. Allez dans le dashboard Render
2. Sélectionnez `wiw-ae-frontend`
3. Cliquez sur l'onglet **"Logs"**
4. Vérifiez les erreurs :
   - **Build failed** : Vérifiez les dépendances dans `package.json`
   - **Build timeout** : Le build prend trop de temps
   - **Missing files** : Vérifiez que `dist/` contient les fichiers

### Solution 5 : Vérifier la structure du projet

Assurez-vous que la structure est correcte :

```
wiw-ae-app/
├── render.yaml          ✅ Doit être à la racine
├── backend/
│   ├── package.json     ✅
│   └── ...
└── frontend/
    ├── package.json     ✅
    ├── vite.config.js   ✅
    └── ...
```

### Solution 6 : Vérifier le build local

Testez le build localement pour identifier les problèmes :

```bash
cd frontend
npm install
npm run build
```

Si le build échoue localement, corrigez les erreurs avant de redéployer.

---

## 🔍 Vérifications courantes

### 1. Le service est-il "Live" ?

Dans Render Dashboard :
- ✅ **Live** : Le service fonctionne
- 🟡 **Building** : En cours de déploiement (attendre)
- 🔴 **Failed** : Le déploiement a échoué (voir les logs)
- ⚪ **Suspended** : Suspendu (plan gratuit après inactivité)

### 2. L'URL est-elle correcte ?

Les URLs Render suivent le format :
- `https://[service-name].onrender.com`
- Vérifiez que le nom du service est exactement `wiw-ae-frontend`

### 3. Le service est-il suspendu (plan gratuit) ?

Les services gratuits sont suspendus après 15 minutes d'inactivité.

**Solution** :
- Attendre 30-60 secondes après la première requête
- Ou passer au plan Starter ($7/mois)

### 4. Les variables d'environnement sont-elles correctes ?

Vérifiez dans Render Dashboard > Service > Environment :
- `VITE_API_URL` doit pointer vers le backend
- Format : `https://wiw-ae-backend.onrender.com` (sans `/api`)

---

## 🚀 Redéploiement rapide

Si vous avez modifié le code :

1. **Push sur GitHub** :
   ```bash
   git add .
   git commit -m "fix: corrections"
   git push origin main
   ```

2. **Sur Render Dashboard** :
   - Allez dans le service `wiw-ae-frontend`
   - Cliquez sur **"Manual Deploy"** > **"Deploy latest commit"**

---

## 📞 Support Render

Si le problème persiste :

1. **Documentation Render** : https://render.com/docs
2. **Status Page** : https://status.render.com
3. **Support** : support@render.com

---

## ✅ Checklist de déploiement

- [ ] Repository GitHub connecté à Render
- [ ] Fichier `render.yaml` présent à la racine
- [ ] Structure du projet correcte (`frontend/`, `backend/`)
- [ ] Service `wiw-ae-frontend` créé sur Render
- [ ] Statut du service : **Live** (pas Building/Failed)
- [ ] Variables d'environnement configurées
- [ ] Routes SPA configurées (`/*` → `/index.html`)
- [ ] Build réussi (voir les logs)
- [ ] URL accessible : `https://wiw-ae-frontend.onrender.com`

---

**Dernière mise à jour** : Décembre 2024


