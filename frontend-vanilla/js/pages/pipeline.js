// Pipeline Page - Pipeline de Prospection avec visualisation
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';

export class PipelinePage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            tenders: storage.get('wiw-tenders') || []
        };
    }

    getPipelineStats() {
        const stats = {
            nouveau: 0,
            contacte: 0,
            analyse: 0,
            proposition: 0,
            negociation: 0,
            gagne: 0,
            perdu: 0,
            archive: 0
        };

        const mapStatutToEtape = (statut) => {
            const mapping = {
                'Nouveau': 'nouveau',
                'En cours': 'analyse',
                'Gagné': 'gagne',
                'Perdu': 'perdu',
                'Archivé': 'archive'
            };
            return mapping[statut] || 'nouveau';
        };

        this.state.tenders.forEach(ao => {
            const etape = mapStatutToEtape(ao.statut);
            stats[etape] = (stats[etape] || 0) + 1;
        });

        return stats;
    }

    getChartData() {
        const stats = this.getPipelineStats();
        return [
            { label: 'Nouveau', value: stats.nouveau, color: '#6b7280' },
            { label: 'Contacté', value: stats.contacte, color: '#3b82f6' },
            { label: 'En analyse', value: stats.analyse, color: '#8b5cf6' },
            { label: 'Proposition', value: stats.proposition, color: '#f59e0b' },
            { label: 'Négociation', value: stats.negociation, color: '#fb923c' },
            { label: 'Gagné', value: stats.gagne, color: '#10b981' },
            { label: 'Perdu', value: stats.perdu, color: '#ef4444' },
            { label: 'Archivé', value: stats.archive, color: '#9ca3af' }
        ].filter(item => item.value > 0);
    }

    getMontantParStatut() {
        const montants = {};
        this.state.tenders.forEach(ao => {
            const statut = ao.statut || 'Nouveau';
            montants[statut] = (montants[statut] || 0) + (ao.montant || 0);
        });
        return Object.entries(montants).map(([label, value]) => ({
            label,
            value,
            formatted: (value / 1000000).toFixed(2) + ' M€'
        }));
    }

    formatMontant(value) {
        return (value / 1000000).toFixed(2) + ' M€';
    }

    render() {
        const chartData = this.getChartData();
        const montantData = this.getMontantParStatut();
        const totalTenders = this.state.tenders.length;
        const maxValue = Math.max(...chartData.map(d => d.value), 1);
        const totalMontant = montantData.reduce((sum, d) => sum + d.value, 0);

        return `
            <div class="page-pipeline">
                <div class="page-header">
                    <h1 style="font-size: 28px; font-weight: bold;">Pipeline de Prospection</h1>
                    <p style="opacity: 0.7; margin-top: 8px;">Visualisez et gérez vos opportunités commerciales dans un pipeline interactif</p>
                </div>

                <div class="pipeline-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
                    <div class="card stat-card" style="text-align: center;">
                        <div class="stat-label">Total AO</div>
                        <div class="stat-value" style="font-size: 32px; color: #3b82f6;">${totalTenders}</div>
                    </div>
                    <div class="card stat-card" style="text-align: center;">
                        <div class="stat-label">Montant total</div>
                        <div class="stat-value" style="font-size: 20px; color: #10b981;">${this.formatMontant(totalMontant)}</div>
                    </div>
                    <div class="card stat-card" style="text-align: center;">
                        <div class="stat-label">Taux de réussite</div>
                        <div class="stat-value" style="font-size: 32px; color: #a855f7;">
                            ${totalTenders > 0 ? Math.round((chartData.find(d => d.label === 'Gagné')?.value || 0) / totalTenders * 100) : 0}%
                        </div>
                    </div>
                </div>

                <div class="charts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    ${this.renderPieChart(chartData)}
                    ${this.renderBarChart(chartData, maxValue)}
                </div>

                ${this.renderAreaChart(montantData)}

                ${this.renderPipelineBoard()}
            </div>
        `;
    }

    renderPieChart(data) {
        if (data.length === 0) {
            return `
                <div class="card">
                    <h3 style="margin-bottom: 15px;">📊 Répartition par étape</h3>
                    <div style="text-align: center; padding: 40px; opacity: 0.5;">
                        Aucune donnée à afficher
                    </div>
                </div>
            `;
        }

        const total = data.reduce((sum, d) => sum + d.value, 0);

        return `
            <div class="card">
                <h3 style="margin-bottom: 15px;">📊 Répartition par étape</h3>
                <div style="display: flex; gap: 20px; align-items: center;">
                    <div class="pie-chart" style="width: 200px; height: 200px; position: relative;">
                        ${this.generatePieSlices(data, total)}
                    </div>
                    <div class="pie-legend" style="display: grid; gap: 8px;">
                        ${data.map(d => `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 12px; height: 12px; border-radius: 2px; background: ${d.color};"></div>
                                <span style="font-size: 13px;">${d.label}: ${d.value} (${Math.round(d.value / total * 100)}%)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    generatePieSlices(data, total) {
        // Simple pie chart representation using CSS
        let accumulated = 0;
        const gradientParts = data.map(d => {
            const start = accumulated;
            const end = accumulated + (d.value / total * 100);
            accumulated = end;
            return `${d.color} ${start}% ${end}%`;
        });

        return `
            <div style="
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: conic-gradient(${gradientParts.join(', ')});
            "></div>
        `;
    }

    renderBarChart(data, maxValue) {
        if (data.length === 0) {
            return `
                <div class="card">
                    <h3 style="margin-bottom: 15px;">📈 Nombre d'AO par étape</h3>
                    <div style="text-align: center; padding: 40px; opacity: 0.5;">
                        Aucune donnée à afficher
                    </div>
                </div>
            `;
        }

        return `
            <div class="card">
                <h3 style="margin-bottom: 15px;">📈 Nombre d'AO par étape</h3>
                <div class="bar-chart" style="display: flex; align-items: flex-end; gap: 10px; height: 200px; padding: 10px 0;">
                    ${data.map(d => `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%;">
                            <div style="flex: 1; display: flex; align-items: flex-end; width: 100%;">
                                <div style="
                                    width: 100%;
                                    height: ${(d.value / maxValue) * 100}%;
                                    background: ${d.color};
                                    border-radius: 4px 4px 0 0;
                                    min-height: 20px;
                                    display: flex;
                                    align-items: flex-start;
                                    justify-content: center;
                                    padding-top: 4px;
                                    color: white;
                                    font-weight: bold;
                                    font-size: 12px;
                                ">${d.value}</div>
                            </div>
                            <div style="font-size: 10px; margin-top: 8px; text-align: center; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                                ${d.label}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderAreaChart(data) {
        if (data.length === 0) {
            return `
                <div class="card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 15px;">💰 Montant par statut</h3>
                    <div style="text-align: center; padding: 40px; opacity: 0.5;">
                        Aucune donnée à afficher
                    </div>
                </div>
            `;
        }

        const maxMontant = Math.max(...data.map(d => d.value), 1);

        return `
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">💰 Montant par statut</h3>
                <div class="area-chart" style="display: flex; align-items: flex-end; gap: 15px; height: 150px; padding: 10px 0;">
                    ${data.map(d => `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                            <div style="
                                width: 100%;
                                height: ${(d.value / maxMontant) * 100}%;
                                background: linear-gradient(to top, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.3));
                                border-radius: 4px 4px 0 0;
                                min-height: 30px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 4px;
                                font-size: 11px;
                                font-weight: bold;
                                color: white;
                                text-align: center;
                            ">${d.formatted}</div>
                            <div style="font-size: 11px; margin-top: 8px; text-align: center; opacity: 0.7;">${d.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPipelineBoard() {
        const { tenders } = this.state;
        const etapes = [
            { key: 'Nouveau', label: 'Nouveau', color: '#6b7280' },
            { key: 'En cours', label: 'En analyse', color: '#8b5cf6' },
            { key: 'Gagné', label: 'Gagné', color: '#10b981' },
            { key: 'Perdu', label: 'Perdu', color: '#ef4444' }
        ];

        return `
            <div class="card">
                <h3 style="margin-bottom: 20px;">🎯 Pipeline interactif</h3>
                <div class="pipeline-board" style="display: grid; grid-template-columns: repeat(${etapes.length}, 1fr); gap: 15px; min-height: 300px;">
                    ${etapes.map(etape => {
                        const items = tenders.filter(t => t.statut === etape.key);
                        return `
                            <div class="pipeline-column" style="
                                background: rgba(0,0,0,0.02);
                                border-radius: 8px;
                                padding: 15px;
                                border-top: 3px solid ${etape.color};">
                                <h4 style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                                    <span>${etape.label}</span>
                                    <span class="badge" style="background: ${etape.color}; color: white;">${items.length}</span>
                                </h4>
                                <div class="pipeline-items" style="display: flex; flex-direction: column; gap: 10px;">
                                    ${items.length === 0 ? `
                                        <div style="text-align: center; padding: 20px; opacity: 0.4; font-size: 12px;">
                                            Aucun élément
                                        </div>
                                    ` : items.slice(0, 5).map(item => `
                                        <div class="pipeline-item" style="
                                            background: var(--panel);
                                            padding: 10px;
                                            border-radius: 6px;
                                            border: 1px solid var(--border);
                                            cursor: pointer;
                                            transition: all 0.2s;">
                                            <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px;">${item.titre || 'Sans titre'}</div>
                                            <div style="font-size: 11px; opacity: 0.6;">${item.client || 'Client non défini'}</div>
                                            ${item.montant ? `<div style="font-size: 12px; color: #10b981; margin-top: 4px;">${this.formatMontant(item.montant)}</div>` : ''}
                                        </div>
                                    `).join('')}
                                    ${items.length > 5 ? `
                                        <div style="text-align: center; font-size: 11px; opacity: 0.6;">
                                            +${items.length - 5} autres
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Pipeline items click
        document.querySelectorAll('.pipeline-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-2px)';
                item.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });
    }
}
