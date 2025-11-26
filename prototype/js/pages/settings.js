// Page Paramètres
window.pageHandlers = window.pageHandlers || {};

window.pageHandlers.settings = function() {
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Paramètres</h2>
            </div>
            <div class="form-group">
                <label class="form-label">Thème</label>
                <select class="form-input" id="themeSelect" onchange="changeTheme(this.value)">
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Langue</label>
                <select class="form-input">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" onclick="exportData()">Exporter les données</button>
                <button class="btn btn-secondary" onclick="importData()">Importer les données</button>
            </div>
        </div>
    `;
};

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function exportData() {
    const data = {
        projets: JSON.parse(localStorage.getItem('wiw-projets') || '[]'),
        tenders: JSON.parse(localStorage.getItem('wiw-tenders') || '[]'),
        devis: JSON.parse(localStorage.getItem('wiw-devis') || '[]'),
        team: JSON.parse(localStorage.getItem('wiw-team-members') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wiw-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.projets) localStorage.setItem('wiw-projets', JSON.stringify(data.projets));
                    if (data.tenders) localStorage.setItem('wiw-tenders', JSON.stringify(data.tenders));
                    if (data.devis) localStorage.setItem('wiw-devis', JSON.stringify(data.devis));
                    if (data.team) localStorage.setItem('wiw-team-members', JSON.stringify(data.team));
                    alert('Données importées avec succès !');
                    location.reload();
                } catch (error) {
                    alert('Erreur lors de l\'import: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

