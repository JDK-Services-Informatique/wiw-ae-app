// Page Dashboard
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.dashboard = function() {
    // Charger les données depuis localStorage
    const projets = JSON.parse(localStorage.getItem('wiw-projets') || '[]');
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    const devis = JSON.parse(localStorage.getItem('wiw-devis') || '[]');
    const team = JSON.parse(localStorage.getItem('wiw-team-members') || '[]');
    
    // Calculer les statistiques
    const totalProjets = projets.length;
    const totalTenders = tenders.length;
    const totalDevis = devis.length;
    const totalTeam = team.length;
    
    const tendersGagnes = tenders.filter(t => t.statut === 'Gagné').length;
    const tendersEnCours = tenders.filter(t => t.statut === 'En cours').length;
    
    // Calculer le CA total (exemple)
    const caTotal = projets.reduce((sum, p) => sum + (parseFloat(p.montantHT || 0)), 0);
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalProjets}</div>
                <div class="stat-label">Projets actifs</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalTenders}</div>
                <div class="stat-label">Appels d'offres</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${tendersGagnes}</div>
                <div class="stat-label">AO gagnés</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCurrency(caTotal)}</div>
                <div class="stat-label">CA total</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Activité récente</h2>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateRecentActivity(projets, tenders, devis)}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Pipeline AO</h2>
                <button class="btn btn-secondary" onclick="window.Navigation.goTo('pipeline')">Voir le pipeline</button>
            </div>
            <div class="stats-grid">
                <div class="stat-card" style="cursor: pointer;" onclick="window.Navigation.goTo('tenders', { statut: 'Nouveau' })">
                    <div class="stat-value">${tenders.filter(t => t.statut === 'Nouveau').length}</div>
                    <div class="stat-label">Nouveaux</div>
                </div>
                <div class="stat-card" style="cursor: pointer;" onclick="window.Navigation.goTo('tenders', { statut: 'En cours' })">
                    <div class="stat-value">${tendersEnCours}</div>
                    <div class="stat-label">En cours</div>
                </div>
                <div class="stat-card" style="cursor: pointer;" onclick="window.Navigation.goTo('tenders', { statut: 'Gagné' })">
                    <div class="stat-value">${tendersGagnes}</div>
                    <div class="stat-label">Gagnés</div>
                </div>
                <div class="stat-card" style="cursor: pointer;" onclick="window.Navigation.goTo('tenders', { statut: 'Perdu' })">
                    <div class="stat-value">${tenders.filter(t => t.statut === 'Perdu').length}</div>
                    <div class="stat-label">Perdus</div>
                </div>
            </div>
        </div>
    `;
};

function generateRecentActivity(projets, tenders, devis) {
    const activities = [];
    
    // Ajouter les projets récents
    projets.slice(0, 5).forEach(p => {
        activities.push({
            type: 'Projet',
            description: p.nom || p.intitule || 'Projet',
            date: p.dateCreation || new Date().toISOString(),
            statut: p.statut || 'Actif',
            id: p.id
        });
    });
    
    // Ajouter les AO récents
    tenders.slice(0, 5).forEach(t => {
        activities.push({
            type: 'AO',
            description: t.intitule || t.nom || 'Appel d\'offres',
            date: t.dateCreation || new Date().toISOString(),
            statut: t.statut || 'Nouveau',
            id: t.id
        });
    });
    
    // Trier par date et prendre les 10 plus récents
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (activities.length === 0) {
        return '<tr><td colspan="4" class="text-center">Aucune activité récente</td></tr>';
    }
    
    return activities.slice(0, 10).map(activity => {
        const clickHandler = activity.type === 'Projet' 
            ? `onclick="window.Navigation.goTo('references', { id: '${activity.id || ''}' })"`
            : activity.type === 'AO'
            ? `onclick="window.Navigation.goTo('tenders', { id: '${activity.id || ''}' })"`
            : '';
        return `
        <tr style="cursor: pointer;" ${clickHandler}>
            <td>${activity.type}</td>
            <td>${activity.description}</td>
            <td>${formatDate(activity.date)}</td>
            <td><span class="badge badge-${getStatusClass(activity.statut)}">${activity.statut}</span></td>
        </tr>
    `;
    }).join('');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getStatusClass(statut) {
    const classes = {
        'Gagné': 'success',
        'Perdu': 'error',
        'En cours': 'warning',
        'Nouveau': 'info',
        'Actif': 'success'
    };
    return classes[statut] || 'info';
}

