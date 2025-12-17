/**
 * Page Devis - Gestion des devis
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { formatCurrency, formatDate } from '../utils/format.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { t } from '../i18n/index.js';

const STORAGE_KEY = 'wiw-devis';

export class DevisPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            loading: false,
            devis: [],
            showForm: false,
            editingId: null,
            activeTab: 'informations',
            searchQuery: '',
            filterStatus: 'all',

            // Form data
            formData: this.getEmptyFormData()
        };
    }

    getEmptyFormData() {
        return {
            numero: '',
            date: new Date().toISOString().slice(0, 10),
            dateValidite: '',
            client: {
                nom: '',
                adresse: '',
                codePostal: '',
                ville: '',
                telephone: '',
                email: ''
            },
            lignes: [],
            chapitres: [],
            tauxHoraire: 0,
            rabais: 0,
            rabaisType: 'pourcentage',
            tracabilite: {
                dateRemis: '',
                dateCorrige: '',
                dateValide: '',
                dureeEstimee: 0,
                sommeHeuresPrevues: 0
            },
            photos: [],
            versionsPDF: [],
            notes: '',
            conditionsReglement: '30 jours',
            statut: 'brouillon'
        };
    }

    onMount() {
        this.loadData();
        this.bindEvents();
    }

    loadData() {
        const savedDevis = storage.get(STORAGE_KEY, []);
        this.setState({ devis: savedDevis, loading: false });
    }

    saveData() {
        storage.set(STORAGE_KEY, this.state.devis);
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // Toggle form
        container.querySelector('#btn-new-devis')?.addEventListener('click', () => {
            this.toggleForm();
        });

        // Search
        container.querySelector('#search-devis')?.addEventListener('input', (e) => {
            this.setState({ searchQuery: e.target.value });
        });

        // Filter
        container.querySelector('#filter-status')?.addEventListener('change', (e) => {
            this.setState({ filterStatus: e.target.value });
        });

        // Tabs
        container.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setState({ activeTab: e.currentTarget.dataset.tab });
            });
        });

        // Form inputs
        this.bindFormEvents();

        // List actions
        this.bindListEvents();
    }

    bindFormEvents() {
        const container = this.container;
        if (!container) return;

        // Basic info
        ['numero', 'date', 'dateValidite', 'notes', 'conditionsReglement', 'statut'].forEach(field => {
            const input = container.querySelector(`#devis-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateFormData(field, e.target.value);
                });
            }
        });

        // Client fields
        ['nom', 'adresse', 'codePostal', 'ville', 'telephone', 'email'].forEach(field => {
            const input = container.querySelector(`#client-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateClientData(field, e.target.value);
                });
            }
        });

        // Rabais
        container.querySelector('#devis-rabais')?.addEventListener('change', (e) => {
            this.updateFormData('rabais', parseFloat(e.target.value) || 0);
        });

        container.querySelector('#devis-rabaisType')?.addEventListener('change', (e) => {
            this.updateFormData('rabaisType', e.target.value);
        });

        // Form actions
        container.querySelector('#btn-save-devis')?.addEventListener('click', () => this.handleSubmit());
        container.querySelector('#btn-cancel-devis')?.addEventListener('click', () => this.resetForm());
        container.querySelector('#btn-generate-pdf')?.addEventListener('click', () => this.generatePDF());

        // Lines management
        container.querySelector('#btn-add-ligne')?.addEventListener('click', () => this.addLigne());
        container.querySelector('#btn-add-chapitre')?.addEventListener('click', () => this.addChapitre());

        // Lines inputs
        this.bindLignesEvents();
    }

    bindLignesEvents() {
        const container = this.container;
        if (!container) return;

        // Ligne fields
        container.querySelectorAll('[data-ligne-field]').forEach(input => {
            input.addEventListener('change', (e) => {
                const [index, field] = e.target.dataset.ligneField.split('|');
                this.updateLigne(parseInt(index), field, e.target.value);
            });
        });

        // Delete ligne
        container.querySelectorAll('[data-delete-ligne]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.deleteLigne);
                this.deleteLigne(index);
            });
        });

        // Chapitre fields
        container.querySelectorAll('[data-chapitre-field]').forEach(input => {
            input.addEventListener('change', (e) => {
                const [index, field] = e.target.dataset.chapitreField.split('|');
                this.updateChapitre(parseInt(index), field, e.target.value);
            });
        });

        // Delete chapitre
        container.querySelectorAll('[data-delete-chapitre]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.deleteChapitre);
                this.deleteChapitre(index);
            });
        });
    }

    bindListEvents() {
        const container = this.container;
        if (!container) return;

        // Edit
        container.querySelectorAll('[data-edit-devis]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleEdit(e.currentTarget.dataset.editDevis);
            });
        });

        // Duplicate
        container.querySelectorAll('[data-duplicate-devis]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDuplicate(e.currentTarget.dataset.duplicateDevis);
            });
        });

        // Delete
        container.querySelectorAll('[data-delete-devis]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDelete(e.currentTarget.dataset.deleteDevis);
            });
        });
    }

    updateFormData(field, value) {
        this.setState({
            formData: {
                ...this.state.formData,
                [field]: value
            }
        });
    }

    updateClientData(field, value) {
        this.setState({
            formData: {
                ...this.state.formData,
                client: {
                    ...this.state.formData.client,
                    [field]: value
                }
            }
        });
    }

    toggleForm() {
        if (this.state.showForm) {
            this.resetForm();
        } else {
            this.setState({ showForm: true, editingId: null, formData: this.getEmptyFormData() });
        }
    }

    handleEdit(id) {
        const devisToEdit = this.state.devis.find(d => d.id === parseInt(id));
        if (devisToEdit) {
            this.setState({
                formData: {
                    ...this.getEmptyFormData(),
                    ...devisToEdit,
                    chapitres: devisToEdit.chapitres || [],
                    lignes: devisToEdit.lignes || [],
                    tracabilite: devisToEdit.tracabilite || this.getEmptyFormData().tracabilite,
                    photos: devisToEdit.photos || [],
                    versionsPDF: devisToEdit.versionsPDF || []
                },
                editingId: parseInt(id),
                showForm: true,
                activeTab: 'informations'
            });
        }
    }

    handleDuplicate(id) {
        const devisToDuplicate = this.state.devis.find(d => d.id === parseInt(id));
        if (devisToDuplicate) {
            const nouveauDevis = {
                ...devisToDuplicate,
                id: Date.now(),
                numero: `${devisToDuplicate.numero}-COPIE`,
                date: new Date().toISOString().slice(0, 10),
                dateCreation: new Date().toISOString(),
                statut: 'brouillon',
                tracabilite: {
                    ...devisToDuplicate.tracabilite,
                    dateRemis: '',
                    dateCorrige: '',
                    dateValide: ''
                },
                versionsPDF: []
            };
            const devis = [...this.state.devis, nouveauDevis];
            this.setState({ devis });
            this.saveData();
            toast.success('Devis dupliqué');
        }
    }

    async handleDelete(id) {
        const confirmed = await modal.confirm({
            title: 'Supprimer le devis',
            message: 'Êtes-vous sûr de vouloir supprimer ce devis ?',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            const devis = this.state.devis.filter(d => d.id !== parseInt(id));
            this.setState({ devis });
            this.saveData();
            toast.info('Devis supprimé');
        }
    }

    handleSubmit() {
        const { formData, editingId, devis } = this.state;

        if (!formData.numero || !formData.client.nom) {
            toast.error('Veuillez remplir les champs obligatoires');
            return;
        }

        // Calculer les heures prévues
        const sommeHeures = formData.lignes
            .filter(l => l.unite === 'h')
            .reduce((acc, l) => acc + parseFloat(l.quantite || 0), 0);

        const devisData = {
            ...formData,
            tracabilite: {
                ...formData.tracabilite,
                sommeHeuresPrevues: sommeHeures
            }
        };

        let updatedDevis;
        if (editingId) {
            updatedDevis = devis.map(d =>
                d.id === editingId ? { ...devisData, id: editingId } : d
            );
            toast.success('Devis modifié');
        } else {
            const nouveauDevis = {
                ...devisData,
                id: Date.now(),
                dateCreation: new Date().toISOString()
            };
            updatedDevis = [...devis, nouveauDevis];
            toast.success('Devis créé');
        }

        this.setState({ devis: updatedDevis });
        this.saveData();
        this.resetForm();
    }

    resetForm() {
        this.setState({
            formData: this.getEmptyFormData(),
            editingId: null,
            showForm: false,
            activeTab: 'informations'
        });
    }

    // Lignes management
    addLigne() {
        const lignes = [...this.state.formData.lignes, {
            id: Date.now(),
            designation: '',
            unite: 'u',
            puHT: 0,
            quantite: 1,
            remise: 0,
            chapitreId: null,
            ordre: this.state.formData.lignes.length
        }];
        this.updateFormData('lignes', lignes);
    }

    updateLigne(index, field, value) {
        const lignes = [...this.state.formData.lignes];
        if (field === 'puHT' || field === 'quantite' || field === 'remise') {
            value = parseFloat(value) || 0;
        }
        lignes[index] = { ...lignes[index], [field]: value };
        this.updateFormData('lignes', lignes);
    }

    deleteLigne(index) {
        const lignes = this.state.formData.lignes.filter((_, i) => i !== index);
        this.updateFormData('lignes', lignes);
    }

    // Chapitres management
    addChapitre() {
        const chapitres = [...this.state.formData.chapitres, {
            id: Date.now(),
            titre: 'Nouveau chapitre',
            ordre: this.state.formData.chapitres.length
        }];
        this.updateFormData('chapitres', chapitres);
    }

    updateChapitre(index, field, value) {
        const chapitres = [...this.state.formData.chapitres];
        chapitres[index] = { ...chapitres[index], [field]: value };
        this.updateFormData('chapitres', chapitres);
    }

    deleteChapitre(index) {
        const chapitre = this.state.formData.chapitres[index];
        // Remove chapitre and unlink associated lines
        const chapitres = this.state.formData.chapitres.filter((_, i) => i !== index);
        const lignes = this.state.formData.lignes.map(l =>
            l.chapitreId === chapitre.id ? { ...l, chapitreId: null } : l
        );
        this.setState({
            formData: {
                ...this.state.formData,
                chapitres,
                lignes
            }
        });
    }

    // Calculations
    calculerTotalHT() {
        return this.state.formData.lignes.reduce((acc, ligne) => {
            const montantBrut = (ligne.puHT || 0) * (ligne.quantite || 0);
            const montantRemise = montantBrut * (1 - (ligne.remise || 0) / 100);
            return acc + montantRemise;
        }, 0);
    }

    calculerTotaux() {
        const totalHT = this.calculerTotalHT();
        const { rabais, rabaisType } = this.state.formData;

        const montantRabais = rabaisType === 'pourcentage'
            ? totalHT * (rabais / 100)
            : rabais;

        const totalHTRabais = totalHT - montantRabais;
        const montantTVA = totalHTRabais * 0.20;
        const totalTTC = totalHTRabais + montantTVA;

        return { totalHT, montantRabais, totalHTRabais, montantTVA, totalTTC };
    }

    generatePDF() {
        toast.info('Génération du PDF...');
        // Simulation
        setTimeout(() => {
            toast.success('PDF généré');
        }, 1000);
    }

    getFilteredDevis() {
        const { devis, searchQuery, filterStatus } = this.state;

        return devis.filter(d => {
            const matchSearch = !searchQuery ||
                d.numero?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.client?.nom?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchStatus = filterStatus === 'all' || d.statut === filterStatus;

            return matchSearch && matchStatus;
        }).sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    }

    getStatutBadge(statut) {
        const styles = {
            brouillon: 'badge-secondary',
            envoye: 'badge-info',
            accepte: 'badge-success',
            refuse: 'badge-danger'
        };
        const labels = {
            brouillon: 'Brouillon',
            envoye: 'Envoyé',
            accepte: 'Accepté',
            refuse: 'Refusé'
        };
        return `<span class="badge ${styles[statut] || 'badge-secondary'}">${labels[statut] || statut}</span>`;
    }

    render() {
        const { showForm, editingId, activeTab, searchQuery, filterStatus, formData } = this.state;
        const filteredDevis = this.getFilteredDevis();

        return `
            <div class="page-devis">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.fileText}
                            Devis
                        </h1>
                        <p class="page-subtitle">
                            Gérez vos devis et propositions commerciales
                        </p>
                    </div>
                    <div class="page-actions">
                        <button id="btn-new-devis" class="btn ${showForm ? 'btn-secondary' : 'btn-primary'}">
                            ${showForm ? icons.x : icons.plus}
                            <span>${showForm ? 'Fermer' : 'Nouveau devis'}</span>
                        </button>
                    </div>
                </div>

                ${showForm ? this.renderForm() : this.renderList(filteredDevis)}
            </div>
        `;
    }

    renderForm() {
        const { formData, activeTab, editingId } = this.state;
        const totaux = this.calculerTotaux();

        const tabs = [
            { id: 'informations', label: 'Informations', icon: icons.clipboard },
            { id: 'lignes', label: 'Lignes & Chapitres', icon: icons.list },
            { id: 'totaux', label: 'Totaux & TVA', icon: icons.euro },
            { id: 'tracabilite', label: 'Traçabilité', icon: icons.calendar }
        ];

        return `
            <div class="card">
                <h2 class="card-title mb-4">
                    ${editingId ? 'Modifier le devis' : 'Nouveau devis'}
                </h2>

                <!-- Tabs -->
                <div class="devis-tabs">
                    ${tabs.map(tab => `
                        <button class="devis-tab ${activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
                            ${tab.icon}
                            <span>${tab.label}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- Tab Content -->
                ${activeTab === 'informations' ? this.renderTabInformations() : ''}
                ${activeTab === 'lignes' ? this.renderTabLignes() : ''}
                ${activeTab === 'totaux' ? this.renderTabTotaux(totaux) : ''}
                ${activeTab === 'tracabilite' ? this.renderTabTracabilite() : ''}

                <!-- Actions -->
                <div class="form-actions">
                    <button id="btn-cancel-devis" class="btn btn-secondary">
                        Annuler
                    </button>
                    <button id="btn-generate-pdf" class="btn btn-success">
                        ${icons.download}
                        <span>Générer PDF</span>
                    </button>
                    <button id="btn-save-devis" class="btn btn-primary">
                        ${icons.save}
                        <span>${editingId ? 'Modifier' : 'Créer'}</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderTabInformations() {
        const { formData } = this.state;

        return `
            <div class="tab-content">
                <!-- Devis Info -->
                <div class="form-row mb-4">
                    <div class="form-group">
                        <label class="form-label">Numéro de devis *</label>
                        <input
                            type="text"
                            id="devis-numero"
                            class="form-input"
                            value="${formData.numero}"
                            placeholder="DEV-2025-001"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date du devis *</label>
                        <input
                            type="date"
                            id="devis-date"
                            class="form-input"
                            value="${formData.date}"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date de validité</label>
                        <input
                            type="date"
                            id="devis-dateValidite"
                            class="form-input"
                            value="${formData.dateValidite}"
                        />
                    </div>
                </div>

                <!-- Client Info -->
                <h3 class="form-section-title">Informations client</h3>
                <div class="form-row mb-4">
                    <div class="form-group">
                        <label class="form-label">Nom / Raison sociale *</label>
                        <input
                            type="text"
                            id="client-nom"
                            class="form-input"
                            value="${formData.client.nom}"
                            placeholder="Nom du client"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input
                            type="email"
                            id="client-email"
                            class="form-input"
                            value="${formData.client.email}"
                            placeholder="email@exemple.fr"
                        />
                    </div>
                </div>
                <div class="form-group mb-4">
                    <label class="form-label">Adresse</label>
                    <input
                        type="text"
                        id="client-adresse"
                        class="form-input"
                        value="${formData.client.adresse}"
                        placeholder="Adresse complète"
                    />
                </div>
                <div class="form-row mb-4">
                    <div class="form-group">
                        <label class="form-label">Code Postal</label>
                        <input
                            type="text"
                            id="client-codePostal"
                            class="form-input"
                            value="${formData.client.codePostal}"
                            placeholder="75001"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ville</label>
                        <input
                            type="text"
                            id="client-ville"
                            class="form-input"
                            value="${formData.client.ville}"
                            placeholder="Paris"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <input
                            type="tel"
                            id="client-telephone"
                            class="form-input"
                            value="${formData.client.telephone}"
                            placeholder="01 23 45 67 89"
                        />
                    </div>
                </div>

                <!-- Options -->
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Notes / Observations</label>
                        <textarea
                            id="devis-notes"
                            class="form-input"
                            rows="3"
                            placeholder="Notes internes ou à destination du client..."
                        >${formData.notes}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Conditions de règlement</label>
                        <select id="devis-conditionsReglement" class="form-input">
                            <option value="À réception" ${formData.conditionsReglement === 'À réception' ? 'selected' : ''}>À réception</option>
                            <option value="15 jours" ${formData.conditionsReglement === '15 jours' ? 'selected' : ''}>15 jours</option>
                            <option value="30 jours" ${formData.conditionsReglement === '30 jours' ? 'selected' : ''}>30 jours</option>
                            <option value="45 jours" ${formData.conditionsReglement === '45 jours' ? 'selected' : ''}>45 jours</option>
                            <option value="60 jours" ${formData.conditionsReglement === '60 jours' ? 'selected' : ''}>60 jours</option>
                        </select>

                        <label class="form-label mt-3">Statut</label>
                        <select id="devis-statut" class="form-input">
                            <option value="brouillon" ${formData.statut === 'brouillon' ? 'selected' : ''}>Brouillon</option>
                            <option value="envoye" ${formData.statut === 'envoye' ? 'selected' : ''}>Envoyé</option>
                            <option value="accepte" ${formData.statut === 'accepte' ? 'selected' : ''}>Accepté</option>
                            <option value="refuse" ${formData.statut === 'refuse' ? 'selected' : ''}>Refusé</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    renderTabLignes() {
        const { formData } = this.state;

        return `
            <div class="tab-content">
                <!-- Actions -->
                <div class="flex gap-2 mb-4">
                    <button id="btn-add-chapitre" class="btn btn-secondary btn-sm">
                        ${icons.folder}
                        <span>Ajouter chapitre</span>
                    </button>
                    <button id="btn-add-ligne" class="btn btn-primary btn-sm">
                        ${icons.plus}
                        <span>Ajouter ligne</span>
                    </button>
                </div>

                <!-- Chapitres -->
                ${formData.chapitres.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2">Chapitres</h4>
                        ${formData.chapitres.map((chapitre, index) => `
                            <div class="devis-chapitre flex items-center justify-between mb-2">
                                <input
                                    type="text"
                                    class="form-input form-input-sm flex-1"
                                    data-chapitre-field="${index}|titre"
                                    value="${chapitre.titre}"
                                    placeholder="Titre du chapitre"
                                />
                                <button class="btn-icon btn-icon-sm btn-danger ml-2" data-delete-chapitre="${index}">
                                    ${icons.trash}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Lines Table -->
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Désignation</th>
                                <th class="text-center" style="width: 80px;">Unité</th>
                                <th class="text-right" style="width: 100px;">PU HT</th>
                                <th class="text-center" style="width: 80px;">Qté</th>
                                <th class="text-center" style="width: 80px;">Remise %</th>
                                <th class="text-right" style="width: 100px;">Montant HT</th>
                                <th style="width: 50px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formData.lignes.length === 0 ? `
                                <tr>
                                    <td colspan="7" class="text-center text-muted py-4">
                                        Aucune ligne. Cliquez sur "Ajouter ligne" pour commencer.
                                    </td>
                                </tr>
                            ` : formData.lignes.map((ligne, index) => {
                                const montant = (ligne.puHT || 0) * (ligne.quantite || 0) * (1 - (ligne.remise || 0) / 100);
                                return `
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                class="form-input form-input-sm"
                                                data-ligne-field="${index}|designation"
                                                value="${ligne.designation || ''}"
                                                placeholder="Désignation"
                                            />
                                        </td>
                                        <td>
                                            <select class="form-input form-input-sm" data-ligne-field="${index}|unite">
                                                <option value="u" ${ligne.unite === 'u' ? 'selected' : ''}>u</option>
                                                <option value="h" ${ligne.unite === 'h' ? 'selected' : ''}>h</option>
                                                <option value="m²" ${ligne.unite === 'm²' ? 'selected' : ''}>m²</option>
                                                <option value="ml" ${ligne.unite === 'ml' ? 'selected' : ''}>ml</option>
                                                <option value="forfait" ${ligne.unite === 'forfait' ? 'selected' : ''}>forfait</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                class="form-input form-input-sm text-right"
                                                data-ligne-field="${index}|puHT"
                                                value="${ligne.puHT || 0}"
                                                step="0.01"
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                class="form-input form-input-sm text-center"
                                                data-ligne-field="${index}|quantite"
                                                value="${ligne.quantite || 1}"
                                                step="0.01"
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                class="form-input form-input-sm text-center"
                                                data-ligne-field="${index}|remise"
                                                value="${ligne.remise || 0}"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                            />
                                        </td>
                                        <td class="text-right font-medium">
                                            ${formatCurrency(montant)}
                                        </td>
                                        <td>
                                            <button class="btn-icon btn-icon-sm btn-danger" data-delete-ligne="${index}">
                                                ${icons.trash}
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderTabTotaux(totaux) {
        const { formData } = this.state;

        return `
            <div class="tab-content">
                <!-- Rabais -->
                <div class="form-row mb-4">
                    <div class="form-group">
                        <label class="form-label">Rabais</label>
                        <input
                            type="number"
                            id="devis-rabais"
                            class="form-input"
                            value="${formData.rabais}"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type de rabais</label>
                        <select id="devis-rabaisType" class="form-input">
                            <option value="pourcentage" ${formData.rabaisType === 'pourcentage' ? 'selected' : ''}>Pourcentage (%)</option>
                            <option value="montant" ${formData.rabaisType === 'montant' ? 'selected' : ''}>Montant fixe (€)</option>
                        </select>
                    </div>
                </div>

                <!-- Totaux -->
                <div class="card bg-muted">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-muted text-sm">Total HT</div>
                            <div class="text-xl font-bold">${formatCurrency(totaux.totalHT)}</div>
                        </div>
                        ${formData.rabais > 0 ? `
                            <div>
                                <div class="text-muted text-sm">Rabais ${formData.rabaisType === 'pourcentage' ? `(${formData.rabais}%)` : ''}</div>
                                <div class="text-xl font-bold text-danger">- ${formatCurrency(totaux.montantRabais)}</div>
                            </div>
                            <div>
                                <div class="text-muted text-sm">Total HT après rabais</div>
                                <div class="text-xl font-bold">${formatCurrency(totaux.totalHTRabais)}</div>
                            </div>
                        ` : ''}
                        <div>
                            <div class="text-muted text-sm">TVA (20%)</div>
                            <div class="text-xl font-bold">${formatCurrency(totaux.montantTVA)}</div>
                        </div>
                        <div class="col-span-2">
                            <div class="text-muted text-sm">Total TTC</div>
                            <div class="text-3xl font-bold text-brand">${formatCurrency(totaux.totalTTC)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTabTracabilite() {
        const { formData } = this.state;
        const tracabilite = formData.tracabilite || {};

        return `
            <div class="tab-content">
                <div class="form-row mb-4">
                    <div class="form-group">
                        <label class="form-label">Date remis</label>
                        <input
                            type="date"
                            class="form-input"
                            value="${tracabilite.dateRemis || ''}"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date corrigé</label>
                        <input
                            type="date"
                            class="form-input"
                            value="${tracabilite.dateCorrige || ''}"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date validé</label>
                        <input
                            type="date"
                            class="form-input"
                            value="${tracabilite.dateValide || ''}"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Durée estimée (jours)</label>
                        <input
                            type="number"
                            class="form-input"
                            value="${tracabilite.dureeEstimee || 0}"
                            min="0"
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Somme heures prévues</label>
                        <input
                            type="number"
                            class="form-input"
                            value="${tracabilite.sommeHeuresPrevues || 0}"
                            disabled
                        />
                        <p class="form-hint">Calculé automatiquement à partir des lignes en heures</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderList(filteredDevis) {
        const { searchQuery, filterStatus } = this.state;

        return `
            <!-- Filters -->
            <div class="card mb-4">
                <div class="data-table-header">
                    <div class="data-table-search">
                        <span class="data-table-search-icon">${icons.search}</span>
                        <input
                            type="text"
                            id="search-devis"
                            class="form-input"
                            placeholder="Rechercher..."
                            value="${searchQuery}"
                        />
                    </div>
                    <div class="data-table-filters">
                        <select id="filter-status" class="form-input">
                            <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>Tous les statuts</option>
                            <option value="brouillon" ${filterStatus === 'brouillon' ? 'selected' : ''}>Brouillon</option>
                            <option value="envoye" ${filterStatus === 'envoye' ? 'selected' : ''}>Envoyé</option>
                            <option value="accepte" ${filterStatus === 'accepte' ? 'selected' : ''}>Accepté</option>
                            <option value="refuse" ${filterStatus === 'refuse' ? 'selected' : ''}>Refusé</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- List -->
            ${filteredDevis.length === 0 ? `
                <div class="card text-center py-8">
                    <div class="text-4xl mb-4">${icons.fileText}</div>
                    <p class="text-xl font-semibold mb-2">Aucun devis</p>
                    <p class="text-muted">Créez votre premier devis en cliquant sur "Nouveau devis"</p>
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th class="hide-mobile">Client</th>
                                <th class="hide-tablet">Date</th>
                                <th class="text-right">Montant HT</th>
                                <th class="text-center hide-tablet">Statut</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredDevis.map(d => {
                                const totalHT = d.lignes?.reduce((acc, ligne) => {
                                    const montantBrut = (ligne.puHT || 0) * (ligne.quantite || 0);
                                    const montantRemise = montantBrut * (1 - (ligne.remise || 0) / 100);
                                    return acc + montantRemise;
                                }, 0) || 0;

                                return `
                                    <tr>
                                        <td>
                                            <div class="font-semibold">${d.numero}</div>
                                            <div class="text-xs text-muted show-mobile">${d.client?.nom || '-'}</div>
                                            <div class="text-xs text-muted">${d.lignes?.length || 0} ligne${(d.lignes?.length || 0) > 1 ? 's' : ''}</div>
                                        </td>
                                        <td class="hide-mobile">
                                            <div class="font-medium">${d.client?.nom || '-'}</div>
                                            <div class="text-sm text-muted">${d.client?.ville || ''}</div>
                                        </td>
                                        <td class="text-muted hide-tablet">
                                            ${d.date ? formatDate(d.date) : '-'}
                                        </td>
                                        <td class="text-right font-semibold">
                                            ${formatCurrency(totalHT)}
                                        </td>
                                        <td class="text-center hide-tablet">
                                            ${this.getStatutBadge(d.statut)}
                                        </td>
                                        <td>
                                            <div class="flex items-center justify-center gap-1">
                                                <button class="btn btn-sm btn-primary" data-edit-devis="${d.id}" title="Modifier">
                                                    ${icons.edit}
                                                </button>
                                                <button class="btn btn-sm btn-success hide-mobile" data-duplicate-devis="${d.id}" title="Dupliquer">
                                                    ${icons.copy}
                                                </button>
                                                <button class="btn btn-sm btn-danger" data-delete-devis="${d.id}" title="Supprimer">
                                                    ${icons.trash}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderDevisPage(container) {
    const page = new DevisPage();
    page.mount(container);
    return page;
}
