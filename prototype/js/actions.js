// Gestionnaires d'actions pour tous les boutons du prototype

// Actions pour Honoraires
function addScenario() {
    window.Navigation.openForm('scenario');
}

function editScenario(id) {
    window.Navigation.openForm('scenario', id);
}

function exportScenario(id) {
    // Exporter un scénario
    const honoraires = JSON.parse(localStorage.getItem('wiw-honoraires') || '[]');
    const scenario = honoraires.find(h => h.id === id);
    
    if (scenario) {
        const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scenario-${id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Actions pour Appels d'Offres
function addTender() {
    window.Navigation.goTo('tenders', { action: 'new' });
}

function editTender(id) {
    window.Navigation.goToWithId('tenders', id);
}

function exportTenders() {
    const tenders = JSON.parse(localStorage.getItem('wiw-tenders') || '[]');
    const blob = new Blob([JSON.stringify(tenders, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenders-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Actions pour Équipe
function addMember() {
    window.Navigation.openForm('member');
}

function editMember(id) {
    window.Navigation.openForm('member', id);
}

// Actions pour Clients
function addCompany() {
    window.Navigation.openForm('company');
}

function editCompany(id) {
    window.Navigation.openForm('company', id);
}

// Actions pour Devis
function addDevis() {
    window.Navigation.openForm('devis');
}

function editDevis(id) {
    window.Navigation.openForm('devis', id);
}

// Actions pour Références
function addReference() {
    window.Navigation.openForm('reference');
}

function editReference(id) {
    window.Navigation.openForm('reference', id);
}

function exportReferences() {
    const references = JSON.parse(localStorage.getItem('wiw-references') || '[]');
    const blob = new Blob([JSON.stringify(references, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `references-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Actions pour BET
function addBET() {
    window.Navigation.openForm('bet');
}

function editBET(id) {
    window.Navigation.openForm('bet', id);
}

// Actions pour Templates
function addTemplate() {
    window.Navigation.openForm('template');
}

function useTemplate(id) {
    // Rediriger vers la page appropriée selon le type de template
    window.Navigation.goTo('templates', { use: id });
}

function editTemplate(id) {
    window.Navigation.openForm('template', id);
}

// Action générique "Ajouter" dans le header
function handleAddButton() {
    const currentPage = window.location.hash.slice(1).split('?')[0];
    const addActions = {
        'dashboard': () => window.Navigation.goTo('references', { action: 'new' }),
        'honoraires': addScenario,
        'tenders': addTender,
        'team': addMember,
        'company': addCompany,
        'devis': addDevis,
        'references': addReference,
        'bet': addBET,
        'templates': addTemplate
    };
    
    if (addActions[currentPage]) {
        addActions[currentPage]();
    } else {
        // Par défaut, rediriger vers la page actuelle avec action=new
        window.Navigation.goTo(currentPage, { action: 'new' });
    }
}

// Export global
window.addScenario = addScenario;
window.editScenario = editScenario;
window.exportScenario = exportScenario;
window.addTender = addTender;
window.editTender = editTender;
window.exportTenders = exportTenders;
window.addMember = addMember;
window.editMember = editMember;
window.addCompany = addCompany;
window.editCompany = editCompany;
window.addDevis = addDevis;
window.editDevis = editDevis;
window.addReference = addReference;
window.editReference = editReference;
window.exportReferences = exportReferences;
window.addBET = addBET;
window.editBET = editBET;
window.addTemplate = addTemplate;
window.useTemplate = useTemplate;
window.editTemplate = editTemplate;
window.handleAddButton = handleAddButton;

