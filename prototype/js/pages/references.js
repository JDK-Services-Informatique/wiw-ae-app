// Page Références
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.references = function() {
    const references = JSON.parse(localStorage.getItem('wiw-references') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Références</h2>
                <div>
                    <button class="btn btn-primary" onclick="addReference()">+ Ajouter référence</button>
                    <button class="btn btn-secondary" onclick="exportReferences()">Exporter</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Client</th>
                            <th>Année</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${references.length === 0 
                            ? '<tr><td colspan="5" class="text-center">Aucune référence</td></tr>'
                            : references.map(r => `
                                <tr>
                                    <td>${r.nom || '-'}</td>
                                    <td>${r.type || '-'}</td>
                                    <td>${r.client || '-'}</td>
                                    <td>${r.annee || '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editReference('${r.id}')">Modifier</button>
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

function addReference() {
    alert('Fonctionnalité à implémenter');
}

function editReference(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

function exportReferences() {
    alert('Fonctionnalité d\'export à implémenter');
}

