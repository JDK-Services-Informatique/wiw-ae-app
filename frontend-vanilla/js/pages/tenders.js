/**
 * Page Tenders (Appels d'offres) - WiW AE+
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { t } from '../i18n/index.js';
import { appelsApi } from '../api/index.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { formatCurrency, formatDate } from '../utils/format.js';
import { debounce } from '../utils/dom.js';

export class TendersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tenders: [],
            filteredTenders: [],
            searchQuery: '',
            statusFilter: 'all',
            view: 'table', // 'table' ou 'grid'
            error: null
        };
    }

    render() {
        const { loading, filteredTenders, searchQuery, statusFilter, view } = this.state;

        return `
            <div class="page">
                <div class="page-header">
                    <div>
                        <h1 class="page-title">${t('tenders.title')}</h1>
                        <p class="page-subtitle">${filteredTenders.length} appels d'offres</p>
                    </div>
                    <div class="page-actions">
                        <a href="/nouvelle-ao" class="btn btn-primary">
                            ${icons.plus}
                            ${t('tenders.new')}
                        </a>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="data-table-header">
                    <div class="data-table-search">
                        <span class="data-table-search-icon">${icons.search}</span>
                        <input
                            type="text"
                            id="search-input"
                            class="form-input"
                            placeholder="${t('common.search')}..."
                            value="${searchQuery}"
                        />
                    </div>

                    <div class="data-table-filters">
                        <select id="status-filter" class="form-input form-select" style="width: auto;">
                            <option value="all">${t('common.all')}</option>
                            <option value="Nouveau" ${statusFilter === 'Nouveau' ? 'selected' : ''}>${t('tenders.statusNew')}</option>
                            <option value="En cours" ${statusFilter === 'En cours' ? 'selected' : ''}>${t('tenders.statusInProgress')}</option>
                            <option value="Gagné" ${statusFilter === 'Gagné' ? 'selected' : ''}>${t('tenders.statusWon')}</option>
                            <option value="Perdu" ${statusFilter === 'Perdu' ? 'selected' : ''}>${t('tenders.statusLost')}</option>
                            <option value="Archivé" ${statusFilter === 'Archivé' ? 'selected' : ''}>${t('tenders.statusArchived')}</option>
                        </select>

                        <div class="flex gap-xs">
                            <button class="btn btn-icon ${view === 'table' ? 'btn-primary' : 'btn-ghost'}" data-view="table">
                                ${icons.menu}
                            </button>
                            <button class="btn btn-icon ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}" data-view="grid">
                                ${icons.layoutDashboard}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contenu -->
                ${loading ? this.renderSkeleton() : this.renderContent()}
            </div>
        `;
    }

    renderContent() {
        const { filteredTenders, view } = this.state;

        if (filteredTenders.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">${icons.briefcase}</div>
                    <h3 class="empty-state-title">${t('tenders.noTenders')}</h3>
                    <p class="empty-state-description">${t('tenders.createFirst')}</p>
                    <a href="/nouvelle-ao" class="btn btn-primary">
                        ${icons.plus}
                        ${t('tenders.new')}
                    </a>
                </div>
            `;
        }

        if (view === 'grid') {
            return this.renderGridView();
        }

        return this.renderTableView();
    }

    renderTableView() {
        const { filteredTenders } = this.state;

        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>${t('tenders.reference')}</th>
                            <th>${t('tenders.project')}</th>
                            <th>${t('tenders.client')}</th>
                            <th>${t('tenders.status')}</th>
                            <th>${t('tenders.deadline')}</th>
                            <th>${t('tenders.budget')}</th>
                            <th>${t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTenders.map(tender => `
                            <tr data-id="${tender.id}">
                                <td class="font-medium">${tender.reference || '-'}</td>
                                <td>${tender.nom || tender.intitule || '-'}</td>
                                <td>${tender.client || tender.maitreOuvrage || '-'}</td>
                                <td>${this.renderStatusBadge(tender.statut)}</td>
                                <td class="text-muted">${tender.dateLimite ? formatDate(tender.dateLimite) : '-'}</td>
                                <td>${tender.budget ? formatCurrency(tender.budget) : '-'}</td>
                                <td>
                                    <div class="dropdown">
                                        <button class="btn btn-icon btn-ghost dropdown-trigger">
                                            ${icons.moreVertical}
                                        </button>
                                        <div class="dropdown-menu">
                                            <a href="/tenders/${tender.id}" class="dropdown-item">
                                                ${icons.eye}
                                                Voir
                                            </a>
                                            <a href="/tenders/${tender.id}/edit" class="dropdown-item">
                                                ${icons.edit}
                                                ${t('common.edit')}
                                            </a>
                                            <div class="dropdown-divider"></div>
                                            <button class="dropdown-item text-error" data-delete="${tender.id}">
                                                ${icons.trash}
                                                ${t('common.delete')}
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderGridView() {
        const { filteredTenders } = this.state;

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                ${filteredTenders.map(tender => `
                    <div class="card card-hover" data-id="${tender.id}">
                        <div class="card-body">
                            <div class="flex items-start justify-between mb-md">
                                <div>
                                    <p class="text-xs text-muted mb-xs">${tender.reference || ''}</p>
                                    <h3 class="font-semibold">${tender.nom || tender.intitule || 'Sans titre'}</h3>
                                </div>
                                ${this.renderStatusBadge(tender.statut)}
                            </div>

                            <p class="text-sm text-secondary mb-md line-clamp-2">
                                ${tender.description || tender.client || 'Aucune description'}
                            </p>

                            <div class="flex items-center justify-between text-sm">
                                <span class="text-muted">
                                    ${icons.calendar}
                                    ${tender.dateLimite ? formatDate(tender.dateLimite) : '-'}
                                </span>
                                ${tender.budget ? `
                                    <span class="font-medium text-brand">
                                        ${formatCurrency(tender.budget)}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderStatusBadge(status) {
        const statusConfig = {
            'Nouveau': { class: 'badge-info', label: t('tenders.statusNew') },
            'En cours': { class: 'badge-warning', label: t('tenders.statusInProgress') },
            'Gagné': { class: 'badge-success', label: t('tenders.statusWon') },
            'Perdu': { class: 'badge-error', label: t('tenders.statusLost') },
            'Archivé': { class: 'badge-neutral', label: t('tenders.statusArchived') }
        };

        const config = statusConfig[status] || { class: 'badge-neutral', label: status || '-' };
        return `<span class="badge ${config.class}">${config.label}</span>`;
    }

    renderSkeleton() {
        return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th><div class="skeleton skeleton-text"></div></th>
                            <th><div class="skeleton skeleton-text"></div></th>
                            <th><div class="skeleton skeleton-text"></div></th>
                            <th><div class="skeleton skeleton-text"></div></th>
                            <th><div class="skeleton skeleton-text"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Array(5).fill().map(() => `
                            <tr>
                                <td><div class="skeleton skeleton-text"></div></td>
                                <td><div class="skeleton skeleton-text"></div></td>
                                <td><div class="skeleton skeleton-text"></div></td>
                                <td><div class="skeleton skeleton-text"></div></td>
                                <td><div class="skeleton skeleton-text"></div></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async onMount() {
        await this.loadData();

        // Event listeners
        const searchInput = this.$('#search-input');
        const statusFilter = this.$('#status-filter');

        if (searchInput) {
            this.on(searchInput, 'input', debounce((e) => {
                this.state.searchQuery = e.target.value;
                this.filterTenders();
            }, 300));
        }

        if (statusFilter) {
            this.on(statusFilter, 'change', (e) => {
                this.state.statusFilter = e.target.value;
                this.filterTenders();
            });
        }

        // View toggle
        this.$$('[data-view]').forEach(btn => {
            this.on(btn, 'click', () => {
                this.state.view = btn.dataset.view;
                this.update();
            });
        });

        // Delete buttons
        this.$$('[data-delete]').forEach(btn => {
            this.on(btn, 'click', () => this.handleDelete(btn.dataset.delete));
        });

        // Dropdown toggles
        this.$$('.dropdown-trigger').forEach(trigger => {
            this.on(trigger, 'click', (e) => {
                e.stopPropagation();
                const menu = trigger.nextElementSibling;
                menu.classList.toggle('open');
            });
        });

        // Close dropdowns on click outside
        document.addEventListener('click', () => {
            this.$$('.dropdown-menu.open').forEach(menu => {
                menu.classList.remove('open');
            });
        });
    }

    async loadData() {
        try {
            const tenders = await appelsApi.getAll();
            this.state.tenders = tenders;
            this.state.filteredTenders = tenders;
            this.state.loading = false;
            this.update();
        } catch (error) {
            console.error('Erreur chargement AO:', error);
            this.state.loading = false;
            this.state.error = error.message;
            toast.error('Erreur lors du chargement des appels d\'offres');
        }
    }

    filterTenders() {
        const { tenders, searchQuery, statusFilter } = this.state;

        let filtered = [...tenders];

        // Filtre par recherche
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                (t.reference && t.reference.toLowerCase().includes(query)) ||
                (t.nom && t.nom.toLowerCase().includes(query)) ||
                (t.intitule && t.intitule.toLowerCase().includes(query)) ||
                (t.client && t.client.toLowerCase().includes(query))
            );
        }

        // Filtre par statut
        if (statusFilter !== 'all') {
            filtered = filtered.filter(t => t.statut === statusFilter);
        }

        this.state.filteredTenders = filtered;
        this.update();
    }

    async handleDelete(id) {
        const confirmed = await modal.confirm({
            title: t('tenders.delete'),
            message: t('tenders.deleteConfirm'),
            confirmText: t('common.delete'),
            danger: true
        });

        if (confirmed) {
            try {
                await appelsApi.delete(id);
                toast.success(t('success.deleted'));
                await this.loadData();
            } catch (error) {
                toast.error(error.message || t('errors.generic'));
            }
        }
    }
}

// Export pour le router
export function renderTenders() {
    const page = new TendersPage();
    return page.render();
}

export default TendersPage;
