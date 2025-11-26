// Page Honoraires
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.honoraires = function() {
    const honoraires = JSON.parse(localStorage.getItem('wiw-honoraires') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Scénarios Honoraires</h2>
                <div>
                    <button class="btn btn-primary" onclick="addScenario()">+ Nouveau scénario</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Montant HT</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${honoraires.length === 0 
                            ? '<tr><td colspan="5" class="text-center">Aucun scénario d\'honoraires</td></tr>'
                            : honoraires.map(h => `
                                <tr>
                                    <td>${h.nom || 'Scénario'}</td>
                                    <td>${h.type || 'Base'}</td>
                                    <td>${formatCurrency(h.montantHT || 0)}</td>
                                    <td><span class="badge badge-${h.statut === 'Actif' ? 'success' : 'info'}">${h.statut || 'Brouillon'}</span></td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editScenario('${h.id}')">Modifier</button>
                                        <button class="btn btn-secondary" onclick="exportScenario('${h.id}')">Exporter</button>
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

function addScenario() {
    alert('Fonctionnalité à implémenter');
}

function editScenario(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

function exportScenario(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

