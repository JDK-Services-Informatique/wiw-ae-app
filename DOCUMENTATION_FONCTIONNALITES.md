# Documentation des Nouvelles Fonctionnalités

## Table des matières
1. [Pipeline AO - Statistiques (KPI-01)](#pipeline-ao)
2. [Moteur Scénarios Honoraires (HON-01)](#scenarios-honoraires)
3. [Export Excel/PDF (EXP-01)](#export-excel-pdf)
4. [Authentification à Deux Facteurs (2FA)](#authentification-2fa)
5. [Gestion des Rôles Utilisateurs](#roles-utilisateurs)

---

## Pipeline AO - Statistiques (KPI-01) {#pipeline-ao}

### Description
Le composant **AOPipelineStats** affiche une vue d'ensemble complète des appels d'offres (AO) avec des statistiques par statut.

### Fonctionnalités
- **Statistiques par statut** :
  - Nouveaux (bleu)
  - En cours (orange)
  - Gagnés (vert)
  - Perdus (rouge)

- **Indicateurs de performance** :
  - Taux de réussite (pourcentage de AO gagnés vs perdus)
  - Montant total de tous les AO
  - Montant gagné (somme des AO gagnés)
  - Moyenne par AO gagné

- **Visualisation** :
  - Graphique de répartition par statut
  - Barres de progression pour chaque statut
  - Cartes colorées avec icônes

### Utilisation
Le composant est automatiquement intégré dans la page **Tenders** (Appels d'offres). Il s'affiche en haut de la page et se met à jour automatiquement selon les données des AO.

### Exemple de données
```javascript
{
  nouveaux: { count: 5, montant: 500000 },
  enCours: { count: 3, montant: 300000 },
  gagnes: { count: 10, montant: 2000000 },
  perdus: { count: 2, montant: 200000 },
  tauxReussite: 83.3
}
```

---

## Moteur Scénarios Honoraires (HON-01) {#scenarios-honoraires}

### Description
Le composant **ScenariosHonoraires** permet de gérer plusieurs scénarios d'honoraires (Base, Évolution 1, Évolution 2) et de comparer différentes configurations.

### Fonctionnalités
- **Gestion de scénarios** :
  - Création de nouveaux scénarios
  - Duplication de scénarios existants
  - Suppression de scénarios (sauf Base)
  - Sélection et activation de scénarios

- **Scénarios par défaut** :
  - **Base** : Scénario de référence avec pourcentages standards
  - **Évolution 1** : Première variante
  - **Évolution 2** : Deuxième variante

- **Actions disponibles** :
  - Sauvegarder un scénario
  - Exporter en Excel
  - Exporter en PDF
  - Modifier les pourcentages en temps réel

### Utilisation
1. Accédez à la page **Honoraires**
2. Sélectionnez l'onglet **"Scénarios (Base, Évolution 1, Évolution 2)"**
3. Choisissez un scénario dans les cartes en haut
4. Modifiez les pourcentages dans le tableau
5. Exportez ou sauvegardez le scénario

### Intégration dans Honoraires.jsx
Le composant est intégré comme premier onglet dans la page Honoraires, avant "Évolution des %" et "Ventilation Mission/Partenaire".

---

## Export Excel/PDF (EXP-01) {#export-excel-pdf}

### Description
Système d'export complet pour les missions et honoraires en formats Excel et PDF.

### Fonctionnalités

#### Export Honoraires
- **Format Excel** : Tableau avec évolutions, missions, partenaires
- **Format PDF** : Document professionnel avec mise en page

**Données exportées** :
- Montant des travaux HT
- Évolutions des pourcentages (Base, Évolution 1, Évolution 2)
- Missions avec pourcentages et montants
- Partenaires avec coûts horaires et heures estimées
- Totaux et calculs

#### Export Missions
- **Format Excel** : Liste complète des missions avec détails
- **Format PDF** : Document détaillé par mission

**Données exportées** :
- Informations générales (numéro, date, type, statut)
- Informations client et MOA
- Coûts et montants
- Équipe et partenaires
- Description et notes

### Utilisation

#### Dans Honoraires.jsx
1. Cliquez sur **"Exporter Excel"** ou **"Exporter PDF"** dans l'en-tête
2. Le fichier se télécharge automatiquement

#### Dans MissionsConseil.jsx
1. Ouvrez une mission
2. Cliquez sur **"Exporter Excel"** ou **"Exporter PDF"** dans les actions
3. Le fichier se télécharge avec le nom : `Mission_[NUMERO]_[CLIENT].xlsx/pdf`

#### Dans ScenariosHonoraires
1. Sélectionnez un scénario
2. Cliquez sur **"Excel"** ou **"PDF"** dans les actions du scénario
3. Le fichier se télécharge avec le nom : `Scenario_[NOM]_[DATE].xlsx/pdf`

### Fichiers générés
- **Excel** : Format TSV (Tab-Separated Values) compatible avec Excel
- **PDF** : Document formaté avec en-tête WIW Dev+, tableaux et pied de page

---

## Authentification à Deux Facteurs (2FA) {#authentification-2fa}

### Description
Système d'authentification renforcée pour sécuriser les comptes utilisateurs.

### Fonctionnalités
- **Activation 2FA** :
  1. Cliquez sur "Activer l'authentification à deux facteurs"
  2. Scannez le QR code avec une application d'authentification (Google Authenticator, Authy, Microsoft Authenticator)
  3. Entrez le code à 6 chiffres généré
  4. Recevez les codes de secours

- **Codes de secours** :
  - 10 codes générés lors de l'activation
  - Utilisables une seule fois
  - Téléchargeables en fichier texte
  - À conserver en lieu sûr

- **Désactivation** :
  - Possible depuis les paramètres
  - Confirmation requise
  - Avertissement de sécurité affiché

### Utilisation
1. Accédez à **Paramètres** > **Sécurité**
2. Dans la section **"Authentification à deux facteurs (2FA)"** :
   - Cliquez sur **"Activer l'authentification à deux facteurs"**
   - Suivez les étapes d'activation
   - Conservez les codes de secours

### Applications compatibles
- Google Authenticator
- Authy
- Microsoft Authenticator
- Toute application TOTP standard

### Sécurité
- Le secret 2FA est stocké de manière sécurisée
- Les codes de secours sont chiffrés
- La désactivation nécessite une confirmation

---

## Gestion des Rôles Utilisateurs {#roles-utilisateurs}

### Description
Système de rôles et permissions pour contrôler l'accès aux fonctionnalités.

### Rôles disponibles

#### ADMIN
- **Accès** : Complet à toutes les fonctionnalités
- **Permissions** :
  - Gestion des utilisateurs
  - Configuration de l'application
  - Accès à toutes les données
  - Export de toutes les données
  - Gestion des listes déroulantes
  - Gestion des sponsors

#### CHEF_PROJET
- **Accès** : Gestion de projets, vision financière limitée
- **Permissions** :
  - Création et modification de projets
  - Gestion des appels d'offres
  - Vision des montants (sans détails des marges)
  - Export de ses propres projets
  - Pas d'accès aux paramètres système

#### ASSISTANT
- **Accès** : Lecture seule, pas de vision des taux horaires
- **Permissions** :
  - Consultation des projets
  - Lecture des missions
  - Pas de vision des coûts horaires
  - Pas de vision des marges
  - Pas de modification de données
  - Pas d'export

#### USER
- **Accès** : Utilisateur standard
- **Permissions** :
  - Création de projets personnels
  - Gestion de ses propres données
  - Export de ses propres données
  - Pas d'accès aux fonctionnalités avancées

### Configuration dans la base de données

#### Seed initial
Le fichier `backend/prisma/seed.js` crée automatiquement des utilisateurs de test avec différents rôles :

```javascript
// Admin
email: 'admin@wiw.fr'
role: 'ADMIN'
plan: 'ENTREPRISE'

// Chef de projet
email: 'chef.projet@wiw.fr'
role: 'CHEF_PROJET'
plan: 'PREMIUM'

// Assistant
email: 'assistant@wiw.fr'
role: 'ASSISTANT'
plan: 'GRATUIT'

// User standard
email: 'user@wiw.fr'
role: 'USER'
plan: 'GRATUIT'
```

Tous les comptes utilisent le mot de passe : `test1234`

#### Schéma Prisma
Le champ `role` dans le modèle `Utilisateur` :
```prisma
role String @default("USER")
```

Valeurs possibles : `ADMIN`, `CHEF_PROJET`, `ASSISTANT`, `USER`

### Middleware d'autorisation
Le middleware `authorization.middleware.js` vérifie les rôles avant d'autoriser l'accès aux routes :

```javascript
// Exemple : Route réservée aux admins
router.get('/admin/users', authorize('ADMIN'), getUsers);

// Exemple : Route pour chefs de projet et admins
router.get('/projects', authorize('ADMIN', 'CHEF_PROJET'), getProjects);
```

### Exécution du seed
```bash
cd backend
npx prisma db seed
```

---

## Tests Unitaires

### Structure des tests
Les tests sont organisés dans `frontend/src/components/__tests__/` et `frontend/src/utils/__tests__/`.

### Tests disponibles

#### AOPipelineStats.test.js
- Test d'affichage des statistiques
- Test de calcul des statistiques par statut
- Test du taux de réussite
- Test avec aucun AO

#### TwoFactorSettings.test.js
- Test d'affichage avec 2FA désactivé
- Test d'affichage avec 2FA activé
- Test des boutons d'activation/désactivation

#### exportHonoraires.test.js
- Test d'export Excel honoraires
- Test d'export PDF honoraires
- Test d'export Excel missions
- Test d'export PDF missions

### Exécution des tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

### Configuration
Les tests utilisent **Vitest** comme framework de test. La configuration se trouve dans `frontend/vitest.config.js` et `backend/vitest.config.js`.

---

## Support et Assistance

Pour toute question ou problème :
1. Consultez cette documentation
2. Vérifiez les logs de l'application
3. Contactez l'équipe de développement

---

**Version** : 1.0.0  
**Date** : Décembre 2024  
**Auteur** : Équipe WIW Dev+

