// Page BET & Architectes
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.bet = function() {
    const team = JSON.parse(localStorage.getItem('wiw-team-members') || '[]');
    const bet = JSON.parse(localStorage.getItem('wiw-bet') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">BET & Architectes</h2>
                <div>
                    <button class="btn btn-primary" onclick="addBET()">+ Ajouter contact</button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Compétences</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bet.length === 0 
                            ? '<tr><td colspan="5" class="text-center">Aucun contact BET</td></tr>'
                            : bet.map(b => `
                                <tr>
                                    <td>${b.nom || '-'}</td>
                                    <td>${b.type || '-'}</td>
                                    <td>${b.competences?.join(', ') || '-'}</td>
                                    <td>${b.email || b.telephone || '-'}</td>
                                    <td>
                                        <button class="btn btn-secondary" onclick="editBET('${b.id}')">Modifier</button>
                                    </td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Équipe interne</h2>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Rôle</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${team.length === 0 
                            ? '<tr><td colspan="4" class="text-center">Aucun membre d\'équipe</td></tr>'
                            : team.map(m => `
                                <tr>
                                    <td>${m.prenom || ''} ${m.nom || ''}</td>
                                    <td>${m.role || '-'}</td>
                                    <td>${m.email || '-'}</td>
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

function addBET() {
    alert('Fonctionnalité à implémenter');
}

function editBET(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

