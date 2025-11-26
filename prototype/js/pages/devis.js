// Page Devis
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.devis = function() {
    const devis = JSON.parse(localStorage.getItem('wiw-devis') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Devis</h2>
                <div>
                    <button class="btn btn-primary" onclick="addDevis()">+ Nouveau devis</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Client</th>
                            <th>Montant HT</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${devis.length === 0 
                            ? '<tr><td colspan="6" class="text-center">Aucun devis</td></tr>'
                            : devis.map(d => `
                                <tr>
                                    <td>${d.numero || d.id}</td>
                                    <td>${d.client || '-'}</td>
                                    <td>${formatCurrency(d.montantHT || 0)}</td>
                                    <td>${formatDate(d.date)}</td>
                                    <td><span class="badge badge-${getStatusClass(d.statut)}">${d.statut || 'Brouillon'}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editDevis('${d.id}')">Modifier</button>
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
        'Accepté': 'success',
        'Refusé': 'error',
        'En attente': 'warning',
        'Brouillon': 'info'
    };
    return classes[statut] || 'info';
}

function addDevis() {
    alert('Fonctionnalité à implémenter');
}

function editDevis(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

