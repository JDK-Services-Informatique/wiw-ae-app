# 🔧 Fix Frontend Vercel - Changer Branche de Déploiement

**Date** : 2025-12-03
**Problème** : Frontend déploie depuis `main` au lieu de la branche avec tous nos changements

---

## 🔴 Problème Identifié

**Branche actuelle du frontend Vercel** : `main` (commit `428a665`)
**Branche avec tous les changements** : `claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ` (commit `620203f`)

### Changements Manquants sur `main` :
- ❌ Page **Register.jsx** (inscription)
- ❌ Corrections **sécurité** (XSS, CSRF)
- ❌ Middleware CSRF
- ❌ Configuration CORS mise à jour
- ❌ Toute la documentation

---

## ✅ Solution : Changer la Branche de Production

### Étape 1 : Accéder aux Settings Git

1. **Ouvrez** : https://vercel.com/dashboard

2. **Cliquez** sur votre projet **frontend** (ex: `wiw-ae-app`)

3. Dans le menu en haut, **cliquez** sur **"Settings"** (⚙️)

4. Dans le menu latéral gauche, **cliquez** sur **"Git"**

---

### Étape 2 : Changer la Production Branch

Dans la section **"Production Branch"** :

**Actuellement** :
```
Production Branch: main
```

**Actions** :
1. **Cliquez** sur le champ ou le bouton "Edit"
2. **Sélectionnez** dans le dropdown : `claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ`
3. **Cliquez** "Save" ou "Update"

⚠️ **Si la branche n'apparaît pas dans le dropdown** :
- Tapez manuellement : `claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ`
- OU utilisez le nom court si Vercel le supporte

---

### Étape 3 : Ajouter la Variable d'Environnement

Avant de redéployer, ajoutons la variable `VITE_API_URL` :

1. Toujours dans **Settings**, cliquez sur **"Environment Variables"**

2. **Cliquez** "Add New" ou cherchez si `VITE_API_URL` existe déjà

3. **Configuration** :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://wiw-ae-backend-jq3is5xc8-suffix6805s-projects.vercel.app/api`
   - **Environment** : Cochez les 3 (Production, Preview, Development)

4. **Cliquez** "Save"

---

### Étape 4 : Redéployer

1. **Retournez** dans l'onglet **"Deployments"** (en haut)

2. **Méthode A - Redéploiement manuel** :
   - Trouvez le dernier déploiement
   - Cliquez sur **"⋯"** (trois points à droite)
   - Sélectionnez **"Redeploy"**
   - Confirmez

3. **OU Méthode B - Nouveau commit (déclenche auto-déploiement)** :
   - Faites un petit changement sur la branche
   - Push vers GitHub
   - Vercel détectera et déploiera automatiquement

---

### Étape 5 : Vérifier le Déploiement

Une fois le build terminé (2-3 minutes) :

1. **Vérifiez** que le déploiement utilise la bonne branche :
   - Dans "Deployments", vous devriez voir :
   ```
   Branch: claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ
   Commit: 620203f - fix: Supprimer vercel.json legacy causant crash serverless
   ```

2. **Vérifiez** les logs de build :
   - Cherchez des erreurs
   - Le build devrait réussir ✅

3. **Notez la nouvelle URL** du frontend (si changée)

---

## 🧪 Test Final

Une fois déployé :

### Test 1 : Vérifier que Register existe

Ouvrez dans votre navigateur :
```
https://votre-frontend.vercel.app/register
```

**Résultat attendu** :
- ✅ Page d'inscription s'affiche
- ✅ Formulaire avec nom, prénom, email, mot de passe
- ✅ Pas de 404

### Test 2 : Tester l'Inscription Complète

1. **Cliquez** "Créer un compte" depuis la landing page
2. **Remplissez** le formulaire :
   - Nom : `Test`
   - Prénom : `Utilisateur`
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Confirmation : `Test123456!`
3. **Validez**

**Résultat attendu** :
- ✅ Pas d'erreur CORS
- ✅ "Inscription réussie !"
- ✅ Redirection vers le dashboard
- ✅ Connexion automatique

### Test 3 : Vérifier les Logs (DevTools)

Ouvrez DevTools (F12) → Console :
- ✅ Pas d'erreur CORS rouge
- ✅ Requête vers `https://wiw-ae-backend-jq3is5xc8-suffix6805s-projects.vercel.app/api/auth/register` réussit
- ✅ Status 200 ou 201

---

## 📊 Comparaison Avant/Après

### Avant (Branche `main` - commit 428a665)
```bash
❌ Pas de page Register
❌ Ancienne configuration CORS
❌ Pas de corrections sécurité
❌ Build : React Router warnings
```

### Après (Branche `claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ` - commit 620203f)
```bash
✅ Page Register fonctionnelle
✅ Configuration CORS mise à jour
✅ Corrections sécurité (XSS, CSRF)
✅ Middleware CSRF
✅ React Router v7 future flags
✅ Documentation complète
```

---

## 🐛 Dépannage

### Erreur : "La branche n'existe pas"

→ Vérifiez que la branche est bien poussée sur GitHub :
```bash
git branch -a | grep claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ
```

Si elle n'apparaît pas :
```bash
git push -u origin claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ
```

### Erreur : "Build failed"

→ Consultez les logs dans Vercel :
- Onglet "Deployments"
- Cliquez sur le déploiement échoué
- Lisez les logs de build

Erreurs communes :
- Module manquant → `npm install` local et commit
- Syntax error → Vérifiez le code
- Environment variable manquante → Ajoutez dans Settings

### Erreur CORS Toujours Présente

→ Vérifiez que `VITE_API_URL` pointe vers le bon backend :
```
https://wiw-ae-backend-jq3is5xc8-suffix6805s-projects.vercel.app/api
```

⚠️ N'oubliez pas le `/api` à la fin !

---

## ✅ Checklist

- [ ] Accédé à Settings → Git
- [ ] Production Branch changée vers `claude/improve-project-stability-012Z7N2T9WTqbdmdHxGhAoRZ`
- [ ] Variable `VITE_API_URL` ajoutée
- [ ] Redéploiement déclenché
- [ ] Build réussi ✅
- [ ] Page `/register` accessible
- [ ] Inscription fonctionne sans erreur CORS
- [ ] Application 100% fonctionnelle

---

## 🎉 Résultat Final

Une fois toutes ces étapes complétées :

```
✅ Frontend déployé depuis la bonne branche
✅ Backend fonctionnel sur Vercel
✅ Base de données Neon connectée
✅ Variables d'environnement configurées
✅ Application complète opérationnelle
✅ Prête pour domaines personnalisés
```

**Prochaine étape** : Configurer les domaines personnalisés (`wiw-ae-plus.com`) ! 🌐

---

**Bon déploiement ! 🚀**
