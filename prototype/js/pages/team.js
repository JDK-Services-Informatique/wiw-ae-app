// Page Équipe
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.team = function() {
    const team = JSON.parse(localStorage.getItem('wiw-team-members') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Membres de l'équipe</h2>
                <div>
                    <button class="btn btn-primary" onclick="addMember()">+ Ajouter membre</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Rôle</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${team.length === 0 
                            ? '<tr><td colspan="5" class="text-center">Aucun membre d\'équipe</td></tr>'
                            : team.map(m => `
                                <tr>
                                    <td>${m.prenom || ''} ${m.nom || ''}</td>
                                    <td>${m.role || '-'}</td>
                                    <td>${m.email || '-'}</td>
                                    <td>${m.telephone || '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editMember('${m.id}')">Modifier</button>
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

function addMember() {
    alert('Fonctionnalité à implémenter');
}

function editMember(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

