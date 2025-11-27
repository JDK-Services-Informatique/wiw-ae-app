// Page Calendrier
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.calendar = function() {
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    
    // Filtrer les AO avec dates
    const tendersWithDates = tenders.filter(t => t.dateLimite || t.date);
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Calendrier Prospection</h2>
            </div>
            <div class="calendar-container">
                ${tendersWithDates.length === 0 
                    ? '<p class="text-center text-muted">Aucun événement à afficher</p>'
                    : tendersWithDates.map(t => `
                        <div class="calendar-event">
                            <div class="calendar-date">
                                <div class="calendar-day">${formatDay(t.dateLimite || t.date)}</div>
                                <div class="calendar-month">${formatMonth(t.dateLimite || t.date)}</div>
                            </div>
                            <div class="calendar-content">
                                <h4>${t.intitule || t.nom || 'AO'}</h4>
                                <p>${t.maitreOuvrage || '-'}</p>
                                <p class="calendar-amount">${formatCurrency(t.montant || 0)}</p>
                                <span class="badge badge-${getStatusClass(t.statut)}">${t.statut || 'Nouveau'}</span>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
};

function formatDay(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.getDate();
}

function formatMonth(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
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

