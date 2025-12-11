/**
 * Système de gestion d'état simple vanilla JS
 * Pattern pub/sub pour réactivité
 */

/**
 * Crée un store réactif
 */
export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    /**
     * Récupère l'état actuel
     */
    getState() {
      return state;
    },

    /**
     * Met à jour l'état et notifie les listeners
     */
    setState(newState) {
      const prevState = state;
      state = typeof newState === 'function'
        ? { ...state, ...newState(state) }
        : { ...state, ...newState };

      listeners.forEach(listener => listener(state, prevState));
    },

    /**
     * S'abonne aux changements d'état
     * @returns {Function} Fonction de désabonnement
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * Réinitialise l'état
     */
    reset() {
      const prevState = state;
      state = { ...initialState };
      listeners.forEach(listener => listener(state, prevState));
    }
  };
}

// ============================================================================
// STORE PRINCIPAL DE L'APPLICATION
// ============================================================================

export const appStore = createStore({
  // Authentification
  isAuthenticated: false,
  user: null,

  // UI
  theme: 'dark',
  sidebarOpen: true,
  loading: false,

  // Notifications
  notifications: [],

  // Données courantes
  currentRoute: '/'
});

// ============================================================================
// ACTIONS
// ============================================================================

export const actions = {
  // Auth
  login(user) {
    appStore.setState({
      isAuthenticated: true,
      user
    });
  },

  logout() {
    appStore.setState({
      isAuthenticated: false,
      user: null
    });
  },

  // UI
  setTheme(theme) {
    appStore.setState({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  },

  toggleSidebar() {
    appStore.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setLoading(loading) {
    appStore.setState({ loading });
  },

  // Notifications
  addNotification(notification) {
    const id = Date.now();
    appStore.setState(state => ({
      notifications: [...state.notifications, { id, ...notification }]
    }));

    // Auto-dismiss après 5 secondes
    if (notification.autoDismiss !== false) {
      setTimeout(() => actions.removeNotification(id), 5000);
    }

    return id;
  },

  removeNotification(id) {
    appStore.setState(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  // Route
  setCurrentRoute(route) {
    appStore.setState({ currentRoute: route });
  }
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Hook-like pour observer une partie du state
 */
export function select(selector) {
  return selector(appStore.getState());
}

/**
 * Crée un store local pour un composant
 */
export function createLocalStore(initialState) {
  return createStore(initialState);
}

export default appStore;
