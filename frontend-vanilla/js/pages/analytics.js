/**
 * Page Analytics - Tableau de bord analytique
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';

export class AnalyticsPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            viewMode: 'previsionnel', // 'previsionnel', 'evolution', 'partenaires'
            periodeEvolution: '3mois', // '3mois', '6mois', '1an', '3ans'
            tenders: [],
            projets: [],
            bets: []
        };
    }

    onMount() {
        this.loadData();
        this.bindEvents();
    }

    loadData() {
        const tenders = storage.get('wiw-appels-offres', []);
        const projets = storage.get('wiw-projets', []);
        const bets = storage.get('wiw-bets', []);
        this.setState({ tenders, projets, bets });
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

        // Période
        container.querySelector('#periode-select')?.addEventListener('change', (e) => {
            this.setState({ periodeEvolution: e.target.value });
        });
    }

    getCommandesValidees() {
        return this.state.projets.filter(p =>
            p.statut === 'Contrat signé' || p.statut === 'En cours'
        );
    }

    getEvolutionData() {
        const { periodeEvolution, projets } = this.state;
        const today = new Date();
        const data = [];

        const getMonthData = (monthsAgo) => {
            const date = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
            const monthProjets = projets.filter(p => {
                const projetDate = new Date(p.dateCreation || p.annee || Date.now());
                return projetDate.getMonth() === date.getMonth() &&
                       projetDate.getFullYear() === date.getFullYear();
            });
            return {
                label: date.toLocaleDateString('fr-FR', { month: 'short' }),
                value: monthProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
            };
        };

        const getYearData = (yearsAgo) => {
            const year = today.getFullYear() - yearsAgo;
            const yearProjets = projets.filter(p => {
                const projetDate = new Date(p.dateCreation || p.annee || Date.now());
                return projetDate.getFullYear() === year;
            });
            return {
                label: year.toString(),
                value: yearProjets.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0)
            };
        };

        const months = periodeEvolution === '3mois' ? 3 :
                       periodeEvolution === '6mois' ? 6 :
                       periodeEvolution === '1an' ? 12 : 0;

        if (months > 0) {
            for (let i = months - 1; i >= 0; i--) {
                data.push(getMonthData(i));
            }
        } else {
            // 3 ans
            for (let i = 2; i >= 0; i--) {
                data.push(getYearData(i));
            }
        }

        return data;
    }

    getRepartitionPartenaires() {
        const { projets, bets } = this.state;

        return bets.reduce((acc, bet) => {
            const projetsAvecBet = projets.filter(p => p.betId === bet.id);
            const montant = projetsAvecBet.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
            if (montant > 0) {
                acc.push({
                    nom: bet.nom,
                    montant,
                    nbProjets: projetsAvecBet.length
                });
            }
            return acc;
        }, []).sort((a, b) => b.montant - a.montant);
    }

    render() {
        const { viewMode, periodeEvolution, bets } = this.state;
        const commandesValidees = this.getCommandesValidees();
        const montantTotalCommandes = commandesValidees.reduce((sum, p) => sum + (p.montantTravauxHT || 0), 0);
        const evolutionData = this.getEvolutionData();
        const repartitionPartenaires = this.getRepartitionPartenaires();
        const totalPartenaires = repartitionPartenaires.reduce((sum, p) => sum + p.montant, 0);

        return `
            <div class="page-analytics">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.trendingUp}
                            Prévisionnel
                        </h1>
                        <p class="page-subtitle">
                            Prévisionnel commercial et commandes validées
                        </p>
                    </div>
                    <div class="page-actions">
                        <button class="btn ${viewMode === 'previsionnel' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="previsionnel">
                            Prévisionnel
                        </button>
                        <button class="btn ${viewMode === 'evolution' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="evolution">
                            Évolution
                        </button>
                        <button class="btn ${viewMode === 'partenaires' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="partenaires">
                            Partenaires
                        </button>
                    </div>
                </div>

                ${viewMode === 'previsionnel' ? this.renderPrevisionnel(commandesValidees, montantTotalCommandes) : ''}
                ${viewMode === 'evolution' ? this.renderEvolution(evolutionData) : ''}
                ${viewMode === 'partenaires' ? this.renderPartenaires(repartitionPartenaires, totalPartenaires) : ''}
            </div>
        `;
    }

    renderPrevisionnel(commandesValidees, montantTotal) {
        const { bets } = this.state;
        const montantMoyen = commandesValidees.length > 0 ? montantTotal / commandesValidees.length : 0;

        return `
            <!-- KPI Cards -->
            <div class="stats-grid stats-grid-3 mb-4">
                <div class="stat-card stat-card-success">
                    <div class="stat-card-header">
                        <div class="stat-icon">${icons.checkCircle}</div>
                        <span class="badge badge-success">+${commandesValidees.length}</span>
                    </div>
                    <div class="stat-value">${formatCurrency(montantTotal)}</div>
                    <div class="stat-label">Commandes projets validées</div>
                </div>

                <div class="stat-card stat-card-info">
                    <div class="stat-card-header">
                        <div class="stat-icon">${icons.trendingUp}</div>
                        <span class="badge badge-info">${commandesValidees.length} projets</span>
                    </div>
                    <div class="stat-value">${formatCurrency(montantMoyen)}</div>
                    <div class="stat-label">Montant moyen par projet</div>
                </div>

                <div class="stat-card stat-card-purple">
                    <div class="stat-card-header">
                        <div class="stat-icon">${icons.users}</div>
                        <span class="badge badge-secondary">${bets.length} partenaires</span>
                    </div>
                    <div class="stat-value">${bets.length}</div>
                    <div class="stat-label">Partenaires actifs</div>
                </div>
            </div>

            <!-- Liste des commandes validées -->
            <div class="card">
                <h3 class="card-title mb-4">Commandes validées (contrats signés)</h3>

                ${commandesValidees.length === 0 ? `
                    <div class="text-center py-8 text-muted">
                        Aucune commande validée pour le moment
                    </div>
                ` : `
                    <div class="flex flex-col gap-3">
                        ${commandesValidees.map(projet => `
                            <div class="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <div class="font-semibold">${projet.nom || 'Projet sans nom'}</div>
                                    <div class="text-sm text-muted">${projet.client || projet.maitreOuvrage || 'Client non renseigné'}</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-bold">${formatCurrency(projet.montantTravauxHT || 0)} HT</div>
                                    <div class="text-xs text-muted">${projet.statut}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    }

    renderEvolution(data) {
        const { periodeEvolution } = this.state;
        const maxValue = Math.max(...data.map(d => d.value), 1);

        return `
            <!-- Sélecteur de période -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="card-title">Évolution des commandes</h3>
                    <select id="periode-select" class="form-input" style="width: auto;">
                        <option value="3mois" ${periodeEvolution === '3mois' ? 'selected' : ''}>3 mois</option>
                        <option value="6mois" ${periodeEvolution === '6mois' ? 'selected' : ''}>6 mois</option>
                        <option value="1an" ${periodeEvolution === '1an' ? 'selected' : ''}>1 an</option>
                        <option value="3ans" ${periodeEvolution === '3ans' ? 'selected' : ''}>3 ans</option>
                    </select>
                </div>

                <!-- Simple bar chart -->
                <div class="chart-container">
                    <div class="bar-chart">
                        ${data.map(d => {
                            const heightPercent = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
                            return `
                                <div class="bar-chart-item">
                                    <div class="bar-chart-bar-container">
                                        <div class="bar-chart-bar" style="height: ${heightPercent}%;"></div>
                                    </div>
                                    <div class="bar-chart-value">${formatCurrency(d.value)}</div>
                                    <div class="bar-chart-label">${d.label}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- Total -->
            <div class="card">
                <h3 class="card-title mb-4">Résumé</h3>
                <div class="stats-grid stats-grid-3">
                    <div class="stat-card">
                        <div class="stat-label">Total période</div>
                        <div class="stat-value">${formatCurrency(data.reduce((sum, d) => sum + d.value, 0))}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Moyenne</div>
                        <div class="stat-value">${formatCurrency(data.length > 0 ? data.reduce((sum, d) => sum + d.value, 0) / data.length : 0)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Périodes</div>
                        <div class="stat-value">${data.length}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPartenaires(repartition, total) {
        return `
            <div class="card">
                <h3 class="card-title mb-4">Répartition par partenaires</h3>

                ${repartition.length === 0 ? `
                    <div class="text-center py-8 text-muted">
                        Aucun partenaire associé à des projets
                    </div>
                ` : `
                    <div class="flex flex-col gap-4">
                        ${repartition.map((p, i) => {
                            const pourcentage = total > 0 ? (p.montant / total) * 100 : 0;
                            const colors = ['var(--brand)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)'];
                            const color = colors[i % colors.length];
                            return `
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="text-muted">
                                            ${p.nom} (${p.nbProjets} projet${p.nbProjets > 1 ? 's' : ''})
                                        </span>
                                        <span class="font-bold">
                                            ${formatCurrency(p.montant)} (${pourcentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-bar-fill" style="width: ${pourcentage}%; background: ${color};"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="mt-4 pt-4 border-t">
                        <div class="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${formatCurrency(total)}</span>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderAnalyticsPage(container) {
    const page = new AnalyticsPage();
    page.mount(container);
    return page;
}
