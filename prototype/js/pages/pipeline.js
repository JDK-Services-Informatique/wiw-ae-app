// Page Pipeline AO
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.pipeline = function() {
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    
    // Grouper par statut
    const pipeline = {
        nouveau: tenders.filter(t => t.statut === 'Nouveau'),
        enCours: tenders.filter(t => t.statut === 'En cours'),
        gagne: tenders.filter(t => t.statut === 'Gagné'),
        perdu: tenders.filter(t => t.statut === 'Perdu')
    };
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Pipeline Appels d'Offres</h2>
            </div>
            <div class="pipeline-container">
                <div class="pipeline-column">
                    <h3>Nouveaux (${pipeline.nouveau.length})</h3>
                    ${pipeline.nouveau.map(t => `
                        <div class="pipeline-card">
                            <h4>${t.intitule || t.nom || 'AO'}</h4>
                            <p>${t.maitreOuvrage || '-'}</p>
                            <p class="pipeline-amount">${formatCurrency(t.montant || 0)}</p>
                        </div>
                    `).join('') || '<p class="text-muted">Aucun</p>'}
                </div>
                <div class="pipeline-column">
                    <h3>En cours (${pipeline.enCours.length})</h3>
                    ${pipeline.enCours.map(t => `
                        <div class="pipeline-card">
                            <h4>${t.intitule || t.nom || 'AO'}</h4>
                            <p>${t.maitreOuvrage || '-'}</p>
                            <p class="pipeline-amount">${formatCurrency(t.montant || 0)}</p>
                        </div>
                    `).join('') || '<p class="text-muted">Aucun</p>'}
                </div>
                <div class="pipeline-column">
                    <h3>Gagnés (${pipeline.gagne.length})</h3>
                    ${pipeline.gagne.map(t => `
                        <div class="pipeline-card">
                            <h4>${t.intitule || t.nom || 'AO'}</h4>
                            <p>${t.maitreOuvrage || '-'}</p>
                            <p class="pipeline-amount">${formatCurrency(t.montant || 0)}</p>
                        </div>
                    `).join('') || '<p class="text-muted">Aucun</p>'}
                </div>
                <div class="pipeline-column">
                    <h3>Perdus (${pipeline.perdu.length})</h3>
                    ${pipeline.perdu.map(t => `
                        <div class="pipeline-card">
                            <h4>${t.intitule || t.nom || 'AO'}</h4>
                            <p>${t.maitreOuvrage || '-'}</p>
                            <p class="pipeline-amount">${formatCurrency(t.montant || 0)}</p>
                        </div>
                    `).join('') || '<p class="text-muted">Aucun</p>'}
                </div>
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

