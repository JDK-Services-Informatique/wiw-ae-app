/**
 * Page Team (Équipe) - WiW AE+
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { t } from '../i18n/index.js';
import { equipeApi } from '../api/index.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { formatCurrency } from '../utils/format.js';
import { debounce } from '../utils/dom.js';
import storage from '../utils/storage.js';

export class TeamPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            members: [],
            filteredMembers: [],
            searchQuery: '',
            viewMode: 'liste', // 'liste', 'moyens', 'justificatifs'
            showForm: false,
            editingMember: null
        };
    }

    getDefaultMember() {
        return {
            nom: '',
            fonction: '',
            email: '',
            telephone: '',
            portable: '',
            metier: 'Architecture',
            competences: [],
            tauxHoraire: 0,
            statut: 'actif'
        };
    }

    render() {
        const { loading, filteredMembers, searchQuery, viewMode, showForm, editingMember } = this.state;

        return `
            <div class="page">
                <div class="page-header">
                    <div>
                        <h1 class="page-title">${t('team.title')}</h1>
                        <p class="page-subtitle">${filteredMembers.length} membre${filteredMembers.length > 1 ? 's' : ''} dans l'équipe</p>
                    </div>
                    <div class="page-actions">
                        <div class="flex gap-sm">
                            ${this.renderViewTabs()}
                        </div>
                        <button class="btn btn-primary" id="btn-new-member">
                            ${icons.plus}
                            ${t('team.addMember')}
                        </button>
                    </div>
                </div>

                ${showForm ? this.renderForm() : ''}

                ${viewMode === 'liste' ? `
                    <!-- Barre de recherche -->
                    <div class="mb-lg">
                        <div class="data-table-search" style="max-width: 400px;">
                            <span class="data-table-search-icon">${icons.search}</span>
                            <input
                                type="text"
                                id="search-input"
                                class="form-input"
                                placeholder="Rechercher par nom, fonction, email..."
                                value="${searchQuery}"
                            />
                        </div>
                    </div>
                ` : ''}

                ${loading ? this.renderSkeleton() : this.renderContent()}
            </div>
        `;
    }

    renderViewTabs() {
        const { viewMode } = this.state;
        const tabs = [
            { id: 'liste', label: 'Liste' },
            { id: 'moyens', label: 'Moyens' },
            { id: 'justificatifs', label: 'Justificatifs' }
        ];

        return tabs.map(tab => `
            <button
                class="btn ${viewMode === tab.id ? 'btn-primary' : 'btn-secondary'}"
                data-view="${tab.id}"
            >
                ${tab.label}
            </button>
        `).join('');
    }

    renderForm() {
        const member = this.state.editingMember || this.getDefaultMember();
        const isEditing = !!member.id;

        return `
            <div class="card mb-lg" style="background: var(--brand-alpha-10);">
                <div class="card-body">
                    <h3 class="text-lg font-semibold mb-lg">
                        ${isEditing ? t('team.editMember') : t('team.addMember')}
                    </h3>

                    <form id="member-form">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-lg">
                            <div class="form-group col-span-full">
                                <label class="form-label">Nom complet *</label>
                                <input type="text" name="nom" class="form-input" value="${member.nom || ''}" placeholder="Ex: Jean Dupont" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Fonction *</label>
                                <input type="text" name="fonction" class="form-input" value="${member.fonction || ''}" placeholder="Ex: Architecte DPLG" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email *</label>
                                <input type="email" name="email" class="form-input" value="${member.email || ''}" placeholder="email@cabinet.fr" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Téléphone fixe</label>
                                <input type="tel" name="telephone" class="form-input" value="${member.telephone || ''}" placeholder="01 23 45 67 89" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Portable</label>
                                <input type="tel" name="portable" class="form-input" value="${member.portable || ''}" placeholder="06 12 34 56 78" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Métier</label>
                                <select name="metier" class="form-input form-select">
                                    <option value="Architecture" ${member.metier === 'Architecture' ? 'selected' : ''}>Architecture</option>
                                    <option value="Ingénierie" ${member.metier === 'Ingénierie' ? 'selected' : ''}>Ingénierie</option>
                                    <option value="Économie" ${member.metier === 'Économie' ? 'selected' : ''}>Économie</option>
                                    <option value="Autre" ${member.metier === 'Autre' ? 'selected' : ''}>Autre</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Taux horaire (€)</label>
                                <input type="number" name="tauxHoraire" class="form-input" value="${member.tauxHoraire || 0}" placeholder="85" step="0.01" min="0" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Statut</label>
                                <select name="statut" class="form-input form-select">
                                    <option value="actif" ${member.statut === 'actif' ? 'selected' : ''}>Actif</option>
                                    <option value="inactif" ${member.statut === 'inactif' ? 'selected' : ''}>Inactif</option>
                                    <option value="congé" ${member.statut === 'congé' ? 'selected' : ''}>En congé</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group mb-lg">
                            <label class="form-label">Compétences (séparées par des virgules)</label>
                            <input type="text" name="competences" class="form-input" value="${(member.competences || []).join(', ')}" placeholder="Ex: Conception, Plans, Suivi chantier" />
                        </div>

                        <div class="flex gap-sm">
                            <button type="submit" class="btn btn-primary">
                                ${icons.save}
                                Enregistrer
                            </button>
                            <button type="button" class="btn btn-secondary" id="btn-cancel-form">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderContent() {
        const { filteredMembers, viewMode } = this.state;

        if (filteredMembers.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">${icons.users}</div>
                    <h3 class="empty-state-title">${t('team.noMembers')}</h3>
                    <p class="empty-state-description">Ajoutez votre premier membre d'équipe</p>
                    <button class="btn btn-primary" id="btn-new-member-empty">
                        ${icons.plus}
                        ${t('team.addMember')}
                    </button>
                </div>
            `;
        }

        if (viewMode === 'liste') {
            return this.renderListView();
        } else if (viewMode === 'moyens') {
            return this.renderMoyensView();
        } else {
            return this.renderJustificatifsView();
        }
    }

    renderListView() {
        const { filteredMembers } = this.state;

        return `
            <div class="card">
                <div class="card-body p-0">
                    <div class="flex flex-col gap-md p-md">
                        ${filteredMembers.map(member => this.renderMemberCard(member)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderMemberCard(member) {
        const statusClass = {
            'actif': 'badge-success',
            'inactif': 'badge-error',
            'congé': 'badge-warning'
        };

        return `
            <div class="card card-hover" data-member-id="${member.id}">
                <div class="card-body">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-sm mb-sm flex-wrap">
                                <h4 class="font-semibold text-lg">${member.nom}</h4>
                                <span class="badge badge-info">${member.fonction || '-'}</span>
                                <span class="badge ${statusClass[member.statut] || 'badge-neutral'}">${member.statut}</span>
                            </div>

                            <div class="grid grid-cols-2 gap-sm text-sm text-secondary mb-md">
                                <div>
                                    <strong>Email:</strong>
                                    <a href="mailto:${member.email}" class="text-brand">${member.email}</a>
                                </div>
                                ${member.telephone ? `
                                    <div>
                                        <strong>Tél:</strong>
                                        <a href="tel:${member.telephone}" class="text-brand">${member.telephone}</a>
                                    </div>
                                ` : ''}
                                ${member.portable ? `
                                    <div>
                                        <strong>Portable:</strong>
                                        <a href="tel:${member.portable}" class="text-brand">${member.portable}</a>
                                    </div>
                                ` : ''}
                                <div><strong>Métier:</strong> ${member.metier || '-'}</div>
                                <div><strong>Taux horaire:</strong> ${formatCurrency(member.tauxHoraire || 0)}/h</div>
                            </div>

                            ${member.competences && member.competences.length > 0 ? `
                                <div>
                                    <strong class="text-xs">Compétences:</strong>
                                    <div class="flex flex-wrap gap-xs mt-xs">
                                        ${member.competences.map(comp => `
                                            <span class="badge badge-info">${comp}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="flex gap-xs">
                            <button class="btn btn-secondary btn-sm" data-edit="${member.id}">
                                ${icons.edit}
                                Modifier
                            </button>
                            <button class="btn btn-icon btn-ghost text-error" data-delete="${member.id}">
                                ${icons.trash}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMoyensView() {
        const { filteredMembers } = this.state;

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="font-semibold">Visualisation des moyens par membre</h3>
                </div>
                <div class="card-body">
                    <div class="flex flex-col gap-lg">
                        ${filteredMembers.map(member => `
                            <div class="card">
                                <div class="card-body">
                                    <div class="flex justify-between items-center mb-md">
                                        <h4 class="font-semibold">${member.nom} - ${member.fonction}</h4>
                                        <button class="btn btn-secondary btn-sm" data-edit="${member.id}">
                                            ${icons.edit} Modifier
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                                        <div class="p-md rounded-lg" style="background: var(--success-light);">
                                            <h5 class="font-semibold mb-sm">Moyens humains</h5>
                                            <p class="text-sm text-muted">Aucun fichier (fonctionnalité upload à venir)</p>
                                        </div>
                                        <div class="p-md rounded-lg" style="background: var(--info-light);">
                                            <h5 class="font-semibold mb-sm">Moyens matériels</h5>
                                            <p class="text-sm text-muted">Aucun fichier (fonctionnalité upload à venir)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderJustificatifsView() {
        const { filteredMembers } = this.state;

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="font-semibold">Justificatifs par membre</h3>
                </div>
                <div class="card-body">
                    <div class="flex flex-col gap-lg">
                        ${filteredMembers.map(member => `
                            <div class="card">
                                <div class="card-body">
                                    <div class="flex justify-between items-center mb-md">
                                        <h4 class="font-semibold">${member.nom} - ${member.fonction}</h4>
                                        <button class="btn btn-secondary btn-sm" data-edit="${member.id}">
                                            ${icons.edit} Modifier
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                                        <div class="p-md rounded-lg" style="background: var(--brand-alpha-10);">
                                            <h5 class="font-semibold mb-sm">CV</h5>
                                            <p class="text-sm text-muted">Aucun CV</p>
                                        </div>
                                        <div class="p-md rounded-lg" style="background: var(--success-light);">
                                            <h5 class="font-semibold mb-sm">Diplômes</h5>
                                            <p class="text-sm text-muted">Aucun diplôme</p>
                                        </div>
                                        <div class="p-md rounded-lg" style="background: var(--warning-light);">
                                            <h5 class="font-semibold mb-sm">Attestations</h5>
                                            <p class="text-sm text-muted">Aucune attestation</p>
                                        </div>
                                        <div class="p-md rounded-lg" style="background: var(--error-light);">
                                            <h5 class="font-semibold mb-sm">Marchés publics</h5>
                                            <p class="text-sm text-muted">Aucun justificatif</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderSkeleton() {
        return `
            <div class="card">
                <div class="card-body">
                    ${Array(3).fill().map(() => `
                        <div class="mb-lg">
                            <div class="skeleton skeleton-title mb-sm"></div>
                            <div class="skeleton skeleton-text" style="width: 60%;"></div>
                            <div class="skeleton skeleton-text" style="width: 40%;"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async onMount() {
        await this.loadData();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Bouton nouveau membre
        const btnNew = this.$('#btn-new-member') || this.$('#btn-new-member-empty');
        if (btnNew) {
            this.on(btnNew, 'click', () => this.handleNewMember());
        }

        // Onglets de vue
        this.$$('[data-view]').forEach(btn => {
            this.on(btn, 'click', () => {
                this.state.viewMode = btn.dataset.view;
                this.update();
            });
        });

        // Recherche
        const searchInput = this.$('#search-input');
        if (searchInput) {
            this.on(searchInput, 'input', debounce((e) => {
                this.state.searchQuery = e.target.value;
                this.filterMembers();
            }, 300));
        }

        // Boutons d'édition
        this.$$('[data-edit]').forEach(btn => {
            this.on(btn, 'click', () => this.handleEditMember(btn.dataset.edit));
        });

        // Boutons de suppression
        this.$$('[data-delete]').forEach(btn => {
            this.on(btn, 'click', () => this.handleDeleteMember(btn.dataset.delete));
        });

        // Formulaire
        const form = this.$('#member-form');
        if (form) {
            this.on(form, 'submit', (e) => this.handleSaveMember(e));
        }

        const btnCancel = this.$('#btn-cancel-form');
        if (btnCancel) {
            this.on(btnCancel, 'click', () => {
                this.state.showForm = false;
                this.state.editingMember = null;
                this.update();
            });
        }
    }

    async loadData() {
        try {
            // Essaie d'abord l'API, sinon localStorage
            let members;
            try {
                members = await equipeApi.getAll();
            } catch (apiError) {
                console.warn('API non disponible, utilisation du localStorage');
                members = storage.get('team-members', []);
            }

            this.state.members = members;
            this.state.filteredMembers = members;
            this.state.loading = false;
            this.update();
            this.attachEventListeners();
        } catch (error) {
            console.error('Erreur chargement équipe:', error);
            this.state.loading = false;
            this.state.members = [];
            this.state.filteredMembers = [];
            this.update();
        }
    }

    filterMembers() {
        const { members, searchQuery } = this.state;

        if (!searchQuery.trim()) {
            this.state.filteredMembers = members;
        } else {
            const query = searchQuery.toLowerCase();
            this.state.filteredMembers = members.filter(m =>
                (m.nom && m.nom.toLowerCase().includes(query)) ||
                (m.fonction && m.fonction.toLowerCase().includes(query)) ||
                (m.email && m.email.toLowerCase().includes(query))
            );
        }

        this.update();
        this.attachEventListeners();
    }

    handleNewMember() {
        this.state.editingMember = this.getDefaultMember();
        this.state.showForm = true;
        this.update();
        this.attachEventListeners();
    }

    handleEditMember(id) {
        const member = this.state.members.find(m => m.id == id);
        if (member) {
            this.state.editingMember = { ...member };
            this.state.showForm = true;
            this.update();
            this.attachEventListeners();
        }
    }

    async handleDeleteMember(id) {
        const confirmed = await modal.confirm({
            title: t('team.deleteMember'),
            message: 'Êtes-vous sûr de vouloir supprimer ce membre ?',
            confirmText: t('common.delete'),
            danger: true
        });

        if (confirmed) {
            try {
                await equipeApi.delete(id);
                toast.success(t('success.deleted'));
                await this.loadData();
            } catch (error) {
                // Suppression locale
                this.state.members = this.state.members.filter(m => m.id != id);
                storage.set('team-members', this.state.members);
                this.filterMembers();
                toast.success(t('success.deleted'));
            }
        }
    }

    async handleSaveMember(e) {
        e.preventDefault();

        const form = this.$('#member-form');
        const formData = new FormData(form);

        const memberData = {
            ...this.state.editingMember,
            nom: formData.get('nom'),
            fonction: formData.get('fonction'),
            email: formData.get('email'),
            telephone: formData.get('telephone'),
            portable: formData.get('portable'),
            metier: formData.get('metier'),
            tauxHoraire: parseFloat(formData.get('tauxHoraire')) || 0,
            statut: formData.get('statut'),
            competences: formData.get('competences')
                .split(',')
                .map(c => c.trim())
                .filter(c => c)
        };

        if (!memberData.nom || !memberData.email) {
            toast.warning('Le nom et l\'email sont obligatoires');
            return;
        }

        try {
            if (memberData.id) {
                await equipeApi.update(memberData.id, memberData);
                toast.success('Membre modifié avec succès');
            } else {
                await equipeApi.create(memberData);
                toast.success('Membre ajouté avec succès');
            }

            this.state.showForm = false;
            this.state.editingMember = null;
            await this.loadData();
        } catch (error) {
            // Sauvegarde locale
            if (memberData.id) {
                this.state.members = this.state.members.map(m =>
                    m.id == memberData.id ? memberData : m
                );
            } else {
                memberData.id = Date.now();
                this.state.members.push(memberData);
            }

            storage.set('team-members', this.state.members);
            this.state.showForm = false;
            this.state.editingMember = null;
            this.filterMembers();
            toast.success(memberData.id ? 'Membre modifié' : 'Membre ajouté');
        }
    }
}

export function renderTeam() {
    const page = new TeamPage();
    return page.render();
}

export default TeamPage;
