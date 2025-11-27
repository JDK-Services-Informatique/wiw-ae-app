// Application principale - Gestion du thème, navigation mobile, etc.

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initNavigation();
});

// Gestion du thème
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeButton(savedTheme);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeButton(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function updateThemeButton(theme) {
    const button = document.getElementById('themeToggle');
    const iconEl = document.getElementById('themeIcon');
    const labelEl = document.getElementById('themeLabel');
    
    if (button && iconEl && labelEl) {
        iconEl.innerHTML = theme === 'dark' 
            ? getIcon('sun')
            : getIcon('moon');
        labelEl.textContent = theme === 'dark' 
            ? 'Mode clair'
            : 'Mode sombre';
    }
}

// Menu mobile
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Fermer le menu en cliquant sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        });
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                navigateToPage(page);
            }
        });
    });
    
    // Navigation initiale
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateToPage(hash);
}

function navigateToPage(page) {
    // Mettre à jour l'URL
    window.location.hash = page;
    
    // Mettre à jour le menu actif
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    // Charger la page
    loadPage(page);
}

function loadPage(page) {
    const pageContent = document.getElementById('pageContent');
    const pageTitle = document.getElementById('pageTitle');
    
    // Afficher le chargement
    pageContent.innerHTML = '<div class="loading">Chargement...</div>';
    
    // Charger le contenu de la page
    setTimeout(() => {
        if (window.pageHandlers && window.pageHandlers[page]) {
            const content = window.pageHandlers[page]();
            pageContent.innerHTML = content;
            
            // Mettre à jour le titre
            const titles = {
                dashboard: 'Tableau de Bord',
                honoraires: 'Honoraires',
                tenders: 'Appels d\'Offres',
                team: 'Équipe',
                company: 'Clients',
                devis: 'Devis',
                analytics: 'Analytics',
                references: 'Références',
                settings: 'Paramètres'
            };
            if (pageTitle) {
                pageTitle.textContent = titles[page] || page;
            }
        } else {
            pageContent.innerHTML = `<div class="empty-state">
                <div class="empty-state-icon" data-icon="document"></div>
                <p>Page en cours de développement</p>
            </div>`;
            // Initialiser l'icône après injection
            setTimeout(() => {
                const iconEl = pageContent.querySelector('[data-icon]');
                if (iconEl && typeof getIcon === 'function') {
                    iconEl.innerHTML = getIcon('document');
                }
            }, 0);
        }
    }, 100);
}

// Gestion de l'URL hash
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateToPage(hash);
});

// Export pour utilisation globale
window.navigateToPage = navigateToPage;

