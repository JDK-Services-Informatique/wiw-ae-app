// Système de navigation pour le prototype
// Gère les redirections et les actions des boutons

const Navigation = {
    // Rediriger vers une page
    goTo: function(page, params = {}) {
        if (typeof window.navigateToPage === 'function') {
            window.navigateToPage(page);
            
            // Gérer les paramètres de requête si nécessaire
            if (Object.keys(params).length > 0) {
                const queryString = new URLSearchParams(params).toString();
                window.location.hash = `${page}?${queryString}`;
            }
        } else {
            window.location.hash = page;
        }
    },
    
    // Rediriger vers une page avec un ID
    goToWithId: function(page, id) {
        this.goTo(page, { id });
    },
    
    // Ouvrir un formulaire modal (simulation)
    openForm: function(type, id = null) {
        // Pour l'instant, redirige vers la page avec un paramètre
        // Dans une vraie implémentation, on ouvrirait un modal
        const page = this.getPageForType(type);
        if (id) {
            this.goToWithId(page, id);
        } else {
            this.goTo(page, { action: 'new' });
        }
    },
    
    // Obtenir la page correspondant à un type
    getPageForType: function(type) {
        const mapping = {
            'scenario': 'honoraires',
            'tender': 'tenders',
            'member': 'team',
            'company': 'company',
            'devis': 'devis',
            'reference': 'references',
            'bet': 'bet',
            'template': 'templates',
            'projet': 'references'
        };
        return mapping[type] || 'dashboard';
    }
};

// Export global
window.Navigation = Navigation;

