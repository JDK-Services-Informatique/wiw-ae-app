# 🎨 Prototype HTML/CSS/JS - WIW AE+

Version prototype de l'application WIW AE+ en HTML/CSS/JavaScript pur pour tests et itérations rapides.

## 📁 Structure

```
prototype/
├── index.html          # Page principale avec navigation
├── styles/
│   └── main.css        # Styles globaux et thème
├── js/
│   ├── app.js          # Application principale (thème, navigation)
│   ├── router.js       # Router SPA simple
│   └── pages/
│       ├── dashboard.js
│       ├── honoraires.js
│       ├── tenders.js
│       ├── team.js
│       ├── company.js
│       ├── devis.js
│       ├── analytics.js
│       ├── references.js
│       └── settings.js
└── README.md
```

## 🚀 Utilisation

### Démarrage local

1. **Ouvrir le fichier**
   ```bash
   # Ouvrir directement dans le navigateur
   open prototype/index.html
   # ou
   start prototype/index.html
   ```

2. **Avec un serveur local (recommandé)**
   ```bash
   # Python
   cd prototype
   python -m http.server 8000
   
   # Node.js (avec http-server)
   npx http-server prototype -p 8000
   
   # PHP
   cd prototype
   php -S localhost:8000
   ```

3. **Accéder à l'application**
   - Ouvrir http://localhost:8000 dans votre navigateur

## ✨ Fonctionnalités

### Pages disponibles

- ✅ **Dashboard** : Statistiques et vue d'ensemble
- ✅ **Honoraires** : Gestion des scénarios d'honoraires
- ✅ **Appels d'Offres** : Liste et statistiques des AO
- ✅ **Équipe** : Gestion des membres de l'équipe
- ✅ **Clients** : Liste des clients/maîtres d'ouvrage
- ✅ **Devis** : Gestion des devis
- ✅ **Analytics** : Statistiques et graphiques
- ✅ **Références** : Catalogue de références
- ✅ **Paramètres** : Configuration et export/import

### Fonctionnalités implémentées

- ✅ Navigation SPA (Single Page Application)
- ✅ Thème dark/light avec persistance
- ✅ Responsive design (mobile/desktop)
- ✅ Intégration localStorage pour les données
- ✅ Formatage des montants (EUR)
- ✅ Formatage des dates (FR)
- ✅ Badges de statut colorés
- ✅ Export/Import des données

### Fonctionnalités à implémenter

- ⏳ Formulaires de création/édition
- ⏳ Modals de confirmation
- ⏳ Graphiques (Chart.js)
- ⏳ Recherche et filtres
- ⏳ Pagination
- ⏳ Validation des formulaires
- ⏳ Notifications toast

## 🎨 Personnalisation

### Modifier les styles

Éditez `styles/main.css` pour personnaliser :
- Couleurs (variables CSS)
- Espacements
- Typographie
- Composants

### Ajouter une page

1. Créer `js/pages/ma-page.js`
2. Ajouter le handler :
   ```javascript
   window.pageHandlers = window.pageHandlers || {};
   window.pageHandlers.maPage = function() {
       return '<div>Contenu de la page</div>';
   };
   ```
3. Ajouter le lien dans `index.html` :
   ```html
   <li><a href="#ma-page" class="nav-link" data-page="ma-page">
       <span class="icon">📄</span> Ma Page
   </a></li>
   ```

## 📊 Données

Les données sont stockées dans `localStorage` avec les clés :
- `wiw-projets` : Liste des projets
- `wiw-tenders` : Liste des appels d'offres
- `wiw-devis` : Liste des devis
- `wiw-team-members` : Membres de l'équipe
- `wiw-companies` : Clients/maîtres d'ouvrage
- `wiw-honoraires` : Scénarios d'honoraires
- `wiw-references` : Références

### Format des données

```javascript
// Exemple de projet
{
    id: '1',
    nom: 'Projet exemple',
    domaine: 'Logements',
    type: 'Logements collectifs',
    montantHT: 50000,
    dateCreation: '2024-01-15',
    statut: 'Actif'
}

// Exemple d'AO
{
    id: '1',
    intitule: 'AO exemple',
    maitreOuvrage: 'Ville de Paris',
    montant: 100000,
    dateLimite: '2024-12-31',
    statut: 'En cours'
}
```

## 🔄 Migration vers React

Ce prototype peut servir de base pour :
1. **Tester les fonctionnalités** avant implémentation React
2. **Valider le design** et l'UX
3. **Itérer rapidement** sans rebuild
4. **Documenter les besoins** avec des exemples concrets

### Correspondance avec React

| Prototype | React |
|-----------|-------|
| `js/pages/*.js` | `src/pages/*.jsx` |
| `styles/main.css` | `src/styles/index.css` |
| `localStorage` | `hooks/useLocalStorage.js` |
| Navigation hash | `react-router-dom` |

## 🐛 Débogage

### Console du navigateur

Ouvrez la console (F12) pour :
- Voir les erreurs JavaScript
- Tester les fonctions
- Inspecter localStorage

### Vérifier les données

```javascript
// Dans la console du navigateur
console.log(JSON.parse(localStorage.getItem('wiw-projets')));
```

## 📝 Notes

- Ce prototype est une **version simplifiée** pour tests
- Les fonctionnalités avancées (graphiques, exports) sont à implémenter
- Le design est basé sur l'application React mais simplifié
- Compatible avec tous les navigateurs modernes

## 🚀 Prochaines étapes

1. Tester les fonctionnalités existantes
2. Ajouter les formulaires manquants
3. Implémenter les graphiques
4. Améliorer l'UX basée sur les retours
5. Migrer les améliorations vers React

---

**Version** : 1.0.0  
**Date** : Décembre 2024

