/**
 * Page Dashboard - WiW AE+
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { store } from '../store.js';
import { t } from '../i18n/index.js';
import { appelsApi, devisApi, equipeApi } from '../api/index.js';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format.js';

export class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stats: {
                tendersInProgress: 0,
                tendersWon: 0,
                tendersLost: 0,
                totalRevenue: 0,
                winRate: 0,
                pendingQuotes: 0,
                teamMembers: 0
            },
            recentTenders: [],
            error: null
        };
    }

    render() {
        const user = store.get('user') || {};
        const { loading, stats, recentTenders, error } = this.state;

        if (loading) {
            return this.renderSkeleton();
        }

        return `
            <div class="page">
                <div class="page-header">
                    <div>
                        <h1 class="page-title">${t('dashboard.title')}</h1>
                        <p class="page-subtitle">${t('dashboard.welcome', { name: user.prenom || user.nom || 'Utilisateur' })}</p>
                    </div>
                    <div class="page-actions">
                        <a href="/nouvelle-ao" class="btn btn-primary">
                            ${icons.plus}
                            ${t('nav.newTender')}
                        </a>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="dashboard-stats">
                    ${this.renderStatCard({
                        title: t('dashboard.tendersInProgress'),
                        value: stats.tendersInProgress,
                        icon: 'briefcase',
                        iconClass: 'brand'
                    })}
                    ${this.renderStatCard({
                        title: t('dashboard.tendersWon'),
                        value: stats.tendersWon,
                        icon: 'checkCircle',
                        iconClass: 'success',
                        trend: { value: 12, direction: 'up' }
                    })}
                    ${this.renderStatCard({
                        title: t('dashboard.winRate'),
                        value: formatPercent(stats.winRate / 100),
                        icon: 'target',
                        iconClass: 'info'
                    })}
                    ${this.renderStatCard({
                        title: t('dashboard.totalRevenue'),
                        value: formatCurrency(stats.totalRevenue),
                        icon: 'euro',
                        iconClass: 'brand',
                        trend: { value: 8, direction: 'up' }
                    })}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                    <!-- Recent Tenders -->
                    <div class="col-span-2">
                        <div class="card">
                            <div class="card-header flex items-center justify-between">
                                <h2 class="text-lg font-semibold">${t('dashboard.recentActivity')}</h2>
                                <a href="/tenders" class="btn btn-ghost btn-sm">
                                    Voir tout
                                    ${icons.arrowRight}
                                </a>
                            </div>
                            <div class="card-body p-0">
                                ${recentTenders.length > 0 ? `
                                    <div class="table-container border-0">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>${t('tenders.reference')}</th>
                                                    <th>${t('tenders.client')}</th>
                                                    <th>${t('tenders.status')}</th>
                                                    <th>${t('tenders.deadline')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${recentTenders.map(tender => `
                                                    <tr>
                                                        <td class="font-medium">${tender.reference || '-'}</td>
                                                        <td>${tender.client || '-'}</td>
                                                        <td>${this.renderStatusBadge(tender.statut)}</td>
                                                        <td class="text-muted">${tender.dateLimite ? new Date(tender.dateLimite).toLocaleDateString('fr-FR') : '-'}</td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                ` : `
                                    <div class="empty-state">
                                        <div class="empty-state-icon">${icons.briefcase}</div>
                                        <h3 class="empty-state-title">${t('tenders.noTenders')}</h3>
                                        <p class="empty-state-description">${t('tenders.createFirst')}</p>
                                        <a href="/nouvelle-ao" class="btn btn-primary">
                                            ${icons.plus}
                                            ${t('tenders.new')}
                                        </a>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div>
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold">${t('dashboard.quickActions')}</h2>
                            </div>
                            <div class="card-body">
                                <div class="flex flex-col gap-sm">
                                    <a href="/nouvelle-ao" class="btn btn-secondary justify-start">
                                        ${icons.plus}
                                        ${t('tenders.new')}
                                    </a>
                                    <a href="/devis" class="btn btn-secondary justify-start">
                                        ${icons.fileText}
                                        ${t('quotes.new')}
                                    </a>
                                    <a href="/team" class="btn btn-secondary justify-start">
                                        ${icons.users}
                                        ${t('team.addMember')}
                                    </a>
                                    <a href="/references" class="btn btn-secondary justify-start">
                                        ${icons.award}
                                        Ajouter référence
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Upcoming Deadlines -->
                        <div class="card mt-lg">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold">${t('dashboard.upcomingDeadlines')}</h2>
                            </div>
                            <div class="card-body">
                                ${this.renderUpcomingDeadlines(recentTenders)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStatCard({ title, value, icon, iconClass, trend }) {
        return `
            <div class="stat-card">
                <div class="stat-card-header">
                    <span class="stat-card-title">${title}</span>
                    <div class="stat-card-icon ${iconClass}">
                        ${icons[icon]}
                    </div>
                </div>
                <div class="stat-card-value">${value}</div>
                ${trend ? `
                    <div class="stat-card-trend ${trend.direction}">
                        ${trend.direction === 'up' ? icons.trendingUp : icons.trendingDown}
                        <span>${trend.value}% ce mois</span>
                    </div>
                ` : ''}
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

        const config = statusConfig[status] || { class: 'badge-neutral', label: status };

        return `<span class="badge ${config.class}">${config.label}</span>`;
    }

    renderUpcomingDeadlines(tenders) {
        const upcoming = tenders
            .filter(t => t.dateLimite && new Date(t.dateLimite) > new Date())
            .sort((a, b) => new Date(a.dateLimite) - new Date(b.dateLimite))
            .slice(0, 5);

        if (upcoming.length === 0) {
            return `<p class="text-muted text-sm">Aucune échéance à venir</p>`;
        }

        return `
            <ul class="flex flex-col gap-md">
                ${upcoming.map(tender => {
                    const deadline = new Date(tender.dateLimite);
                    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysLeft <= 3;

                    return `
                        <li class="flex items-center justify-between">
                            <div>
                                <p class="font-medium text-sm">${tender.reference || tender.nom || 'AO'}</p>
                                <p class="text-xs text-muted">${deadline.toLocaleDateString('fr-FR')}</p>
                            </div>
                            <span class="badge ${isUrgent ? 'badge-error' : 'badge-warning'}">
                                J-${daysLeft}
                            </span>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    renderSkeleton() {
        return `
            <div class="page">
                <div class="page-header">
                    <div>
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text" style="width: 200px;"></div>
                    </div>
                </div>

                <div class="dashboard-stats">
                    ${Array(4).fill().map(() => `
                        <div class="stat-card">
                            <div class="skeleton skeleton-text" style="width: 60%;"></div>
                            <div class="skeleton skeleton-title mt-md"></div>
                        </div>
                    `).join('')}
                </div>

                <div class="card mt-xl">
                    <div class="card-body">
                        ${Array(5).fill().map(() => `
                            <div class="skeleton skeleton-text mb-md"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    async onMount() {
        await this.loadData();
    }

    async loadData() {
        try {
            // Charge les données en parallèle
            const [tenders, quotes, team] = await Promise.all([
                appelsApi.getAll().catch(() => []),
                devisApi.getAll().catch(() => []),
                equipeApi.getAll().catch(() => [])
            ]);

            // Calcule les stats
            const tendersWon = tenders.filter(t => t.statut === 'Gagné').length;
            const tendersLost = tenders.filter(t => t.statut === 'Perdu').length;
            const tendersInProgress = tenders.filter(t => t.statut === 'En cours' || t.statut === 'Nouveau').length;
            const totalTenders = tendersWon + tendersLost;
            const winRate = totalTenders > 0 ? (tendersWon / totalTenders) * 100 : 0;

            // Revenue estimé basé sur les AO gagnés
            const totalRevenue = tenders
                .filter(t => t.statut === 'Gagné')
                .reduce((sum, t) => sum + (t.budget || 0), 0);

            this.setState({
                loading: false,
                stats: {
                    tendersInProgress,
                    tendersWon,
                    tendersLost,
                    totalRevenue,
                    winRate: Math.round(winRate),
                    pendingQuotes: quotes.filter(d => d.statut === 'Brouillon' || d.statut === 'Envoyé').length,
                    teamMembers: team.length
                },
                recentTenders: tenders.slice(0, 5)
            });
        } catch (error) {
            console.error('Erreur chargement dashboard:', error);
            this.setState({
                loading: false,
                error: error.message
            });
        }
    }
}

// Export pour le router
export function renderDashboard() {
    const page = new DashboardPage();
    return page.render();
}

export default DashboardPage;
