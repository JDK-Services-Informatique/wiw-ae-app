// Page Analytics
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.analytics = function() {
    const projets = JSON.parse(localStorage.getItem('wiw-projets') || '[]');
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    
    // Calculer les statistiques
    const caTotal = projets.reduce((sum, p) => sum + (parseFloat(p.montantHT || 0)), 0);
    const caMoyen = projets.length > 0 ? caTotal / projets.length : 0;
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(caTotal)}</div>
                <div class="stat-label">CA Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(caMoyen)}</div>
                <div class="stat-label">CA Moyen</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${projets.length}</div>
                <div class="stat-label">Projets</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${tenders.length}</div>
                <div class="stat-label">Appels d'offres</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Graphiques</h2>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>Graphiques à implémenter (Chart.js ou similaire)</p>
            </div>
        </div>
    `;
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

