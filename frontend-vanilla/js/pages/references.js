/**
 * Page Références - Portfolio de projets
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { router } from '../router.js';

const STORAGE_KEY = 'wiw-projets';

// Données par défaut
const defaultProjets = [
    {
        id: 1,
        nom: 'Résidence Les Oliviers',
        domaine: 'Logements',
        type: 'Logements collectifs',
        localisation: 'Lyon',
        surface: 3500,
        montantTravauxHT: 2800000,
        maitreOuvrage: 'Ville de Lyon',
        annee: '2023',
        image: '🏢'
    },
    {
        id: 2,
        nom: 'École Primaire Victor Hugo',
        domaine: 'Équipements publics',
        type: 'Équipement scolaire',
        localisation: 'Paris',
        surface: 2200,
        montantTravauxHT: 4500000,
        maitreOuvrage: 'Ville de Paris',
        annee: '2022',
        image: '🏫'
    }
];

// Mapping Domaine → Types
const domaineTypes = {
    'Logements': ['Logements collectifs', 'Maisons individuelles', 'Résidence étudiante', 'Logements sociaux'],
    'Équipements publics': ['Équipement culturel', 'Équipement sportif', 'Équipement scolaire', 'Mairie/Administration'],
    'Commerce': ['Centre commercial', 'Commerce de proximité', 'Hôtel/Restaurant'],
    'Bureaux': ['Bureaux neufs', 'Réhabilitation bureaux', 'Co-working'],
    'Industrie': ['Bâtiment industriel', 'Entrepôt/Logistique'],
    'Santé': ['Hôpital', 'Clinique', 'EHPAD'],
    'Autre': ['Mixte', 'Spécifique']
};

export class ReferencesPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            loading: false,
            projets: [],
            showForm: false,
            editingProjet: null,
            selectedProjet: null,
            searchQuery: '',
            filterDomaine: 'all',

            newProjet: {
                nom: '',
                domaine: 'Logements',
                type: 'Logements collectifs',
                localisation: '',
                surface: '',
                montantTravauxHT: '',
                maitreOuvrage: '',
                annee: new Date().getFullYear().toString()
            }
        };
    }

    onMount() {
        this.loadData();
        this.bindEvents();
    }

    loadData() {
        const savedProjets = storage.get(STORAGE_KEY, defaultProjets);
        this.setState({ projets: savedProjets, loading: false });
    }

    saveData() {
        storage.set(STORAGE_KEY, this.state.projets);
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // Toggle form
        container.querySelector('#btn-new-ref')?.addEventListener('click', () => {
            this.setState({ showForm: !this.state.showForm });
        });

        // Search
        container.querySelector('#search-ref')?.addEventListener('input', (e) => {
            this.setState({ searchQuery: e.target.value });
        });

        // Filter domaine
        container.querySelector('#filter-domaine')?.addEventListener('change', (e) => {
            this.setState({ filterDomaine: e.target.value });
        });

        // Export buttons
        container.querySelector('#btn-export-excel')?.addEventListener('click', () => this.exportExcel());
        container.querySelector('#btn-export-pdf')?.addEventListener('click', () => this.exportPDF());

        // Form events
        this.bindFormEvents();

        // Card actions
        this.bindCardEvents();
    }

    bindFormEvents() {
        const container = this.container;
        if (!container) return;

        // Form fields
        ['nom', 'localisation', 'surface', 'montantTravauxHT', 'maitreOuvrage', 'annee'].forEach(field => {
            const input = container.querySelector(`#ref-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    let value = e.target.value;
                    if (field === 'surface' || field === 'montantTravauxHT') {
                        value = parseFloat(value) || 0;
                    }
                    this.updateNewProjet(field, value);
                });
            }
        });

        // Domaine
        container.querySelector('#ref-domaine')?.addEventListener('change', (e) => {
            const domaine = e.target.value;
            const firstType = domaineTypes[domaine]?.[0] || '';
            this.setState({
                newProjet: {
                    ...this.state.newProjet,
                    domaine,
                    type: firstType
                }
            });
        });

        // Type
        container.querySelector('#ref-type')?.addEventListener('change', (e) => {
            this.updateNewProjet('type', e.target.value);
        });

        // Submit
        container.querySelector('#btn-add-ref')?.addEventListener('click', () => this.addProjet());
    }

    bindCardEvents() {
        const container = this.container;
        if (!container) return;

        // View details
        container.querySelectorAll('[data-view-projet]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.viewProjet);
                const projet = this.state.projets.find(p => p.id === id);
                this.setState({ selectedProjet: projet });
            });
        });

        // Edit
        container.querySelectorAll('[data-edit-projet]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.editProjet);
                const projet = this.state.projets.find(p => p.id === id);
                this.setState({
                    editingProjet: { ...projet },
                    showForm: true
                });
            });
        });

        // Delete
        container.querySelectorAll('[data-delete-projet]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteProjet(parseInt(e.currentTarget.dataset.deleteProjet));
            });
        });

        // Close selected
        container.querySelector('#btn-close-selected')?.addEventListener('click', () => {
            this.setState({ selectedProjet: null });
        });

        // Create devis from project
        container.querySelector('#btn-creer-devis')?.addEventListener('click', () => {
            if (this.state.selectedProjet) {
                storage.set('wiw-devis-prefill', {
                    client: {
                        nom: this.state.selectedProjet.maitreOuvrage || '',
                        ville: this.state.selectedProjet.localisation || ''
                    },
                    notes: `Devis pour projet: ${this.state.selectedProjet.nom}`
                });
                router.navigate('/devis');
            }
        });

        // Calculate honoraires
        container.querySelector('#btn-calc-honoraires')?.addEventListener('click', () => {
            if (this.state.selectedProjet) {
                storage.set('wiw-honoraires-prefill', {
                    montantTravaux: this.state.selectedProjet.montantTravauxHT || 0,
                    surface: this.state.selectedProjet.surface || 0,
                    nomProjet: this.state.selectedProjet.nom
                });
                router.navigate('/honoraires');
            }
        });
    }

    updateNewProjet(field, value) {
        this.setState({
            newProjet: {
                ...this.state.newProjet,
                [field]: value
            }
        });
    }

    addProjet() {
        const { newProjet, projets } = this.state;

        if (!newProjet.nom || !newProjet.localisation) {
            toast.error('Nom et localisation sont obligatoires');
            return;
        }

        const projet = {
            id: Date.now(),
            ...newProjet,
            surface: parseFloat(newProjet.surface) || 0,
            montantTravauxHT: parseFloat(newProjet.montantTravauxHT) || 0,
            image: '🏗️'
        };

        this.setState({
            projets: [...projets, projet],
            newProjet: {
                nom: '',
                domaine: 'Logements',
                type: 'Logements collectifs',
                localisation: '',
                surface: '',
                montantTravauxHT: '',
                maitreOuvrage: '',
                annee: new Date().getFullYear().toString()
            },
            showForm: false
        });

        this.saveData();
        toast.success('Référence ajoutée');
    }

    async deleteProjet(id) {
        const confirmed = await modal.confirm({
            title: 'Supprimer la référence',
            message: 'Êtes-vous sûr de vouloir supprimer cette référence ?',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            const projets = this.state.projets.filter(p => p.id !== id);
            this.setState({ projets });
            this.saveData();
            toast.info('Référence supprimée');
        }
    }

    calculerRatio(surface, montantHT) {
        if (!surface || !montantHT || surface === 0) return '-';
        return `${Math.round(montantHT / surface)} €/m²`;
    }

    calculerHonoraires(montantTravaux) {
        if (!montantTravaux || montantTravaux === 0) return { montant: 0, pourcentage: 0 };
        const pourcentage = 12;
        const montant = (montantTravaux * pourcentage) / 100;
        return { montant, pourcentage };
    }

    getFilteredProjets() {
        const { projets, searchQuery, filterDomaine } = this.state;

        return projets.filter(p => {
            const matchSearch = !searchQuery ||
                p.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.localisation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.maitreOuvrage?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchDomaine = filterDomaine === 'all' || p.domaine === filterDomaine;

            return matchSearch && matchDomaine;
        });
    }

    exportExcel() {
        toast.info('Export Excel en cours...');
        setTimeout(() => toast.success('Export Excel réussi'), 1000);
    }

    exportPDF() {
        toast.info('Export PDF en cours...');
        setTimeout(() => toast.success('Export PDF réussi'), 1000);
    }

    render() {
        const { showForm, selectedProjet, searchQuery, filterDomaine, newProjet } = this.state;
        const filteredProjets = this.getFilteredProjets();

        return `
            <div class="page-references">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.fileText}
                            Références Projets
                        </h1>
                        <p class="page-subtitle">
                            Portfolio de vos réalisations
                        </p>
                    </div>
                    <div class="page-actions">
                        <button id="btn-export-excel" class="btn btn-secondary">
                            ${icons.download}
                            <span>Excel</span>
                        </button>
                        <button id="btn-export-pdf" class="btn btn-secondary">
                            ${icons.download}
                            <span>PDF</span>
                        </button>
                        <button id="btn-new-ref" class="btn btn-primary">
                            ${showForm ? icons.x : icons.plus}
                            <span>${showForm ? 'Annuler' : 'Ajouter une référence'}</span>
                        </button>
                    </div>
                </div>

                ${selectedProjet ? this.renderSelectedProjet() : ''}

                ${showForm ? this.renderForm() : ''}

                <!-- Filters -->
                <div class="card mb-4">
                    <div class="data-table-header">
                        <div class="data-table-search">
                            <span class="data-table-search-icon">${icons.search}</span>
                            <input
                                type="text"
                                id="search-ref"
                                class="form-input"
                                placeholder="Rechercher..."
                                value="${searchQuery}"
                            />
                        </div>
                        <div class="data-table-filters">
                            <select id="filter-domaine" class="form-input">
                                <option value="all">Tous les domaines</option>
                                ${Object.keys(domaineTypes).map(d => `
                                    <option value="${d}" ${filterDomaine === d ? 'selected' : ''}>${d}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Grid -->
                ${filteredProjets.length === 0 ? `
                    <div class="card text-center py-8">
                        <div class="text-4xl mb-4">🏗️</div>
                        <p class="text-xl font-semibold mb-2">Aucune référence</p>
                        <p class="text-muted">Ajoutez vos projets réalisés pour constituer votre portfolio</p>
                    </div>
                ` : `
                    <div class="references-grid">
                        ${filteredProjets.map(projet => `
                            <div class="reference-card">
                                <div class="reference-card-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem; background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);">
                                    ${projet.vignette ? `<img src="${projet.vignette}" alt="${projet.nom}" style="width: 100%; height: 100%; object-fit: cover;" />` : projet.image || '🏗️'}
                                </div>
                                <div class="reference-card-content">
                                    <h3 class="reference-card-title">${projet.nom}</h3>
                                    <div class="reference-card-meta">
                                        ${projet.maitreOuvrage ? `<div>👤 ${projet.maitreOuvrage}</div>` : ''}
                                        <div>📍 ${projet.localisation}</div>
                                        <div>🏷️ ${projet.type}</div>
                                        ${projet.surface ? `<div>📐 ${formatNumber(projet.surface)} m²</div>` : ''}
                                        ${projet.montantTravauxHT ? `<div>💰 ${formatCurrency(projet.montantTravauxHT)}</div>` : ''}
                                        <div>📅 ${projet.annee}</div>
                                    </div>
                                    <div class="reference-card-tags mt-3">
                                        <button class="btn btn-sm btn-primary" data-view-projet="${projet.id}">
                                            ${icons.eye} Détails
                                        </button>
                                        <button class="btn btn-sm btn-secondary" data-edit-projet="${projet.id}">
                                            ${icons.edit}
                                        </button>
                                        <button class="btn btn-sm btn-danger" data-delete-projet="${projet.id}">
                                            ${icons.trash}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }

    renderSelectedProjet() {
        const projet = this.state.selectedProjet;
        if (!projet) return '';

        const honoraires = this.calculerHonoraires(projet.montantTravauxHT);

        return `
            <div class="card mb-4" style="background: var(--info-light);">
                <div class="card-header">
                    <h3 class="card-title">${projet.nom}</h3>
                    <div class="flex gap-2">
                        <button id="btn-creer-devis" class="btn btn-success btn-sm">
                            ${icons.fileText} Créer devis
                        </button>
                        <button id="btn-calc-honoraires" class="btn btn-warning btn-sm">
                            ${icons.calculator} Calculer honoraires
                        </button>
                        <button id="btn-close-selected" class="btn btn-secondary btn-sm">
                            Fermer
                        </button>
                    </div>
                </div>

                <div class="text-center text-6xl mb-4">${projet.image || '🏗️'}</div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div><strong>Maître d'ouvrage:</strong> ${projet.maitreOuvrage || '-'}</div>
                    <div><strong>Localisation:</strong> ${projet.localisation}</div>
                    <div><strong>Domaine:</strong> ${projet.domaine || '-'}</div>
                    <div><strong>Type:</strong> ${projet.type}</div>
                    <div><strong>Surface:</strong> ${projet.surface ? `${formatNumber(projet.surface)} m²` : '-'}</div>
                    <div><strong>Montant travaux HT:</strong> ${formatCurrency(projet.montantTravauxHT)}</div>
                    <div><strong>Ratio:</strong> ${this.calculerRatio(projet.surface, projet.montantTravauxHT)}</div>
                    <div><strong>Année:</strong> ${projet.annee}</div>
                </div>

                ${projet.montantTravauxHT > 0 ? `
                    <div class="honoraires-summary">
                        <h4 class="font-semibold mb-2">Estimation honoraires (12%)</h4>
                        <div class="flex justify-between items-center">
                            <div class="text-2xl font-bold">${formatCurrency(honoraires.montant)}</div>
                            <div class="text-4xl font-bold text-brand">${honoraires.pourcentage}%</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderForm() {
        const { newProjet } = this.state;

        return `
            <div class="card mb-4">
                <h3 class="card-title mb-4">Nouvelle référence</h3>

                <div class="form-row mb-3">
                    <div class="form-group">
                        <label class="form-label">Nom du projet *</label>
                        <input
                            type="text"
                            id="ref-nom"
                            class="form-input"
                            value="${newProjet.nom}"
                            placeholder="Ex: Résidence des Pins"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Maître d'ouvrage / Client</label>
                        <input
                            type="text"
                            id="ref-maitreOuvrage"
                            class="form-input"
                            value="${newProjet.maitreOuvrage}"
                            placeholder="Ex: Ville de Paris"
                        />
                    </div>
                </div>

                <div class="form-row mb-3">
                    <div class="form-group">
                        <label class="form-label">Domaine *</label>
                        <select id="ref-domaine" class="form-input">
                            ${Object.keys(domaineTypes).map(d => `
                                <option value="${d}" ${newProjet.domaine === d ? 'selected' : ''}>${d}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type de projet *</label>
                        <select id="ref-type" class="form-input">
                            ${(domaineTypes[newProjet.domaine] || []).map(t => `
                                <option value="${t}" ${newProjet.type === t ? 'selected' : ''}>${t}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-row mb-3">
                    <div class="form-group">
                        <label class="form-label">Localisation *</label>
                        <input
                            type="text"
                            id="ref-localisation"
                            class="form-input"
                            value="${newProjet.localisation}"
                            placeholder="Ville"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Surface (m²)</label>
                        <input
                            type="number"
                            id="ref-surface"
                            class="form-input"
                            value="${newProjet.surface}"
                            placeholder="Ex: 3500"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Année</label>
                        <input
                            type="text"
                            id="ref-annee"
                            class="form-input"
                            value="${newProjet.annee}"
                            placeholder="2024"
                        />
                    </div>
                </div>

                <div class="form-group mb-4">
                    <label class="form-label">Montant travaux HT (€)</label>
                    <input
                        type="number"
                        id="ref-montantTravauxHT"
                        class="form-input"
                        value="${newProjet.montantTravauxHT}"
                        placeholder="Ex: 2800000"
                    />
                </div>

                <button id="btn-add-ref" class="btn btn-primary">
                    ${icons.plus} Ajouter la référence
                </button>
            </div>
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderReferencesPage(container) {
    const page = new ReferencesPage();
    page.mount(container);
    return page;
}
