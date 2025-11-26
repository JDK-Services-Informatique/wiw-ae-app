# Documentation des Nouvelles Fonctionnalités

## 📊 Graphiques Visuels avec Recharts

### Composant Charts.jsx
Le composant `Charts.jsx` fournit une collection de graphiques réutilisables pour visualiser les données.

#### Types de graphiques disponibles :
- **BarChart** : Graphique en barres pour comparer des valeurs
- **LineChart** : Graphique en ligne pour visualiser des tendances
- **PieChart** : Graphique en camembert pour les répartitions
- **AreaChart** : Graphique en aires pour les évolutions
- **ComboChart** : Graphique combiné (barres + lignes)

#### Utilisation :
```jsx
import Charts from '../components/Charts';

<Charts
  title="Évolution mensuelle"
  type="bar"
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Fév', value: 200 }
  ]}
  dataKey="value"
  xKey="label"
  height={300}
/>
```

### Intégration dans Dashboard
- Graphique en barres : Évolution mensuelle des projets (montant et nombre)
- Graphique en ligne : Tendance des montants
- Graphique en camembert : Répartition par domaine

### Intégration dans Pipeline
- Graphique en camembert : Répartition par étape du pipeline
- Graphique en barres : Nombre d'AO par étape
- Graphique en aires : Montant par statut

---

## ✅ Modal de Confirmation (ConfirmModal)

### Description
Composant modal réutilisable pour confirmer les actions critiques (suppression, réinitialisation, etc.).

### Utilisation :
```jsx
import ConfirmModal from '../components/ConfirmModal';

const [isOpen, setIsOpen] = useState(false);

<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleDelete}
  title="Supprimer l'élément"
  message="Êtes-vous sûr de vouloir supprimer cet élément ?"
  confirmText="Supprimer"
  cancelText="Annuler"
  variant="danger" // 'danger', 'warning', 'info'
/>
```

### Variantes :
- **danger** : Pour les actions destructives (rouge)
- **warning** : Pour les actions nécessitant attention (jaune)
- **info** : Pour les actions informatives (bleu)

### Intégrations :
- ✅ MediaLibrary : Suppression de médias
- ✅ Settings : Suppression de toutes les données / Réinitialisation de l'application

---

## ⌨️ Raccourcis Clavier Globaux

### Raccourcis disponibles :

| Raccourci | Action |
|-----------|--------|
| `Ctrl+K` (ou `Cmd+K`) | Recherche globale |
| `Ctrl+/` (ou `Cmd+/`) | Afficher l'aide des raccourcis |
| `Ctrl+S` (ou `Cmd+S`) | Sauvegarder (générique) |
| `Escape` | Fermer les modals ouverts |
| `Ctrl+1` | Naviguer vers Dashboard |
| `Ctrl+2` | Naviguer vers Tenders |
| `Ctrl+3` | Naviguer vers Analytics |
| `Ctrl+4` | Naviguer vers Pipeline |
| `Ctrl+9` | Naviguer vers Settings |

### Activation
Les raccourcis sont automatiquement activés dans `App.jsx` via le composant `GlobalShortcuts`.

### Note
Les raccourcis sont désactivés lorsque l'utilisateur tape dans un champ de saisie (input, textarea).

---

## 🔍 Hook useDebounce

### Description
Hook pour optimiser les recherches en retardant l'exécution jusqu'à ce que l'utilisateur ait arrêté de taper.

### Utilisation :
```jsx
import { useDebounce } from '../hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### Paramètres :
- `value` : La valeur à débouncer
- `delay` : Le délai en millisecondes (défaut: 500ms)

---

## 💾 Service de Backup/Restore

### Fonctionnalités disponibles :

#### Créer un backup
```jsx
import { createBackup } from '../services/backup.service';

const backup = await createBackup('Mon Backup');
```

#### Restaurer un backup
```jsx
import { restoreBackup } from '../services/backup.service';

const result = await restoreBackup(backupId, merge = false);
```

#### Lister les backups
```jsx
import { listBackups } from '../services/backup.service';

const backups = listBackups();
```

#### Exporter/Importer un backup
```jsx
import { exportBackupToFile, importBackupFromFile } from '../services/backup.service';

// Exporter
await exportBackupToFile(backupId, 'mon-backup.json');

// Importer
const input = document.createElement('input');
input.type = 'file';
input.onchange = async (e) => {
  const file = e.target.files[0];
  await importBackupFromFile(file);
};
```

#### Nettoyer les anciens backups
```jsx
import { cleanupOldBackups } from '../services/backup.service';

await cleanupOldBackups(10); // Garder les 10 plus récents
```

### Données sauvegardées :
- Projets
- Appels d'offres
- Devis
- Membres de l'équipe
- BET
- Missions conseil
- Références
- Catalogue d'articles
- Templates
- Company
- Settings

---

## 📈 Composant de Statistiques Avancées (AdvancedStats)

### Description
Composant pour afficher des statistiques détaillées avec graphiques et analyses.

### Utilisation :
```jsx
import AdvancedStats from '../components/AdvancedStats';

<AdvancedStats
  data={projets}
  type="projects" // 'projects', 'tenders', 'team', 'revenue'
  options={{
    period: 'year',
    showComparison: true,
    groupBy: 'month'
  }}
/>
```

### Types de statistiques :
- **projects** : Statistiques sur les projets
- **tenders** : Statistiques sur les appels d'offres
- **team** : Statistiques sur l'équipe
- **revenue** : Statistiques de revenus

### Graphiques inclus :
- Graphique en barres : Évolution temporelle
- Graphique en ligne : Tendance
- Graphique en camembert : Répartition par catégorie

---

## 🧪 Tests Unitaires

### Tests disponibles :

#### Charts.test.js
- Test du rendu des différents types de graphiques
- Test des props et configurations

#### ConfirmModal.test.js
- Test de l'affichage conditionnel
- Test des callbacks onConfirm et onClose
- Test des variantes (danger, warning, info)

#### useDebounce.test.js
- Test du délai de debounce
- Test de l'annulation du timer précédent
- Test de la mise à jour de la valeur

### Exécution des tests :
```bash
npm test
```

---

## 📝 Notes Importantes

### Performance
- Les graphiques Recharts sont optimisés pour de grandes quantités de données
- Le hook useDebounce réduit le nombre de requêtes API lors des recherches
- Les backups sont stockés dans localStorage (limite de ~5-10MB)

### Accessibilité
- Les modals sont accessibles au clavier (Escape pour fermer)
- Les graphiques incluent des tooltips et légendes
- Support du dark mode pour tous les composants

### Compatibilité
- Tous les composants sont compatibles avec React 18+
- Recharts nécessite une version récente de React
- Les raccourcis clavier fonctionnent sur Windows, Mac et Linux

---

## 🚀 Prochaines Améliorations

- [ ] Recherche globale avec Ctrl+K
- [ ] Export des graphiques en image
- [ ] Synchronisation cloud pour les backups
- [ ] Plus de types de graphiques (candlestick, radar, etc.)
- [ ] Personnalisation des couleurs des graphiques
- [ ] Raccourcis personnalisables par l'utilisateur

