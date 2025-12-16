// Templates Page - Gestion des templates de missions
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';

export class TemplatesPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            activeTab: 'missions',
            selectedMissions: [],
            filterType: 'tous',
            showRecap: false,
            projetLie: null,
            missions: this.getDefaultMissions(),
            projetsDisponibles: this.getDefaultProjets()
        };
    }

    getDefaultMissions() {
        return [
            { id: 1, code: 'ESQ', nom: 'ESQ - Esquisse', type: 'Base', description: 'Étude préliminaire et faisabilité', coutHoraireMoyen: 85, heuresEstimees: 80 },
            { id: 2, code: 'APS', nom: 'APS - Avant-Projet Sommaire', type: 'Base', description: 'Définition des grandes lignes du projet', coutHoraireMoyen: 85, heuresEstimees: 120 },
            { id: 3, code: 'APD', nom: 'APD - Avant-Projet Définitif', type: 'Base', description: 'Plans détaillés et choix techniques', coutHoraireMoyen: 85, heuresEstimees: 160 },
            { id: 4, code: 'PRO', nom: 'PRO - Projet', type: 'Base', description: 'Dossier de consultation des entreprises', coutHoraireMoyen: 85, heuresEstimees: 200 },
            { id: 5, code: 'ACT', nom: 'ACT - Assistance aux contrats de travaux', type: 'Base', description: 'Analyse des offres et assistance administrative', coutHoraireMoyen: 85, heuresEstimees: 60 },
            { id: 6, code: 'VISA', nom: 'VISA - Visa', type: 'Additionnelle', description: "Validation des plans d'exécution", coutHoraireMoyen: 75, heuresEstimees: 40 },
            { id: 7, code: 'DET', nom: "DET - Direction de l'exécution des travaux", type: 'Complémentaire', description: 'Suivi complet du chantier', coutHoraireMoyen: 90, heuresEstimees: 300 },
            { id: 8, code: 'OPC', nom: 'OPC - Ordonnancement, pilotage, coordination', type: 'Complémentaire', description: 'Coordination générale des travaux', coutHoraireMoyen: 95, heuresEstimees: 250 },
            { id: 9, code: 'JURIDIQUE', nom: 'Assistance juridique', type: 'Optionnelle', description: 'Conseil juridique spécifique', coutHoraireMoyen: 120, heuresEstimees: 20 },
            { id: 10, code: 'DIAG', nom: 'Diagnostic technique', type: 'Additionnelle', description: 'Diagnostic structure et pathologies', coutHoraireMoyen: 95, heuresEstimees: 50 }
        ];
    }

    getDefaultProjets() {
        return [
            { id: 1, nom: 'Résidence Les Oliviers', maitreOuvrage: 'Ville de Lyon', montantTravauxHT: 2800000 },
            { id: 2, nom: 'Centre Commercial Rivoli', maitreOuvrage: 'SCI Immobilière', montantTravauxHT: 12000000 },
            { id: 3, nom: 'École Primaire Victor Hugo', maitreOuvrage: 'Mairie de Villeurbanne', montantTravauxHT: 4200000 }
        ];
    }

    formatMontant(montant) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(montant);
    }

    getTypeBadge(type) {
        const badges = {
            'Base': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            'Additionnelle': { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' },
            'Complémentaire': { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
            'Optionnelle': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
        };
        return badges[type] || { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
    }

    toggleMission(id) {
        const { selectedMissions } = this.state;
        if (selectedMissions.includes(id)) {
            this.setState({ selectedMissions: selectedMissions.filter(m => m !== id) });
        } else {
            this.setState({ selectedMissions: [...selectedMissions, id] });
        }
    }

    setFilterType(type) {
        this.setState({ filterType: type });
    }

    setProjetLie(projetId) {
        const projet = this.state.projetsDisponibles.find(p => p.id === parseInt(projetId));
        this.setState({ projetLie: projet || null });
    }

    getSelectedMissionsData() {
        return this.state.missions.filter(m => this.state.selectedMissions.includes(m.id));
    }

    getFilteredMissions() {
        const { filterType, missions } = this.state;
        return filterType === 'tous' ? missions : missions.filter(m => m.type === filterType);
    }

    render() {
        const { activeTab, selectedMissions, filterType, showRecap, projetLie, missions } = this.state;
        const filteredMissions = this.getFilteredMissions();
        const selectedData = this.getSelectedMissionsData();
        const totalHeures = selectedData.reduce((sum, m) => sum + m.heuresEstimees, 0);
        const coutTotal = selectedData.reduce((sum, m) => sum + (m.coutHoraireMoyen * m.heuresEstimees), 0);

        return `
            <div class="page-templates">
                <div class="tabs-nav" style="border-bottom: 2px solid var(--border); margin-bottom: 20px;">
                    <button class="tab-btn ${activeTab === 'missions' ? 'active' : ''}" data-tab="missions">
                        Templates de Missions
                    </button>
                    <button class="tab-btn ${activeTab === 'equipes' ? 'active' : ''}" data-tab="equipes">
                        Templates d'Équipe
                    </button>
                </div>

                ${activeTab === 'missions' ? this.renderMissionsTab(filteredMissions, selectedMissions, filterType, showRecap, projetLie, totalHeures, coutTotal, selectedData, missions) : this.renderEquipesTab()}
            </div>
        `;
    }

    renderMissionsTab(filteredMissions, selectedMissions, filterType, showRecap, projetLie, totalHeures, coutTotal, selectedData, missions) {
        return `
            <div class="page-header" style="margin-bottom: 20px;">
                <div>
                    <h2 style="font-size: 24px; margin-bottom: 5px;">Missions</h2>
                    <p style="font-size: 14px; opacity: 0.7;">Gestion des missions de base, additionnelles, complémentaires et optionnelles</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="btn ${selectedMissions.length === 0 ? 'btn-secondary' : ''}" data-action="toggle-recap"
                            ${selectedMissions.length === 0 ? 'disabled' : ''}>
                        📊 Récapitulatif (${selectedMissions.length})
                    </button>
                </div>
            </div>

            <!-- Liaison projet -->
            <div class="card" style="margin-bottom: 20px; background: rgba(59, 130, 246, 0.05);">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: center;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">🏢 Lier à un projet / Maître d'ouvrage</label>
                        <select class="form-select" id="projet-select" style="width: 100%;">
                            <option value="">-- Aucun projet lié --</option>
                            ${this.state.projetsDisponibles.map(p => `
                                <option value="${p.id}" ${projetLie?.id === p.id ? 'selected' : ''}>
                                    ${p.nom} - ${p.maitreOuvrage} (${this.formatMontant(p.montantTravauxHT)} HT)
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    ${projetLie ? `
                        <div style="padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; min-width: 250px;">
                            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Montant travaux HT</div>
                            <div style="font-size: 24px; font-weight: 700; color: #10b981;">${this.formatMontant(projetLie.montantTravauxHT)}</div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Filtres -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                ${['tous', 'Base', 'Additionnelle', 'Complémentaire', 'Optionnelle'].map(type => {
                    const count = type === 'tous' ? missions.length : missions.filter(m => m.type === type).length;
                    const badge = this.getTypeBadge(type);
                    return `
                        <button class="btn ${filterType === type ? '' : 'btn-secondary'}" data-filter="${type}"
                                style="${filterType === type && type !== 'tous' ? `background: ${badge.color}; color: white;` : ''}">
                            ${type === 'tous' ? 'Toutes' : type} (${count})
                        </button>
                    `;
                }).join('')}
            </div>

            <!-- Récapitulatif -->
            ${showRecap && selectedMissions.length > 0 ? this.renderRecap(selectedData, totalHeures, coutTotal) : ''}

            <!-- Liste des missions -->
            <div class="card">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 40px;"></th>
                                <th>Mission</th>
                                <th>Type</th>
                                <th style="text-align: center;">Heures</th>
                                <th style="text-align: center;">Coût horaire</th>
                                <th style="text-align: right;">Sous-total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredMissions.map(m => {
                                const badge = this.getTypeBadge(m.type);
                                const isSelected = selectedMissions.includes(m.id);
                                return `
                                    <tr style="${isSelected ? 'background: rgba(124, 58, 237, 0.05);' : ''}">
                                        <td>
                                            <input type="checkbox" class="mission-checkbox" data-mission-id="${m.id}"
                                                   ${isSelected ? 'checked' : ''}>
                                        </td>
                                        <td>
                                            <div style="font-weight: 500;">${m.nom}</div>
                                            <div style="font-size: 11px; opacity: 0.6; margin-top: 2px;">${m.description}</div>
                                        </td>
                                        <td>
                                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: ${badge.bg}; color: ${badge.color};">
                                                ${m.type}
                                            </span>
                                        </td>
                                        <td style="text-align: center; font-weight: bold;">${m.heuresEstimees} h</td>
                                        <td style="text-align: center; font-weight: bold;">${m.coutHoraireMoyen} €/h</td>
                                        <td style="text-align: right; font-weight: bold; color: var(--brand);">
                                            ${this.formatMontant(m.heuresEstimees * m.coutHoraireMoyen)}
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

    renderRecap(selectedData, totalHeures, coutTotal) {
        return `
            <div class="card" style="margin-bottom: 20px; background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.2);">
                <h3 style="margin-bottom: 15px;">📊 Récapitulatif de la sélection</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Missions sélectionnées</div>
                        <div style="font-size: 28px; font-weight: bold; color: #10b981;">${selectedData.length}</div>
                    </div>
                    <div style="padding: 15px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Total heures</div>
                        <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${totalHeures} h</div>
                    </div>
                    <div style="padding: 15px; background: rgba(124, 58, 237, 0.1); border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Coût total HT</div>
                        <div style="font-size: 28px; font-weight: bold; color: #7c3aed;">${this.formatMontant(coutTotal)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEquipesTab() {
        return `
            <div class="card" style="text-align: center; padding: 60px;">
                <div style="font-size: 48px; margin-bottom: 20px;">👥</div>
                <h3>Templates d'Équipe</h3>
                <p style="opacity: 0.7; margin-bottom: 20px;">Gérez vos templates d'équipe types pour vos projets</p>
                <button class="btn btn-primary">+ Nouveau template</button>
            </div>
        `;
    }

    bindEvents() {
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setState({ activeTab: btn.dataset.tab }));
        });

        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => this.setFilterType(btn.dataset.filter));
        });

        // Toggle recap
        document.querySelector('[data-action="toggle-recap"]')?.addEventListener('click', () => {
            this.setState({ showRecap: !this.state.showRecap });
        });

        // Projet select
        document.getElementById('projet-select')?.addEventListener('change', (e) => {
            this.setProjetLie(e.target.value);
        });

        // Mission checkboxes
        document.querySelectorAll('.mission-checkbox').forEach(cb => {
            cb.addEventListener('change', () => this.toggleMission(parseInt(cb.dataset.missionId)));
        });
    }
}
