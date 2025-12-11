# WiW Frontend

Application frontend en **Vanilla JavaScript** (sans React).

## Quick start

```bash
npm install
npm run dev
```

Ouvrir http://localhost:5173

## Architecture

```
frontend/src/
├── core/                 # Système de base
│   ├── router.js         # Router SPA vanilla JS
│   ├── component.js      # Classe de base pour composants
│   ├── store.js          # Store réactif (pub/sub)
│   ├── api.js            # Client HTTP (fetch)
│   └── auth.js           # Service d'authentification
├── layouts/              # Layouts de page
│   ├── DashboardLayout.js
│   └── PublicLayout.js
├── pages-vanilla/        # Pages de l'application
│   ├── DashboardPage.js
│   ├── TendersPage.js
│   ├── HonorairesPage.js
│   ├── ReferencesPage.js
│   ├── TeamPage.js
│   └── ...
├── utils/                # Utilitaires
│   ├── storage.js        # Gestion localStorage
│   ├── formatNumber.js   # Formatage des nombres
│   └── export.js         # Export PDF/Excel
├── styles/               # CSS
├── app.js                # Configuration des routes
└── main.js               # Point d'entrée
```

## Technologies

- **Vanilla JavaScript** (ES6+)
- **Vite** - Build tool
- **Tailwind CSS** - Styles
- **jsPDF** - Export PDF
- **XLSX** - Export Excel

## Configuration

Variable d'environnement `VITE_API_URL` pour pointer vers le backend.
