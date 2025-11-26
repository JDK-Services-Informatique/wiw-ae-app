# Documentation des Fonctionnalités Avancées

## 📋 Table des matières

1. [Tests Unitaires](#tests-unitaires)
2. [Internationalisation (i18n)](#internationalisation-i18n)
3. [PWA (Progressive Web App)](#pwa-progressive-web-app)
4. [Analytics](#analytics)
5. [CI/CD](#cicd)

---

## 🧪 Tests Unitaires

### Configuration

Les tests utilisent **Vitest** avec React Testing Library. La configuration se trouve dans `frontend/vitest.config.js`.

### Tests disponibles

#### Composants critiques testés

1. **RoleGuard.test.js**
   - Vérifie l'accès basé sur les rôles
   - Teste la redirection pour les utilisateurs non autorisés
   - Gère les cas avec utilisateur null

2. **FinancialProtection.test.js**
   - Teste la protection des données financières selon les rôles
   - Vérifie les permissions ADMIN, CHEF_PROJET, ASSISTANT, USER
   - Teste le hook `useFinancialAccess`

3. **Table.test.js**
   - Teste l'affichage des colonnes et données
   - Gère les cas avec données vides
   - Vérifie le rendu correct des tableaux

### Exécution des tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec couverture
npm test -- --coverage

# Tests E2E
npm run test:e2e
```

---

## 🌍 Internationalisation (i18n)

### Configuration

L'application utilise **react-i18next** pour la gestion multilingue. Les fichiers de traduction se trouvent dans `frontend/src/i18n/locales/`.

### Langues supportées

- **Français (fr)** : Langue par défaut
- **Anglais (en)** : Langue secondaire

### Utilisation

#### Dans un composant

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

#### Changer de langue

Utilisez le composant `LanguageSwitcher` dans la sidebar ou créez votre propre sélecteur :

```jsx
import { useTranslation } from 'react-i18next';

function MyLanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );
}
```

### Ajouter une nouvelle langue

1. Créer un nouveau fichier dans `frontend/src/i18n/locales/` (ex: `es.json`)
2. Ajouter la langue dans `frontend/src/i18n/config.js`
3. Ajouter l'option dans le `LanguageSwitcher`

---

## 📱 PWA (Progressive Web App)

### Fonctionnalités

L'application est configurée comme une PWA avec :

- **Service Worker** : Cache des ressources pour le mode offline
- **Manifest** : Configuration pour l'installation sur appareils
- **Mode offline** : Fonctionnement basique sans connexion

### Service Worker

Le Service Worker (`public/sw.js`) implémente une stratégie **Network First** :

1. Tente d'abord de charger depuis le réseau
2. Si échec, utilise le cache
3. Si pas de cache, retourne la page d'accueil

### Installation

Les utilisateurs peuvent installer l'application sur leur appareil :

- **Desktop** : Icône dans la barre d'adresse du navigateur
- **Mobile** : Invitation d'installation automatique

### Configuration

Le fichier `public/manifest.json` contient :
- Nom et description de l'application
- Icônes pour différents appareils
- Couleurs de thème
- Raccourcis vers les pages principales

---

## 📊 Analytics

### Services supportés

L'application intègre deux services d'analytics :

1. **Plausible** : Analytics respectueux de la vie privée
2. **Mixpanel** : Analytics avancé avec suivi utilisateur

### Configuration

Créez un fichier `.env` dans `frontend/` :

```env
VITE_PLAUSIBLE_ENABLED=true
VITE_PLAUSIBLE_DOMAIN=wiw.app

VITE_MIXPANEL_ENABLED=true
VITE_MIXPANEL_TOKEN=votre_token_mixpanel
```

### Utilisation

#### Track un événement

```jsx
import { track, AnalyticsEvents } from '../services/analytics';

// Événement simple
track(AnalyticsEvents.LOGIN, {
  userId: user.id,
  email: user.email
});

// Événement personnalisé
track('custom_event', {
  action: 'button_click',
  page: 'dashboard'
});
```

#### Événements prédéfinis

- `AnalyticsEvents.LOGIN` : Connexion utilisateur
- `AnalyticsEvents.LOGOUT` : Déconnexion
- `AnalyticsEvents.PAGE_VIEW` : Vue de page
- `AnalyticsEvents.EXPORT_DATA` : Export de données
- `AnalyticsEvents.CREATE_ITEM` : Création d'élément
- `AnalyticsEvents.UPDATE_ITEM` : Mise à jour
- `AnalyticsEvents.DELETE_ITEM` : Suppression

#### Identifier un utilisateur (Mixpanel uniquement)

```jsx
import { identify } from '../services/analytics';

identify(user.id, {
  email: user.email,
  role: user.role,
  plan: user.plan
});
```

### Tracking automatique

L'application track automatiquement :
- Les changements de page (via `AnalyticsTracker`)
- Les connexions/déconnexions
- Les erreurs API

---

## 🚀 CI/CD

### GitHub Actions

Le workflow CI/CD se trouve dans `.github/workflows/ci-cd.yml`.

### Étapes du pipeline

1. **Tests Frontend**
   - Installation des dépendances
   - Exécution des tests unitaires
   - Exécution des tests E2E (optionnel)

2. **Tests Backend**
   - Installation des dépendances
   - Exécution des tests backend

3. **Build Frontend**
   - Build de l'application avec Vite
   - Upload des artifacts

4. **Build Backend**
   - Build de l'application backend

5. **Déploiement** (uniquement sur `main`)
   - Déclenchement du déploiement sur Render
   - Notification de succès

### Déclenchement

Le pipeline se déclenche automatiquement sur :
- Push sur `main` ou `develop`
- Pull Request vers `main` ou `develop`

### Secrets GitHub

Configurez les secrets suivants dans GitHub :

- `VITE_API_URL` : URL de l'API backend
- `VITE_PLAUSIBLE_ENABLED` : Activer Plausible (true/false)
- `VITE_MIXPANEL_ENABLED` : Activer Mixpanel (true/false)
- `VITE_MIXPANEL_TOKEN` : Token Mixpanel

### Déploiement manuel

Pour déployer manuellement :

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

---

## 📝 Notes importantes

### Performance

- Les tests sont exécutés en parallèle quand possible
- Le Service Worker cache uniquement les ressources statiques
- Les analytics sont chargés de manière asynchrone

### Sécurité

- Les tokens d'analytics ne doivent jamais être commités
- Utilisez les secrets GitHub pour les variables sensibles
- Le Service Worker ignore les requêtes API pour éviter le cache

### Compatibilité

- PWA : Compatible avec Chrome, Edge, Safari (iOS 11.3+)
- i18n : Tous les navigateurs modernes
- Analytics : Compatible avec tous les navigateurs

---

**Version** : 1.0.0  
**Date** : Décembre 2024  
**Auteur** : Équipe WIW Dev+

