// Page Appels d'Offres
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.tenders = function() {
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    
    // Statistiques
    const stats = {
        total: tenders.length,
        nouveaux: tenders.filter(t => t.statut === 'Nouveau').length,
        enCours: tenders.filter(t => t.statut === 'En cours').length,
        gagnes: tenders.filter(t => t.statut === 'Gagné').length,
        perdus: tenders.filter(t => t.statut === 'Perdu').length
    };
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total AO</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.nouveaux}</div>
                <div class="stat-label">Nouveaux</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.enCours}</div>
                <div class="stat-label">En cours</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.gagnes}</div>
                <div class="stat-label">Gagnés</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.perdus}</div>
                <div class="stat-label">Perdus</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.total > 0 ? Math.round((stats.gagnes / (stats.gagnes + stats.perdus)) * 100) : 0}%</div>
                <div class="stat-label">Taux de réussite</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Liste des Appels d'Offres</h2>
                <div>
                    <button class="btn btn-primary" onclick="addTender()">+ Nouvel AO</button>
                    <button class="btn btn-secondary" onclick="exportTenders()">Exporter</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Intitulé</th>
                            <th>Maître d'ouvrage</th>
                            <th>Montant</th>
                            <th>Date limite</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tenders.length === 0 
                            ? '<tr><td colspan="6" class="text-center">Aucun appel d\'offres</td></tr>'
                            : tenders.map(t => `
                                <tr>
                                    <td>${t.intitule || t.nom || 'AO'}</td>
                                    <td>${t.maitreOuvrage || '-'}</td>
                                    <td>${formatCurrency(t.montant || 0)}</td>
                                    <td>${formatDate(t.dateLimite || t.date)}</td>
                                    <td><span class="badge badge-${getStatusClass(t.statut)}">${t.statut || 'Nouveau'}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editTender('${t.id}')">Modifier</button>
                                    </td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
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

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

function getStatusClass(statut) {
    const classes = {
        'Gagné': 'success',
        'Perdu': 'error',
        'En cours': 'warning',
        'Nouveau': 'info'
    };
    return classes[statut] || 'info';
}

function addTender() {
    alert('Fonctionnalité à implémenter');
}

function editTender(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

function exportTenders() {
    alert('Fonctionnalité d\'export à implémenter');
}

