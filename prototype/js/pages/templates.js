// Page Templates
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.templates = function() {
    const templates = JSON.parse(localStorage.getItem('wiw-templates') || '[]');
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Templates</h2>
                <div>
                    <button class="btn btn-primary" onclick="addTemplate()">+ Ajouter template</button>
                </div>
            </div>
            <div class="templates-grid">
                ${templates.length === 0 
                    ? '<p class="text-center text-muted">Aucun template</p>'
                    : templates.map(t => `
                        <div class="template-card">
                            <div class="template-icon">${t.icon || '📄'}</div>
                            <h4>${t.nom || 'Template'}</h4>
                            <p>${t.description || ''}</p>
                            <div class="template-actions">
                                <button class="btn btn-secondary" onclick="useTemplate('${t.id}')">Utiliser</button>
                                <button class="btn btn-secondary" onclick="editTemplate('${t.id}')">Modifier</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
};

function addTemplate() {
    alert('Fonctionnalité à implémenter');
}

function useTemplate(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

function editTemplate(id) {
    alert('Fonctionnalité à implémenter: ' + id);
}

