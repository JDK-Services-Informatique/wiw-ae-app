# Instructions pour pousser sur GitHub et déployer sur Render

## 📤 Étape 1 : Créer un repository GitHub

1. Allez sur https://github.com
2. Cliquez sur le bouton **"+"** en haut à droite > **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `wiw-ae-app` (ou le nom de votre choix)
   - **Description** : "Application WIW-AE+ - Gestion pour architectes et BET"
   - **Visibilité** : Public ou Private (selon vos préférences)
   - **NE PAS** cocher "Initialize with README" (nous avons déjà un README)
4. Cliquez sur **"Create repository"**

## 🔗 Étape 2 : Connecter le repository local à GitHub

Après avoir créé le repository, GitHub vous donnera une URL. Utilisez-la dans la commande suivante :

```bash
# Remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub
# Si vous n'avez pas encore de remote nommé "origin" :
git remote add origin https://github.com/Suffix6805/JDK-Services-Informatique/wiw-ae-app.git

# Si le remote "origin" existe déjà et que vous souhaitez le modifier :
git remote set-url origin https://github.com/Suffix6805/JDK-Services-Informatique/wiw-ae-app.git

# Pour vérifier vos remotes :
git remote -v

# Ou si vous utilisez SSH :
# git remote add origin git@github.com:Suffix6805/wiw-ae-app.git
```

## 🚀 Étape 3 : Pousser le code sur GitHub

```bash
# Pousser la branche main sur GitHub
git push -u origin main
```

Si c'est la première fois, GitHub vous demandera de vous authentifier.

## 🌐 Étape 4 : Déployer sur Render via Blueprint

1. Allez sur https://dashboard.render.com
2. Connectez-vous ou créez un compte
3. Cliquez sur **"New"** > **"Blueprint"**
4. Connectez votre compte GitHub si ce n'est pas déjà fait
5. Sélectionnez le repository `wiw-ae-app`
6. Render détectera automatiquement le fichier `render.yaml`
7. Vérifiez la configuration :
   - **Backend** : Service web Node.js
   - **Frontend** : Site statique
   - **Database** : PostgreSQL
8. Cliquez sur **"Apply"**

## ⏱️ Étape 5 : Attendre le déploiement

Render va :
1. Créer la base de données PostgreSQL
2. Déployer le backend (API)
3. Déployer le frontend (site statique)
4. Configurer automatiquement les variables d'environnement

Le processus prend généralement **5-10 minutes**.

## ✅ Vérification

Une fois le déploiement terminé :
- Les URLs seront disponibles dans le dashboard Render
- Le frontend sera accessible publiquement
- Le backend sera connecté à la base de données
- Les variables d'environnement seront configurées automatiquement

## 🔧 Configuration supplémentaire (optionnel)

Si vous avez besoin de variables d'environnement supplémentaires :
1. Allez dans le dashboard Render
2. Sélectionnez le service concerné
3. Allez dans **"Environment"**
4. Ajoutez les variables nécessaires

## 📝 Notes importantes

- Le fichier `render.yaml` configure automatiquement :
  - La connexion entre frontend et backend
  - La base de données PostgreSQL
  - Les variables d'environnement nécessaires
  - Les routes SPA pour le frontend React

- Les services Render Starter sont gratuits pendant la période d'essai, puis payants ($7/mois par service)

