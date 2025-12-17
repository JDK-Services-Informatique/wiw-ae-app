// Prospection Page - Gestion des opportunités commerciales
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

export class ProspectionPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            periode: '6mois', // '6mois' ou '1an'
            viewMode: 'opportunites', // 'opportunites', 'statistiques'
            selectedOpportunite: null,
            showNewOpportunite: false,
            opportunites: storage.get('wiw-opportunites') || this.getDefaultOpportunites()
        };
    }

    getDefaultOpportunites() {
        return [
            {
                id: 1,
                nom: 'Réhabilitation Lycée Victor Hugo',
                client: 'Région Île-de-France',
                contact: 'M. Dupont',
                tel: '01 45 67 89 00',
                email: 'dupont@region-idf.fr',
                domaine: 'Éducation',
                type: 'Réhabilitation',
                montantEstime: 8500000,
                probabilite: 75,
                statut: 'Proposition envoyée',
                echeance: '2025-03-15',
                dejaTravaillé: true,
                notes: 'Suite au projet du Lycée Voltaire réalisé en 2022'
            },
            {
                id: 2,
                nom: 'Construction EHPAD Les Jardins',
                client: 'Groupe Korian',
                contact: 'Mme Martin',
                tel: '01 42 33 44 55',
                email: 'martin@korian.fr',
                domaine: 'Santé',
                type: 'Construction neuve',
                montantEstime: 12000000,
                probabilite: 45,
                statut: 'Négociation',
                echeance: '2025-06-01',
                dejaTravaillé: false,
                notes: ''
            },
            {
                id: 3,
                nom: 'Extension Centre Commercial',
                client: 'Unibail-Rodamco',
                contact: 'M. Bernard',
                tel: '01 55 66 77 88',
                email: 'bernard@unibail.com',
                domaine: 'Commerce',
                type: 'Extension',
                montantEstime: 25000000,
                probabilite: 30,
                statut: 'Prospection',
                echeance: '2025-09-01',
                dejaTravaillé: true,
                notes: 'Contact établi lors du MIPIM 2024'
            },
            {
                id: 4,
                nom: 'Rénovation Musée d\'Art Moderne',
                client: 'Ville de Paris',
                contact: 'Mme Leclerc',
                tel: '01 44 55 66 77',
                email: 'leclerc@paris.fr',
                domaine: 'Culture',
                type: 'Rénovation',
                montantEstime: 15000000,
                probabilite: 60,
                statut: 'Proposition envoyée',
                echeance: '2025-04-30',
                dejaTravaillé: true,
                notes: ''
            }
        ];
    }

    getFilteredOpportunites() {
        const today = new Date();
        const limitDate = new Date();

        if (this.state.periode === '6mois') {
            limitDate.setMonth(today.getMonth() + 6);
        } else {
            limitDate.setFullYear(today.getFullYear() + 1);
        }

        return this.state.opportunites.filter(opp => {
            const echeanceDate = new Date(opp.echeance);
            return echeanceDate >= today && echeanceDate <= limitDate;
        });
    }

    getStatistics() {
        const filtered = this.getFilteredOpportunites();
        return {
            count: filtered.length,
            totalMontant: filtered.reduce((sum, opp) => sum + opp.montantEstime, 0),
            montantPondere: filtered.reduce((sum, opp) => sum + (opp.montantEstime * opp.probabilite / 100), 0),
            tauxSuccesMoyen: filtered.length > 0
                ? filtered.reduce((sum, opp) => sum + opp.probabilite, 0) / filtered.length
                : 0
        };
    }

    getStatutBadge(statut) {
        const badges = {
            'Prospection': { bg: '#6b7280', color: '#fff' },
            'Proposition envoyée': { bg: '#3b82f6', color: '#fff' },
            'Négociation': { bg: '#fb923c', color: '#fff' },
            'Contrat signé': { bg: '#10b981', color: '#fff' },
            'Abandonné': { bg: '#ef4444', color: '#fff' }
        };
        return badges[statut] || { bg: '#6b7280', color: '#fff' };
    }

    getProbabiliteBadge(probabilite) {
        if (probabilite >= 75) return { bg: '#10b981', color: '#fff', text: 'Élevée' };
        if (probabilite >= 50) return { bg: '#fb923c', color: '#fff', text: 'Moyenne' };
        return { bg: '#ef4444', color: '#fff', text: 'Faible' };
    }

    formatMontant(value) {
        return value.toFixed(1);
    }

    setPeriode(periode) {
        this.setState({ periode });
    }

    setViewMode(mode) {
        this.setState({ viewMode: mode });
    }

    selectOpportunite(opp) {
        this.setState({ selectedOpportunite: opp });
    }

    closeModal() {
        this.setState({ selectedOpportunite: null });
    }

    render() {
        const { periode, viewMode, selectedOpportunite } = this.state;
        const filtered = this.getFilteredOpportunites();
        const stats = this.getStatistics();

        return `
            <div class="page-prospection">
                <div class="page-header">
                    <h2>Prospection</h2>
                    <div class="header-actions">
                        <div class="periode-selector">
                            <button class="btn ${periode === '6mois' ? '' : 'btn-secondary'}" data-periode="6mois">6 mois</button>
                            <button class="btn ${periode === '1an' ? '' : 'btn-secondary'}" data-periode="1an">1 an</button>
                        </div>
                        <button class="btn btn-primary" data-action="new-opportunite">➕ Nouvelle opportunité</button>
                    </div>
                </div>

                ${this.renderStatCards(stats)}

                <div class="tabs" style="margin-bottom: 20px; border-bottom: 2px solid var(--border); padding-bottom: 10px;">
                    <button class="btn ${viewMode === 'opportunites' ? '' : 'btn-secondary'}" data-view="opportunites">
                        Opportunités (${filtered.length})
                    </button>
                    <button class="btn ${viewMode === 'statistiques' ? '' : 'btn-secondary'}" data-view="statistiques">
                        Statistiques
                    </button>
                </div>

                ${viewMode === 'opportunites' ? this.renderOpportunites(filtered) : this.renderStatistiques(filtered)}

                ${selectedOpportunite ? this.renderModal(selectedOpportunite) : ''}
            </div>
        `;
    }

    renderStatCards(stats) {
        const { periode } = this.state;
        return `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div class="card stat-card" style="background: rgba(59, 130, 246, 0.1);">
                    <div class="stat-label">Opportunités (${periode === '6mois' ? '6 mois' : '1 an'})</div>
                    <div class="stat-value" style="color: #3b82f6;">${stats.count}</div>
                </div>
                <div class="card stat-card" style="background: rgba(16, 185, 129, 0.1);">
                    <div class="stat-label">Montant total estimé</div>
                    <div class="stat-value" style="color: #10b981; font-size: 20px;">${this.formatMontant(stats.totalMontant / 1000000)} M€</div>
                </div>
                <div class="card stat-card" style="background: rgba(251, 146, 60, 0.1);">
                    <div class="stat-label">Montant pondéré</div>
                    <div class="stat-value" style="color: #fb923c; font-size: 20px;">${this.formatMontant(stats.montantPondere / 1000000)} M€</div>
                </div>
                <div class="card stat-card" style="background: rgba(168, 85, 247, 0.1);">
                    <div class="stat-label">Taux succès moyen</div>
                    <div class="stat-value" style="color: #a855f7;">${stats.tauxSuccesMoyen.toFixed(0)}%</div>
                </div>
            </div>
        `;
    }

    renderOpportunites(opportunites) {
        if (opportunites.length === 0) {
            return `
                <div class="card" style="text-align: center; padding: 40px; opacity: 0.5;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
                    <div>Aucune opportunité pour la période sélectionnée</div>
                </div>
            `;
        }

        return `
            <div class="opportunites-list" style="display: grid; gap: 15px;">
                ${opportunites.map(opp => {
                    const statutBadge = this.getStatutBadge(opp.statut);
                    const probaBadge = this.getProbabiliteBadge(opp.probabilite);
                    const probaIndex = opp.probabilite < 34 ? 0 : opp.probabilite < 67 ? 1 : 2;
                    const marginLeft = probaIndex * 20;

                    return `
                        <div class="card opportunite-card" data-opp-id="${opp.id}" style="
                            cursor: pointer;
                            margin-left: ${marginLeft}px;
                            border-left: 4px solid ${opp.dejaTravaillé ? '#10b981' : 'transparent'};
                            background: ${opp.dejaTravaillé ? 'rgba(16, 185, 129, 0.05)' : 'var(--panel)'};">
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: start;">
                                <div>
                                    <h3 style="font-size: 18px; margin-bottom: 8px;">${opp.nom}</h3>
                                    <div style="font-size: 13px; opacity: 0.7; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                        <span>🏢 ${opp.client}</span>
                                        ${opp.dejaTravaillé ? `
                                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #10b981; color: #fff;">
                                                ✓ Déjà travaillé
                                            </span>
                                        ` : ''}
                                        <span>📞 ${opp.contact}</span>
                                    </div>
                                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
                                        <span class="badge" style="background: ${statutBadge.bg}; color: ${statutBadge.color};">${opp.statut}</span>
                                        <span class="badge" style="background: ${probaBadge.bg}; color: ${probaBadge.color};">${probaBadge.text} (${opp.probabilite}%)</span>
                                        <span class="badge" style="background: rgba(100, 100, 100, 0.2);">${opp.domaine} - ${opp.type}</span>
                                    </div>
                                    ${opp.notes ? `<p style="font-size: 13px; font-style: italic; opacity: 0.7;">${opp.notes}</p>` : ''}
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 5px;">
                                        ${this.formatMontant(opp.montantEstime / 1000000)} M€
                                    </div>
                                    <div style="font-size: 11px; opacity: 0.6;">
                                        Pondéré: ${this.formatMontant((opp.montantEstime * opp.probabilite / 100) / 1000000)} M€
                                    </div>
                                    <div style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                                        📅 Échéance: ${new Date(opp.echeance).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <button class="btn btn-secondary" data-edit-opp="${opp.id}" style="padding: 4px 8px; font-size: 11px;">✏️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderStatistiques(opportunites) {
        const statuts = ['Prospection', 'Proposition envoyée', 'Négociation', 'Contrat signé'];
        const domaines = [...new Set(opportunites.map(o => o.domaine))];

        return `
            <div style="display: grid; gap: 20px;">
                <div class="card">
                    <h3 style="margin-bottom: 15px;">📊 Répartition par statut</h3>
                    <div style="display: grid; gap: 10px;">
                        ${statuts.map(statut => {
                            const oppStatut = opportunites.filter(o => o.statut === statut);
                            const count = oppStatut.length;
                            const montant = oppStatut.reduce((sum, o) => sum + o.montantEstime, 0);
                            const badge = this.getStatutBadge(statut);

                            if (count === 0) return '';

                            return `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 12px;
                                    background: rgba(0,0,0,0.02);
                                    border-radius: 8px;
                                    border-left: 4px solid ${badge.bg};">
                                    <div>
                                        <span class="badge" style="background: ${badge.bg}; color: ${badge.color}; margin-right: 10px;">${statut}</span>
                                        <span style="font-size: 13px; opacity: 0.7;">${count} opportunité(s)</span>
                                    </div>
                                    <div style="font-weight: bold; font-size: 16px;">
                                        ${this.formatMontant(montant / 1000000)} M€
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 15px;">🏗️ Répartition par domaine</h3>
                    <div style="display: grid; gap: 10px;">
                        ${domaines.map(domaine => {
                            const oppDomaine = opportunites.filter(o => o.domaine === domaine);
                            const count = oppDomaine.length;
                            const montant = oppDomaine.reduce((sum, o) => sum + o.montantEstime, 0);
                            const pourcentage = (count / opportunites.length) * 100;

                            return `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 12px;
                                    background: rgba(0,0,0,0.02);
                                    border-radius: 8px;">
                                    <div>
                                        <span style="font-weight: bold; margin-right: 10px;">${domaine}</span>
                                        <span style="font-size: 13px; opacity: 0.7;">
                                            ${count} opportunité(s) (${pourcentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div style="font-weight: bold; font-size: 16px; color: #3b82f6;">
                                        ${this.formatMontant(montant / 1000000)} M€
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderModal(opp) {
        const probaBadge = this.getProbabiliteBadge(opp.probabilite);

        return `
            <div class="modal-overlay" data-close-modal>
                <div class="modal-content card" style="max-width: 700px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                        <h3>${opp.nom}</h3>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-secondary" data-action="edit-from-modal">✏️ Modifier</button>
                            <button class="btn btn-secondary" data-close-modal>✕</button>
                        </div>
                    </div>

                    <div class="section-box" style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">📋 Informations générales</h4>
                        <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>Client:</strong> ${opp.client}</div>
                            <div><strong>Contact:</strong> ${opp.contact}</div>
                            ${opp.tel ? `<div><strong>Téléphone:</strong> ${opp.tel}</div>` : ''}
                            ${opp.email ? `<div><strong>Email:</strong> ${opp.email}</div>` : ''}
                        </div>
                    </div>

                    <div class="section-box" style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">🏗️ Caractéristiques</h4>
                        <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div><strong>Domaine:</strong> ${opp.domaine}</div>
                            <div><strong>Type:</strong> ${opp.type}</div>
                            <div><strong>Montant estimé:</strong> <span style="color: #10b981; font-weight: bold;">${this.formatMontant(opp.montantEstime / 1000000)} M€</span></div>
                            <div><strong>Probabilité:</strong> <span style="color: ${probaBadge.bg};">${opp.probabilite}%</span></div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" data-close-modal>Fermer</button>
                        <button class="btn btn-primary">✏️ Modifier</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Periode buttons
        document.querySelectorAll('[data-periode]').forEach(btn => {
            btn.addEventListener('click', () => this.setPeriode(btn.dataset.periode));
        });

        // View mode buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
        });

        // Opportunite cards
        document.querySelectorAll('.opportunite-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-edit-opp]')) return;
                const oppId = parseInt(card.dataset.oppId);
                const opp = this.state.opportunites.find(o => o.id === oppId);
                if (opp) this.selectOpportunite(opp);
            });
        });

        // Edit buttons
        document.querySelectorAll('[data-edit-opp]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const oppId = parseInt(btn.dataset.editOpp);
                const opp = this.state.opportunites.find(o => o.id === oppId);
                if (opp) this.selectOpportunite(opp);
            });
        });

        // Modal close
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || e.target.hasAttribute('data-close-modal')) {
                    this.closeModal();
                }
            });
        });

        // New opportunite button
        document.querySelector('[data-action="new-opportunite"]')?.addEventListener('click', () => {
            showToast('Formulaire de nouvelle opportunité à implémenter', 'info');
        });
    }
}
