/**
 * Page Company - Gestion des clients et maîtres d'ouvrage
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { formatCurrency } from '../utils/format.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';

const STORAGE_KEY = 'wiw-clients';

// Données par défaut
const defaultClients = [
    {
        id: 1,
        nom: 'Ville de Lyon',
        type: 'Public',
        contact: {
            responsable: 'M. Jean Dupont',
            fonction: 'Directeur Patrimoine',
            telephone: '04 72 10 30 30',
            portable: '06 12 34 56 78',
            email: 'j.dupont@lyon.fr',
            adresse: '1 place de la Comédie',
            codePostal: '69001',
            ville: 'Lyon'
        },
        informationsLegales: {
            siret: '12345678901234',
            tva: 'FR12345678901',
            formeJuridique: 'Collectivité territoriale',
            capital: null
        },
        projets: [
            { id: 1, nom: 'Résidence Les Oliviers', statut: 'En cours', montant: 3500000 },
            { id: 2, nom: 'École Primaire Victor Hugo', statut: 'Terminé', montant: 8500000 }
        ],
        notes: 'Client prioritaire, relation de confiance établie depuis 2020'
    },
    {
        id: 2,
        nom: 'SCI Immobilière Rivoli',
        type: 'Privé',
        contact: {
            responsable: 'M. Marc Dubois',
            fonction: 'Gérant',
            telephone: '01 45 67 89 01',
            portable: '06 23 45 67 89',
            email: 'm.dubois@sci-rivoli.fr',
            adresse: '25 avenue de Rivoli',
            codePostal: '75001',
            ville: 'Paris'
        },
        informationsLegales: {
            siret: '98765432109876',
            tva: 'FR98765432109',
            formeJuridique: 'SCI',
            capital: 500000
        },
        projets: [
            { id: 3, nom: 'Centre Commercial Rivoli', statut: 'En cours', montant: 12000000 }
        ],
        notes: 'Client récurrent, projets de grande envergure'
    }
];

export class CompanyPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            loading: false,
            clients: [],
            viewMode: 'liste', // 'liste', 'projets'
            selectedClient: null,
            editingClient: null,
            searchQuery: ''
        };
    }

    onMount() {
        this.loadData();
        this.bindEvents();
    }

    loadData() {
        const savedClients = storage.get(STORAGE_KEY, defaultClients);
        this.setState({ clients: savedClients, loading: false });
    }

    saveData() {
        storage.set(STORAGE_KEY, this.state.clients);
    }

    getEmptyClient() {
        return {
            nom: '',
            type: 'Privé',
            contact: {
                responsable: '',
                fonction: '',
                telephone: '',
                portable: '',
                email: '',
                adresse: '',
                codePostal: '',
                ville: ''
            },
            informationsLegales: {
                siret: '',
                tva: '',
                formeJuridique: '',
                capital: null
            },
            projets: [],
            notes: ''
        };
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // View mode
        container.querySelectorAll('[data-view-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setState({ viewMode: e.currentTarget.dataset.viewMode });
            });
        });

        // Search
        container.querySelector('#search-client')?.addEventListener('input', (e) => {
            this.setState({ searchQuery: e.target.value });
        });

        // New client
        container.querySelector('#btn-new-client')?.addEventListener('click', () => {
            this.setState({ editingClient: this.getEmptyClient() });
        });

        // Client cards
        this.bindClientEvents();

        // Form events
        this.bindFormEvents();
    }

    bindClientEvents() {
        const container = this.container;
        if (!container) return;

        // Select client
        container.querySelectorAll('[data-select-client]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('button')) return; // Ignore button clicks
                const id = parseInt(e.currentTarget.dataset.selectClient);
                const client = this.state.clients.find(c => c.id === id);
                this.setState({ selectedClient: client });
            });
        });

        // Edit client
        container.querySelectorAll('[data-edit-client]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(e.currentTarget.dataset.editClient);
                const client = this.state.clients.find(c => c.id === id);
                this.setState({ editingClient: { ...client } });
            });
        });

        // Delete client
        container.querySelectorAll('[data-delete-client]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteClient(parseInt(e.currentTarget.dataset.deleteClient));
            });
        });

        // Close selected
        container.querySelector('#btn-close-selected')?.addEventListener('click', () => {
            this.setState({ selectedClient: null });
        });
    }

    bindFormEvents() {
        const container = this.container;
        if (!container) return;

        // Form fields
        container.querySelector('#client-nom')?.addEventListener('input', (e) => {
            this.updateEditingClient('nom', e.target.value);
        });

        container.querySelector('#client-type')?.addEventListener('change', (e) => {
            this.updateEditingClient('type', e.target.value);
        });

        // Contact fields
        ['responsable', 'fonction', 'telephone', 'portable', 'email', 'adresse', 'codePostal', 'ville'].forEach(field => {
            container.querySelector(`#contact-${field}`)?.addEventListener('input', (e) => {
                this.updateEditingClientContact(field, e.target.value);
            });
        });

        // Legal fields
        ['siret', 'tva', 'formeJuridique'].forEach(field => {
            container.querySelector(`#legal-${field}`)?.addEventListener('input', (e) => {
                this.updateEditingClientLegal(field, e.target.value);
            });
        });

        container.querySelector('#legal-capital')?.addEventListener('input', (e) => {
            this.updateEditingClientLegal('capital', parseFloat(e.target.value) || null);
        });

        container.querySelector('#client-notes')?.addEventListener('input', (e) => {
            this.updateEditingClient('notes', e.target.value);
        });

        // Save/Cancel
        container.querySelector('#btn-save-client')?.addEventListener('click', () => this.saveClient());
        container.querySelector('#btn-cancel-client')?.addEventListener('click', () => {
            this.setState({ editingClient: null });
        });
    }

    updateEditingClient(field, value) {
        this.setState({
            editingClient: {
                ...this.state.editingClient,
                [field]: value
            }
        });
    }

    updateEditingClientContact(field, value) {
        this.setState({
            editingClient: {
                ...this.state.editingClient,
                contact: {
                    ...this.state.editingClient.contact,
                    [field]: value
                }
            }
        });
    }

    updateEditingClientLegal(field, value) {
        this.setState({
            editingClient: {
                ...this.state.editingClient,
                informationsLegales: {
                    ...this.state.editingClient.informationsLegales,
                    [field]: value
                }
            }
        });
    }

    saveClient() {
        const { editingClient, clients } = this.state;

        if (!editingClient.nom?.trim()) {
            toast.error('Le nom est obligatoire');
            return;
        }

        let updatedClients;
        if (editingClient.id) {
            updatedClients = clients.map(c => c.id === editingClient.id ? editingClient : c);
            toast.success('Client modifié');
        } else {
            const newClient = {
                ...editingClient,
                id: Date.now(),
                projets: []
            };
            updatedClients = [...clients, newClient];
            toast.success('Client ajouté');
        }

        this.setState({
            clients: updatedClients,
            editingClient: null
        });
        this.saveData();
    }

    async deleteClient(id) {
        const client = this.state.clients.find(c => c.id === id);
        const confirmed = await modal.confirm({
            title: 'Supprimer le client',
            message: `Êtes-vous sûr de vouloir supprimer "${client?.nom}" ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            const clients = this.state.clients.filter(c => c.id !== id);
            this.setState({
                clients,
                selectedClient: this.state.selectedClient?.id === id ? null : this.state.selectedClient
            });
            this.saveData();
            toast.info('Client supprimé');
        }
    }

    getFilteredClients() {
        const { clients, searchQuery } = this.state;

        return clients.filter(client => {
            const matchSearch = !searchQuery.trim() ||
                client.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.contact?.responsable?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.type?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSearch;
        });
    }

    render() {
        const { viewMode, selectedClient, editingClient, searchQuery } = this.state;
        const filteredClients = this.getFilteredClients();

        return `
            <div class="page-company">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.building}
                            Clients & Maîtres d'Ouvrage
                        </h1>
                        <p class="page-subtitle">
                            ${this.state.clients.length} client${this.state.clients.length > 1 ? 's' : ''} enregistré${this.state.clients.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <div class="page-actions">
                        <button class="btn ${viewMode === 'liste' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="liste">
                            Liste clients
                        </button>
                        <button class="btn ${viewMode === 'projets' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="projets">
                            Projets
                        </button>
                        <button id="btn-new-client" class="btn btn-primary">
                            ${icons.plus} Nouveau client
                        </button>
                    </div>
                </div>

                ${editingClient ? this.renderForm() : ''}

                <!-- Search -->
                <div class="card mb-4">
                    <div class="data-table-search">
                        <span class="data-table-search-icon">${icons.search}</span>
                        <input
                            type="text"
                            id="search-client"
                            class="form-input"
                            placeholder="Rechercher par nom, responsable, email, type..."
                            value="${searchQuery}"
                        />
                    </div>
                </div>

                ${viewMode === 'liste' ? this.renderListe(filteredClients) : this.renderProjets()}

                ${selectedClient && viewMode === 'liste' ? this.renderSelectedClient() : ''}
            </div>
        `;
    }

    renderForm() {
        const client = this.state.editingClient;
        if (!client) return '';

        return `
            <div class="card mb-4" style="background: var(--brand-alpha-10);">
                <h3 class="card-title mb-4">
                    ${client.id ? 'Modifier le client' : 'Nouveau client'}
                </h3>

                <div class="form-row mb-3">
                    <div class="form-group flex-2">
                        <label class="form-label">Nom / Raison sociale *</label>
                        <input
                            type="text"
                            id="client-nom"
                            class="form-input"
                            value="${client.nom}"
                            placeholder="Ex: Ville de Lyon, SCI..."
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type *</label>
                        <select id="client-type" class="form-input">
                            <option value="Privé" ${client.type === 'Privé' ? 'selected' : ''}>Privé</option>
                            <option value="Public" ${client.type === 'Public' ? 'selected' : ''}>Public</option>
                            <option value="Mixte" ${client.type === 'Mixte' ? 'selected' : ''}>Mixte</option>
                        </select>
                    </div>
                </div>

                <!-- Contact -->
                <div class="form-section mb-4">
                    <h4 class="form-section-title">Contact</h4>
                    <div class="form-row mb-3">
                        <div class="form-group">
                            <label class="form-label">Responsable</label>
                            <input type="text" id="contact-responsable" class="form-input" value="${client.contact?.responsable || ''}" placeholder="M. Jean Dupont" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Fonction</label>
                            <input type="text" id="contact-fonction" class="form-input" value="${client.contact?.fonction || ''}" placeholder="Directeur" />
                        </div>
                    </div>
                    <div class="form-row mb-3">
                        <div class="form-group">
                            <label class="form-label">Téléphone fixe</label>
                            <input type="tel" id="contact-telephone" class="form-input" value="${client.contact?.telephone || ''}" placeholder="01 23 45 67 89" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Portable</label>
                            <input type="tel" id="contact-portable" class="form-input" value="${client.contact?.portable || ''}" placeholder="06 12 34 56 78" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="contact-email" class="form-input" value="${client.contact?.email || ''}" placeholder="contact@example.fr" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group flex-2">
                            <label class="form-label">Adresse</label>
                            <input type="text" id="contact-adresse" class="form-input" value="${client.contact?.adresse || ''}" placeholder="1 rue de la République" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Code postal</label>
                            <input type="text" id="contact-codePostal" class="form-input" value="${client.contact?.codePostal || ''}" placeholder="69001" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Ville</label>
                            <input type="text" id="contact-ville" class="form-input" value="${client.contact?.ville || ''}" placeholder="Lyon" />
                        </div>
                    </div>
                </div>

                <!-- Informations légales -->
                <div class="form-section mb-4">
                    <h4 class="form-section-title">Informations légales</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">SIRET</label>
                            <input type="text" id="legal-siret" class="form-input" value="${client.informationsLegales?.siret || ''}" placeholder="12345678901234" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">N° TVA</label>
                            <input type="text" id="legal-tva" class="form-input" value="${client.informationsLegales?.tva || ''}" placeholder="FR12345678901" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Forme juridique</label>
                            <input type="text" id="legal-formeJuridique" class="form-input" value="${client.informationsLegales?.formeJuridique || ''}" placeholder="SARL, SCI..." />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Capital social (€)</label>
                            <input type="number" id="legal-capital" class="form-input" value="${client.informationsLegales?.capital || ''}" placeholder="500000" />
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="form-group mb-4">
                    <label class="form-label">Notes</label>
                    <textarea id="client-notes" class="form-input" rows="3" placeholder="Notes sur ce client...">${client.notes || ''}</textarea>
                </div>

                <div class="form-actions">
                    <button id="btn-cancel-client" class="btn btn-secondary">Annuler</button>
                    <button id="btn-save-client" class="btn btn-primary">
                        ${icons.save} Enregistrer
                    </button>
                </div>
            </div>
        `;
    }

    renderListe(clients) {
        if (clients.length === 0) {
            return `
                <div class="card text-center py-8">
                    <div class="text-4xl mb-4">${icons.building}</div>
                    <p class="text-xl font-semibold mb-2">Aucun client trouvé</p>
                    <p class="text-muted">Ajoutez votre premier client en cliquant sur "Nouveau client"</p>
                </div>
            `;
        }

        return `
            <div class="card">
                <div class="client-list">
                    ${clients.map(client => `
                        <div class="client-card ${this.state.selectedClient?.id === client.id ? 'active' : ''}" data-select-client="${client.id}">
                            <div class="client-card-header">
                                <div class="client-card-title">
                                    <h4>${client.nom}</h4>
                                    <span class="badge badge-info">${client.type}</span>
                                </div>
                                <div class="client-card-actions">
                                    <button class="btn btn-sm btn-secondary" data-edit-client="${client.id}">
                                        ${icons.edit}
                                    </button>
                                    <button class="btn btn-sm btn-danger" data-delete-client="${client.id}">
                                        ${icons.trash}
                                    </button>
                                </div>
                            </div>
                            <div class="client-card-content">
                                <div class="client-info-grid">
                                    <div><strong>Responsable:</strong> ${client.contact?.responsable || '-'}</div>
                                    ${client.contact?.telephone ? `<div><strong>Tél:</strong> ${client.contact.telephone}</div>` : ''}
                                    <div><strong>Email:</strong> ${client.contact?.email || '-'}</div>
                                    <div><strong>Adresse:</strong> ${client.contact?.adresse ? `${client.contact.adresse}, ${client.contact.codePostal} ${client.contact.ville}` : '-'}</div>
                                </div>
                                ${client.projets?.length > 0 ? `
                                    <div class="client-projects mt-3">
                                        <strong class="text-sm">Projets:</strong>
                                        <div class="flex flex-wrap gap-1 mt-1">
                                            ${client.projets.map(p => `
                                                <span class="badge badge-info">${p.nom} (${p.statut})</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                ${client.notes ? `
                                    <div class="client-notes mt-3 text-sm text-muted italic">
                                        ${client.notes}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderProjets() {
        const clients = this.state.clients.filter(c => c.projets?.length > 0);

        if (clients.length === 0) {
            return `
                <div class="card text-center py-8">
                    <p class="text-muted">Aucun projet associé aux clients</p>
                </div>
            `;
        }

        return `
            <div class="card">
                <h3 class="card-title mb-4">Projets par client</h3>
                <div class="projects-by-client">
                    ${clients.map(client => `
                        <div class="project-group mb-4">
                            <h4 class="font-semibold mb-2">${client.nom}</h4>
                            <div class="project-list">
                                ${client.projets.map(projet => `
                                    <div class="project-item">
                                        <div class="project-name">${projet.nom}</div>
                                        <div class="project-meta">
                                            <span class="badge ${projet.statut === 'Terminé' ? 'badge-success' : 'badge-info'}">${projet.statut}</span>
                                            <span class="text-muted">${formatCurrency(projet.montant)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSelectedClient() {
        const client = this.state.selectedClient;
        if (!client) return '';

        return `
            <div class="card mt-4">
                <div class="card-header">
                    <h3 class="card-title">${client.nom}</h3>
                    <div class="flex gap-2">
                        <button class="btn btn-secondary" data-edit-client="${client.id}">
                            ${icons.edit} Modifier
                        </button>
                        <button id="btn-close-selected" class="btn btn-secondary">
                            Fermer
                        </button>
                    </div>
                </div>

                <!-- Contact -->
                <div class="mb-4">
                    <h4 class="font-semibold mb-3">Contact</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <div class="text-sm text-muted">Responsable</div>
                            <div class="font-semibold">${client.contact?.responsable || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm text-muted">Fonction</div>
                            <div class="font-semibold">${client.contact?.fonction || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm text-muted">Téléphone</div>
                            <div>${client.contact?.telephone || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm text-muted">Portable</div>
                            <div>${client.contact?.portable || '-'}</div>
                        </div>
                        <div>
                            <div class="text-sm text-muted">Email</div>
                            <div>
                                ${client.contact?.email ? `<a href="mailto:${client.contact.email}" class="text-brand">${client.contact.email}</a>` : '-'}
                            </div>
                        </div>
                        <div>
                            <div class="text-sm text-muted">Adresse</div>
                            <div>${client.contact?.adresse ? `${client.contact.adresse}, ${client.contact.codePostal} ${client.contact.ville}` : '-'}</div>
                        </div>
                    </div>
                </div>

                <!-- Informations légales -->
                ${client.informationsLegales ? `
                    <div class="mb-4">
                        <h4 class="font-semibold mb-3">Informations légales</h4>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${client.informationsLegales.siret ? `
                                <div>
                                    <div class="text-sm text-muted">SIRET</div>
                                    <div class="font-semibold">${client.informationsLegales.siret}</div>
                                </div>
                            ` : ''}
                            ${client.informationsLegales.tva ? `
                                <div>
                                    <div class="text-sm text-muted">N° TVA</div>
                                    <div class="font-semibold">${client.informationsLegales.tva}</div>
                                </div>
                            ` : ''}
                            ${client.informationsLegales.formeJuridique ? `
                                <div>
                                    <div class="text-sm text-muted">Forme juridique</div>
                                    <div class="font-semibold">${client.informationsLegales.formeJuridique}</div>
                                </div>
                            ` : ''}
                            ${client.informationsLegales.capital ? `
                                <div>
                                    <div class="text-sm text-muted">Capital social</div>
                                    <div class="font-semibold">${formatCurrency(client.informationsLegales.capital)}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- Projets -->
                ${client.projets?.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="font-semibold mb-3">Projets associés (${client.projets.length})</h4>
                        <div class="project-list-detailed">
                            ${client.projets.map(projet => `
                                <div class="project-item-detailed">
                                    <div class="font-semibold">${projet.nom}</div>
                                    <div class="text-sm text-muted">
                                        Statut: ${projet.statut} | Montant: ${formatCurrency(projet.montant)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Notes -->
                ${client.notes ? `
                    <div>
                        <h4 class="font-semibold mb-3">Notes</h4>
                        <div class="notes-box">
                            ${client.notes}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderCompanyPage(container) {
    const page = new CompanyPage();
    page.mount(container);
    return page;
}
