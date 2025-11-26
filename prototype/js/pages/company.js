// Page Clients
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.company = function() {
    const companies = JSON.parse(localStorage.getItem('wiw-companies') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Clients / Maîtres d'Ouvrage</h2>
                <div>
                    <button class="btn btn-primary" onclick="addCompany()">+ Ajouter client</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${companies.length === 0 
                            ? '<tr><td colspan="5" class="text-center">Aucun client</td></tr>'
                            : companies.map(c => `
                                <tr>
                                    <td>${c.nom || '-'}</td>
                                    <td>${c.type || '-'}</td>
                                    <td>${c.contact || '-'}</td>
                                    <td>${c.email || '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editCompany('${c.id}')">Modifier</button>
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

function addCompany() {
    alert('Fonctionnalité à implémenter');
}

function editCompany(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

