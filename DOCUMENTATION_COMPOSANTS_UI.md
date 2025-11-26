# Documentation des Composants UI Professionnels

## 🎨 Système de Thèmes

### ThemeProvider
Le `ThemeProvider` gère le thème de l'application de manière centralisée.

#### Utilisation :
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
    </button>
  );
}
```

#### Modes disponibles :
- `'dark'` : Mode sombre
- `'light'` : Mode clair
- `'auto'` : Mode automatique (suit les préférences système)

---

## 🧩 Composants UI

### Skeleton
Composant pour afficher des états de chargement.

```jsx
import { Skeleton } from '../components/ui';

// Rectangulaire
<Skeleton width="100%" height="20px" />

// Circulaire (avatar)
<Skeleton variant="circular" width="40px" height="40px" />

// Texte (plusieurs lignes)
<Skeleton variant="text" lines={3} />
```

### EmptyState
Composant pour afficher des états vides.

```jsx
import { EmptyState, EmptySearch, EmptyList, EmptyError } from '../components/ui';

// État vide personnalisé
<EmptyState
  icon={Inbox}
  title="Aucun projet"
  description="Commencez par créer votre premier projet."
  action={<button onClick={handleCreate}>Créer un projet</button>}
/>

// Variantes prédéfinies
<EmptySearch onClear={() => setSearch('')} />
<EmptyList onCreate={handleCreate} />
<EmptyError onRetry={handleRetry} />
```

### Breadcrumbs
Navigation hiérarchique automatique ou manuelle.

```jsx
import { Breadcrumbs } from '../components/ui';

// Automatique depuis l'URL
<Breadcrumbs />

// Manuel
<Breadcrumbs
  items={[
    { label: 'Accueil', href: '/dashboard', icon: Home },
    { label: 'Projets', href: '/projects' },
    { label: 'Détails', isLast: true }
  ]}
/>
```

### Pagination
Composant de pagination pour les listes.

```jsx
import { Pagination } from '../components/ui';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  showFirstLast={true}
  showPrevNext={true}
  maxVisible={5}
/>
```

### StatusBadge
Badge de statut avec couleurs et icônes automatiques.

```jsx
import { StatusBadge } from '../components/ui';

<StatusBadge status="En cours" />
<StatusBadge status="Gagné" variant="success" />
<StatusBadge status="Perdu" variant="error" size="sm" />
```

### Avatar
Composant avatar avec support des images, initiales et statut.

```jsx
import { Avatar } from '../components/ui';

// Avec image
<Avatar src="/avatar.jpg" alt="John Doe" name="John Doe" />

// Avec initiales
<Avatar name="John Doe" size="lg" />

// Avec statut
<Avatar name="John Doe" status="online" />
```

---

## 🎯 Provider Global (AppProvider)

Le `AppProvider` combine tous les contextes de l'application.

### Utilisation :
```jsx
import AppProvider from './providers/AppProvider';

function App() {
  return (
    <AppProvider>
      {/* Votre application */}
    </AppProvider>
  );
}
```

### Contextes inclus :
- `ThemeProvider` : Gestion du thème
- `PlanProvider` : Gestion des plans et fonctionnalités

---

## 🎓 Système de Tour Guidé / Onboarding

### OnboardingTour
Composant pour créer des tours guidés interactifs.

#### Utilisation basique :
```jsx
import OnboardingTour from '../components/OnboardingTour';
import { defaultOnboardingSteps } from '../components/OnboardingSteps';

<OnboardingTour
  steps={defaultOnboardingSteps}
  storageKey="onboarding-completed"
  startOnMount={true}
  onComplete={() => console.log('Tour terminé')}
  onSkip={() => console.log('Tour ignoré')}
/>
```

#### Définir des étapes :
```jsx
const steps = [
  {
    target: '#mon-element', // Sélecteur CSS ou élément DOM
    title: 'Titre de l\'étape',
    content: 'Description de l\'étape',
    component: <CustomComponent /> // Optionnel
  }
];
```

#### Utilisation avec hook :
```jsx
import { useOnboardingTour } from '../components/OnboardingTour';

const { isActive, startTour, stopTour, TourComponent } = useOnboardingTour(steps);

return (
  <>
    <button onClick={startTour}>Démarrer le tour</button>
    {TourComponent}
  </>
);
```

#### Étapes prédéfinies :
- `defaultOnboardingSteps` : Pour le Dashboard
- `tendersOnboardingSteps` : Pour la page Tenders
- `honorairesOnboardingSteps` : Pour la page Honoraires

---

## 🎨 Amélioration des Styles Globaux

### Classes utilitaires ajoutées :

#### Cartes
```jsx
<div className="card">Carte standard</div>
<div className="card card-hover">Carte avec effet hover</div>
```

#### Boutons
```jsx
<button className="btn btn-primary">Bouton principal</button>
<button className="btn btn-secondary">Bouton secondaire</button>
<button className="btn btn-danger">Bouton danger</button>
```

#### Inputs
```jsx
<input type="text" className="input" placeholder="Votre texte" />
```

#### Badges
```jsx
<span className="badge badge-success">Succès</span>
<span className="badge badge-error">Erreur</span>
<span className="badge badge-warning">Avertissement</span>
<span className="badge badge-info">Information</span>
```

### Animations :
- `animate-fadeIn` : Animation de fondu
- `animate-slideIn` : Animation de glissement

### Accessibilité :
- Support de `prefers-reduced-motion`
- Focus visible amélioré
- Transitions fluides

---

## 📊 Intégration des Graphiques

### Utilisation du composant Charts :
```jsx
import Charts from '../components/Charts';

<Charts
  title="Mon graphique"
  type="bar" // 'bar', 'line', 'pie', 'area'
  data={data}
  dataKey="value"
  xKey="label"
  height={300}
/>
```

### Composants individuels :
```jsx
import { BarChartComponent, LineChartComponent, PieChartComponent } from '../components/Charts';

<BarChartComponent data={data} dataKey="value" xKey="label" height={300} />
```

---

## 🚀 Exemples d'Intégration

### Dashboard avec tour guidé :
```jsx
import OnboardingTour from '../components/OnboardingTour';
import { defaultOnboardingSteps } from '../components/OnboardingSteps';

export default function Dashboard() {
  return (
    <div>
      <OnboardingTour
        steps={defaultOnboardingSteps}
        storageKey="dashboard-onboarding"
      />
      {/* Contenu du dashboard */}
    </div>
  );
}
```

### Liste avec pagination et empty state :
```jsx
import { Pagination, EmptyList } from '../components/ui';

export default function MyList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  if (items.length === 0) {
    return <EmptyList onCreate={handleCreate} />;
  }

  return (
    <>
      {/* Liste des items */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(items.length / 10)}
        onPageChange={setPage}
      />
    </>
  );
}
```

---

## 📝 Notes Importantes

### Performance
- Les composants UI sont optimisés pour les performances
- Les animations respectent `prefers-reduced-motion`
- Le thème est persisté dans localStorage

### Accessibilité
- Tous les composants sont accessibles au clavier
- Support des lecteurs d'écran
- Contraste respecté pour le dark mode

### Compatibilité
- Compatible avec React 18+
- Support complet du dark mode
- Responsive design pour mobile et desktop

