/**
 * Page Nouvelle AO - Création d'un nouvel appel d'offres
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { router } from '../router.js';

const STORAGE_KEY = 'wiw-appels-offres';

// Types d'appels d'offres
const typesAO = [
    'Appel d\'offres ouvert',
    'Appel d\'offres restreint',
    'Procédure négociée',
    'Marché à procédure adaptée (MAPA)',
    'Dialogue compétitif',
    'Concours',
    'Partenariat d\'innovation'
];

// Statuts possibles
const statutsAO = [
    { value: 'veille', label: 'En veille', color: 'secondary' },
    { value: 'analyse', label: 'En analyse', color: 'info' },
    { value: 'preparation', label: 'En préparation', color: 'warning' },
    { value: 'soumis', label: 'Soumis', color: 'primary' },
    { value: 'gagne', label: 'Gagné', color: 'success' },
    { value: 'perdu', label: 'Perdu', color: 'danger' },
    { value: 'abandonne', label: 'Abandonné', color: 'secondary' }
];

// Domaines
const domaines = [
    'Architecture',
    'Urbanisme',
    'Paysage',
    'BET Structure',
    'BET Fluides',
    'BET Acoustique',
    'Économiste',
    'OPC',
    'AMO',
    'Autre'
];

export class NouvelleAOPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            formData: this.getEmptyFormData()
        };
    }

    getEmptyFormData() {
        return {
            // Informations générales
            titre: '',
            reference: '',
            type: 'Marché à procédure adaptée (MAPA)',
            domaine: 'Architecture',
            statut: 'veille',

            // Client / Maître d'ouvrage
            client: {
                nom: '',
                type: 'Public',
                contact: '',
                email: '',
                telephone: ''
            },

            // Dates importantes
            dates: {
                publication: '',
                limiteQuestions: '',
                limiteRemise: '',
                ouverturePlis: '',
                notification: ''
            },

            // Projet
            projet: {
                description: '',
                localisation: '',
                surface: '',
                montantEstime: '',
                dureeMarche: ''
            },

            // Documents
            documents: [],

            // Notes
            notes: '',

            // Équipe constituée
            equipe: []
        };
    }

    onMount() {
        this.bindEvents();
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // Form fields
        this.bindFormFields();

        // Submit
        container.querySelector('#btn-submit-ao')?.addEventListener('click', () => this.handleSubmit());

        // Cancel
        container.querySelector('#btn-cancel-ao')?.addEventListener('click', () => {
            router.navigate('/tenders');
        });

        // Save draft
        container.querySelector('#btn-save-draft')?.addEventListener('click', () => this.saveDraft());
    }

    bindFormFields() {
        const container = this.container;
        if (!container) return;

        // General info
        ['titre', 'reference', 'type', 'domaine', 'statut'].forEach(field => {
            const input = container.querySelector(`#ao-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateFormData(field, e.target.value);
                });
            }
        });

        // Client fields
        ['nom', 'type', 'contact', 'email', 'telephone'].forEach(field => {
            const input = container.querySelector(`#client-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateClientData(field, e.target.value);
                });
            }
        });

        // Dates
        ['publication', 'limiteQuestions', 'limiteRemise', 'ouverturePlis', 'notification'].forEach(field => {
            const input = container.querySelector(`#date-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateDatesData(field, e.target.value);
                });
            }
        });

        // Project
        ['description', 'localisation', 'surface', 'montantEstime', 'dureeMarche'].forEach(field => {
            const input = container.querySelector(`#projet-${field}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    let value = e.target.value;
                    if (field === 'surface' || field === 'montantEstime') {
                        value = parseFloat(value) || 0;
                    }
                    this.updateProjetData(field, value);
                });
            }
        });

        // Notes
        container.querySelector('#ao-notes')?.addEventListener('change', (e) => {
            this.updateFormData('notes', e.target.value);
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

    updateDatesData(field, value) {
        this.setState({
            formData: {
                ...this.state.formData,
                dates: {
                    ...this.state.formData.dates,
                    [field]: value
                }
            }
        });
    }

    updateProjetData(field, value) {
        this.setState({
            formData: {
                ...this.state.formData,
                projet: {
                    ...this.state.formData.projet,
                    [field]: value
                }
            }
        });
    }

    validateForm() {
        const { formData } = this.state;
        const errors = [];

        if (!formData.titre.trim()) {
            errors.push('Le titre est obligatoire');
        }

        if (!formData.client.nom.trim()) {
            errors.push('Le nom du client est obligatoire');
        }

        if (!formData.dates.limiteRemise) {
            errors.push('La date limite de remise est obligatoire');
        }

        return errors;
    }

    handleSubmit() {
        const errors = this.validateForm();

        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
            return;
        }

        // Save to storage
        const appels = storage.get(STORAGE_KEY, []);
        const newAO = {
            ...this.state.formData,
            id: Date.now(),
            dateCreation: new Date().toISOString()
        };

        appels.push(newAO);
        storage.set(STORAGE_KEY, appels);

        toast.success('Appel d\'offres créé avec succès');
        router.navigate('/tenders');
    }

    saveDraft() {
        storage.set('wiw-ao-draft', this.state.formData);
        toast.info('Brouillon sauvegardé');
    }

    render() {
        const { formData } = this.state;

        return `
            <div class="page-nouvelle-ao">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.plus}
                            Nouvel Appel d'Offres
                        </h1>
                        <p class="page-subtitle">
                            Créez un nouvel appel d'offres à suivre
                        </p>
                    </div>
                    <div class="page-actions">
                        <button id="btn-cancel-ao" class="btn btn-secondary">
                            Annuler
                        </button>
                        <button id="btn-save-draft" class="btn btn-secondary">
                            ${icons.save}
                            <span>Brouillon</span>
                        </button>
                        <button id="btn-submit-ao" class="btn btn-primary">
                            ${icons.check}
                            <span>Créer</span>
                        </button>
                    </div>
                </div>

                <div class="nouvelle-ao-form">
                    <!-- Informations générales -->
                    <div class="card mb-4">
                        <h3 class="card-title mb-4">${icons.clipboard} Informations générales</h3>

                        <div class="form-group mb-3">
                            <label class="form-label">Titre de l'appel d'offres *</label>
                            <input
                                type="text"
                                id="ao-titre"
                                class="form-input"
                                value="${formData.titre}"
                                placeholder="Ex: Construction d'un groupe scolaire"
                            />
                        </div>

                        <div class="form-row mb-3">
                            <div class="form-group">
                                <label class="form-label">Référence</label>
                                <input
                                    type="text"
                                    id="ao-reference"
                                    class="form-input"
                                    value="${formData.reference}"
                                    placeholder="Ex: AO-2024-001"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Type de procédure</label>
                                <select id="ao-type" class="form-input">
                                    ${typesAO.map(t => `
                                        <option value="${t}" ${formData.type === t ? 'selected' : ''}>${t}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Domaine</label>
                                <select id="ao-domaine" class="form-input">
                                    ${domaines.map(d => `
                                        <option value="${d}" ${formData.domaine === d ? 'selected' : ''}>${d}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Statut</label>
                                <select id="ao-statut" class="form-input">
                                    ${statutsAO.map(s => `
                                        <option value="${s.value}" ${formData.statut === s.value ? 'selected' : ''}>${s.label}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Client / Maître d'ouvrage -->
                    <div class="card mb-4">
                        <h3 class="card-title mb-4">${icons.building} Maître d'ouvrage</h3>

                        <div class="form-row mb-3">
                            <div class="form-group flex-2">
                                <label class="form-label">Nom / Raison sociale *</label>
                                <input
                                    type="text"
                                    id="client-nom"
                                    class="form-input"
                                    value="${formData.client.nom}"
                                    placeholder="Ex: Ville de Paris"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Type</label>
                                <select id="client-type" class="form-input">
                                    <option value="Public" ${formData.client.type === 'Public' ? 'selected' : ''}>Public</option>
                                    <option value="Privé" ${formData.client.type === 'Privé' ? 'selected' : ''}>Privé</option>
                                    <option value="Mixte" ${formData.client.type === 'Mixte' ? 'selected' : ''}>Mixte</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Contact</label>
                                <input
                                    type="text"
                                    id="client-contact"
                                    class="form-input"
                                    value="${formData.client.contact}"
                                    placeholder="Nom du contact"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input
                                    type="email"
                                    id="client-email"
                                    class="form-input"
                                    value="${formData.client.email}"
                                    placeholder="contact@example.fr"
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
                    </div>

                    <!-- Dates importantes -->
                    <div class="card mb-4">
                        <h3 class="card-title mb-4">${icons.calendar} Dates importantes</h3>

                        <div class="form-row mb-3">
                            <div class="form-group">
                                <label class="form-label">Date de publication</label>
                                <input
                                    type="date"
                                    id="date-publication"
                                    class="form-input"
                                    value="${formData.dates.publication}"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Limite questions</label>
                                <input
                                    type="date"
                                    id="date-limiteQuestions"
                                    class="form-input"
                                    value="${formData.dates.limiteQuestions}"
                                />
                            </div>
                        </div>

                        <div class="form-row mb-3">
                            <div class="form-group">
                                <label class="form-label">Date limite de remise *</label>
                                <input
                                    type="date"
                                    id="date-limiteRemise"
                                    class="form-input"
                                    value="${formData.dates.limiteRemise}"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Ouverture des plis</label>
                                <input
                                    type="date"
                                    id="date-ouverturePlis"
                                    class="form-input"
                                    value="${formData.dates.ouverturePlis}"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Date notification prévue</label>
                            <input
                                type="date"
                                id="date-notification"
                                class="form-input"
                                value="${formData.dates.notification}"
                                style="max-width: 250px;"
                            />
                        </div>
                    </div>

                    <!-- Projet -->
                    <div class="card mb-4">
                        <h3 class="card-title mb-4">${icons.fileText} Détails du projet</h3>

                        <div class="form-group mb-3">
                            <label class="form-label">Description du projet</label>
                            <textarea
                                id="projet-description"
                                class="form-input"
                                rows="4"
                                placeholder="Décrivez le projet..."
                            >${formData.projet.description}</textarea>
                        </div>

                        <div class="form-row mb-3">
                            <div class="form-group flex-2">
                                <label class="form-label">Localisation</label>
                                <input
                                    type="text"
                                    id="projet-localisation"
                                    class="form-input"
                                    value="${formData.projet.localisation}"
                                    placeholder="Adresse ou ville"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Surface (m²)</label>
                                <input
                                    type="number"
                                    id="projet-surface"
                                    class="form-input"
                                    value="${formData.projet.surface}"
                                    placeholder="3500"
                                />
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Montant estimé (€ HT)</label>
                                <input
                                    type="number"
                                    id="projet-montantEstime"
                                    class="form-input"
                                    value="${formData.projet.montantEstime}"
                                    placeholder="5000000"
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Durée du marché</label>
                                <input
                                    type="text"
                                    id="projet-dureeMarche"
                                    class="form-input"
                                    value="${formData.projet.dureeMarche}"
                                    placeholder="Ex: 24 mois"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="card mb-4">
                        <h3 class="card-title mb-4">${icons.edit} Notes</h3>

                        <div class="form-group">
                            <textarea
                                id="ao-notes"
                                class="form-input"
                                rows="4"
                                placeholder="Notes internes, points d'attention..."
                            >${formData.notes}</textarea>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="form-actions">
                        <button id="btn-cancel-ao" class="btn btn-secondary">
                            Annuler
                        </button>
                        <button id="btn-save-draft" class="btn btn-secondary">
                            ${icons.save} Sauvegarder brouillon
                        </button>
                        <button id="btn-submit-ao" class="btn btn-primary">
                            ${icons.check} Créer l'appel d'offres
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderNouvelleAOPage(container) {
    const page = new NouvelleAOPage();
    page.mount(container);
    return page;
}
