// Page Alertes
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.alertes = function() {
    const alertes = JSON.parse(localStorage.getItem('wiw-alertes') || '[]');
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    
    // Générer des alertes automatiques
    const autoAlertes = [];
    const now = new Date();
    
    tenders.forEach(t => {
        if (t.dateLimite) {
            const deadline = new Date(t.dateLimite);
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            
            if (daysLeft <= 7 && daysLeft > 0) {
                autoAlertes.push({
                    type: 'warning',
                    message: `Échéance proche pour ${t.intitule || 'AO'}`,
                    date: t.dateLimite,
                    jours: daysLeft
                });
            } else if (daysLeft < 0) {
                autoAlertes.push({
                    type: 'error',
                    message: `Échéance dépassée pour ${t.intitule || 'AO'}`,
                    date: t.dateLimite,
                    jours: Math.abs(daysLeft)
                });
            }
        }
    });
    
    const allAlertes = [...alertes, ...autoAlertes];
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Alertes</h2>
            </div>
            <div class="alertes-container">
                ${allAlertes.length === 0 
                    ? '<p class="text-center text-muted">Aucune alerte</p>'
                    : allAlertes.map(a => `
                        <div class="alerte-item alerte-${a.type}">
                            <div class="alerte-icon">
                                ${a.type === 'error' ? '⚠️' : a.type === 'warning' ? '⚡' : 'ℹ️'}
                            </div>
                            <div class="alerte-content">
                                <h4>${a.message}</h4>
                                ${a.jours ? `<p>${a.jours} jour(s)</p>` : ''}
                                ${a.date ? `<p class="text-muted">${formatDate(a.date)}</p>` : ''}
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
};

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

