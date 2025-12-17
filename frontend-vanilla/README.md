# WiW AE+ - Frontend Vanilla

Application de gestion pour architectes et économistes de la construction.
Version HTML5 / CSS3 / JavaScript ES6+ (sans framework).

## Structure du projet

```
frontend-vanilla/
├── index.html              # Point d'entrée HTML
├── manifest.json           # PWA manifest
├── package.json            # Configuration npm
├── css/
│   ├── variables.css       # Variables CSS (couleurs, espacements, etc.)
│   ├── main.css            # Styles globaux et reset
│   ├── components.css      # Styles des composants UI
│   ├── pages.css           # Styles spécifiques aux pages
│   └── utilities.css       # Classes utilitaires
├── js/
│   ├── app.js              # Point d'entrée JavaScript
│   ├── router.js           # Système de routing SPA
│   ├── store.js            # Gestion d'état global
│   ├── api/
│   │   ├── client.js       # Client HTTP (fetch)
│   │   ├── auth.js         # Service d'authentification
│   │   └── index.js        # Export des services API
│   ├── components/
│   │   ├── base.js         # Classe de base Component
│   │   ├── layout.js       # Layout principal
│   │   ├── icons.js        # Icônes SVG
│   │   └── ui/             # Composants UI (toast, modal, etc.)
│   ├── pages/
│   │   ├── login.js        # Page de connexion
│   │   ├── dashboard.js    # Tableau de bord
│   │   ├── tenders.js      # Appels d'offres
│   │   └── ...             # Autres pages
│   ├── utils/
│   │   ├── dom.js          # Utilitaires DOM
│   │   ├── format.js       # Formatage (dates, nombres)
│   │   └── storage.js      # LocalStorage helpers
│   └── i18n/
│       ├── index.js        # Système i18n
│       ├── fr.js           # Traductions françaises
│       └── en.js           # Traductions anglaises
└── assets/
    ├── icons/              # Icônes
    └── images/             # Images
```

## Démarrage

### Prérequis

- Node.js 18+
- Backend WiW (Express) en cours d'exécution sur `localhost:4000`

### Installation

```bash
cd frontend-vanilla
npm install
```

### Lancer en développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

### Configuration

Modifiez `APP_CONFIG` dans `js/app.js` pour changer l'URL de l'API :

```javascript
const APP_CONFIG = {
    API_URL: 'http://localhost:4000/api'
};
```

## Architecture

### Router

Système de routing SPA basé sur l'History API :

```javascript
import { router } from './router.js';

router.route('/ma-page', {
    render: () => '<h1>Ma Page</h1>'
});
```

### Store

Gestion d'état réactive avec Proxy :

```javascript
import { store } from './store.js';

store.set('user', { name: 'John' });
store.subscribe('user', (user) => console.log(user));
```

### Composants

Classe de base pour créer des composants réutilisables :

```javascript
import { Component } from './components/base.js';

class MonComposant extends Component {
    render() {
        return '<div>Mon composant</div>';
    }

    onMount() {
        // Code après montage
    }
}
```

### API

Client HTTP avec intercepteurs :

```javascript
import { api } from './api/client.js';

const data = await api.get('/endpoint');
await api.post('/endpoint', { data });
```

### i18n

Système d'internationalisation :

```javascript
import { t, i18n } from './i18n/index.js';

console.log(t('common.save')); // "Enregistrer"
i18n.setLocale('en');
```

## Fonctionnalités

- ✅ Routing SPA (History API)
- ✅ Gestion d'état réactive
- ✅ Authentification JWT
- ✅ Dark mode
- ✅ Internationalisation (FR/EN)
- ✅ Composants réutilisables
- ✅ Toast notifications
- ✅ Modals
- ✅ Responsive design

## Compatibilité navigateurs

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
