/**
 * Page Honoraires - Calcul et gestion des honoraires
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { formatCurrency, formatNumber } from '../utils/format.js';
import { $ } from '../utils/dom.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { t } from '../i18n/index.js';

export class HonorairesPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            loading: false,
            activeTab: 'scenarios',
            montantTravaux: 500000,
            missionId: null,
            inheritedData: null,

            // Pourcentages de base par mission
            basePercentages: {
                'Esquisse (ESQ)': 3,
                'Avant-Projet Sommaire (APS)': 5,
                'Avant-Projet Détaillé (APD)': 7,
                'Projet (PRO)': 10,
                'Dossier de Consultation (DC)': 3,
                'Direction des Travaux (DET)': 8
            },

            // Partenaires avec pourcentages et montants
            partenaires: [
                {
                    id: 1,
                    nom: 'Architecte Principal',
                    coutHoraire: 85,
                    coutHoraireMinimum: 70,
                    heuresEstimees: 200,
                    pourcentage: 0,
                    montantPrevisionnel: 0
                },
                {
                    id: 2,
                    nom: 'Architecte Associé',
                    coutHoraire: 70,
                    coutHoraireMinimum: 55,
                    heuresEstimees: 150,
                    pourcentage: 0,
                    montantPrevisionnel: 0
                }
            ],

            // Scénarios
            scenarios: [
                {
                    id: 'base',
                    nom: 'Base',
                    description: 'Scénario de base avec pourcentages standards',
                    pourcentages: {},
                    bloque: false,
                    actif: true
                },
                {
                    id: 'evolution-1',
                    nom: 'Évolution 1',
                    description: 'Première variante du scénario',
                    pourcentages: {},
                    bloque: false,
                    actif: false
                },
                {
                    id: 'evolution-2',
                    nom: 'Évolution 2',
                    description: 'Deuxième variante du scénario',
                    pourcentages: {},
                    bloque: false,
                    actif: false
                }
            ],
            activeScenarioId: 'base',

            // Évolutions
            evolutions: []
        };
    }

    onMount() {
        // Initialiser les pourcentages des scénarios
        this.state.scenarios = this.state.scenarios.map(s => ({
            ...s,
            pourcentages: { ...this.state.basePercentages }
        }));
        this.bindEvents();
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // Onglets
        container.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setState({ activeTab: e.currentTarget.dataset.tab });
            });
        });

        // Montant des travaux
        const montantInput = container.querySelector('#montant-travaux');
        if (montantInput) {
            montantInput.addEventListener('change', (e) => {
                this.setState({ montantTravaux: parseFloat(e.target.value) || 0 });
            });
        }

        // Mission ID
        const missionInput = container.querySelector('#mission-id');
        if (missionInput) {
            missionInput.addEventListener('change', (e) => {
                this.setState({ missionId: e.target.value ? parseInt(e.target.value) : null });
            });
        }

        // Boutons d'export
        container.querySelector('#btn-export-excel')?.addEventListener('click', () => this.exportExcel());
        container.querySelector('#btn-export-pdf')?.addEventListener('click', () => this.exportPDF());
        container.querySelector('#btn-save')?.addEventListener('click', () => this.save());

        // Partenaires
        this.bindPartenaireEvents();

        // Scénarios
        this.bindScenarioEvents();
    }

    bindPartenaireEvents() {
        const container = this.container;
        if (!container) return;

        // Modifier coût horaire moyen
        container.querySelectorAll('[data-partenaire-cout]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.partenaireCout);
                this.updatePartenaire(index, 'coutHoraire', parseFloat(e.target.value) || 0);
            });
        });

        // Modifier coût horaire minimum
        container.querySelectorAll('[data-partenaire-cout-min]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.partenaireCoutMin);
                this.updatePartenaire(index, 'coutHoraireMinimum', parseFloat(e.target.value) || 0);
            });
        });

        // Modifier pourcentage
        container.querySelectorAll('[data-partenaire-pourcentage]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.partenairePourcentage);
                const newPourcentage = parseFloat(e.target.value) || 0;
                const newMontant = (this.state.montantTravaux * newPourcentage) / 100;
                const partenaire = this.state.partenaires[index];
                const newHeures = partenaire.coutHoraire > 0 ? newMontant / partenaire.coutHoraire : partenaire.heuresEstimees;

                this.updatePartenaireMultiple(index, {
                    pourcentage: newPourcentage,
                    montantPrevisionnel: newMontant,
                    heuresEstimees: newHeures
                });
            });
        });

        // Modifier montant prévisionnel
        container.querySelectorAll('[data-partenaire-montant]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.partenaireMontant);
                const newMontant = parseFloat(e.target.value) || 0;
                const newPourcentage = this.state.montantTravaux > 0 ? (newMontant / this.state.montantTravaux) * 100 : 0;
                const partenaire = this.state.partenaires[index];
                const newHeures = partenaire.coutHoraire > 0 ? newMontant / partenaire.coutHoraire : partenaire.heuresEstimees;

                this.updatePartenaireMultiple(index, {
                    montantPrevisionnel: newMontant,
                    pourcentage: newPourcentage,
                    heuresEstimees: newHeures
                });
            });
        });

        // Modifier heures estimées
        container.querySelectorAll('[data-partenaire-heures]').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.partenaireHeures);
                const newHeures = parseFloat(e.target.value) || 0;
                const partenaire = this.state.partenaires[index];
                const newMontant = partenaire.coutHoraire * newHeures;
                const newPourcentage = this.state.montantTravaux > 0 ? (newMontant / this.state.montantTravaux) * 100 : 0;

                this.updatePartenaireMultiple(index, {
                    heuresEstimees: newHeures,
                    montantPrevisionnel: newMontant,
                    pourcentage: newPourcentage
                });
            });
        });
    }

    bindScenarioEvents() {
        const container = this.container;
        if (!container) return;

        // Sélectionner un scénario
        container.querySelectorAll('[data-scenario-select]').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.scenarioSelect;
                this.setState({ activeScenarioId: id });
            });
        });

        // Ajouter un scénario
        container.querySelector('#btn-add-scenario')?.addEventListener('click', () => this.addScenario());

        // Dupliquer un scénario
        container.querySelectorAll('[data-scenario-duplicate]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.duplicateScenario(e.currentTarget.dataset.scenarioDuplicate);
            });
        });

        // Supprimer un scénario
        container.querySelectorAll('[data-scenario-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteScenario(e.currentTarget.dataset.scenarioDelete);
            });
        });

        // Évolutions - modifier pourcentage
        container.querySelectorAll('[data-evolution-pourcentage]').forEach(input => {
            input.addEventListener('change', (e) => {
                const [evolutionId, missionId] = e.target.dataset.evolutionPourcentage.split('|');
                this.updateEvolutionPourcentage(evolutionId, missionId, parseFloat(e.target.value) || 0);
            });
        });

        // Évolutions - bloquer/débloquer
        container.querySelectorAll('[data-evolution-toggle-lock]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleEvolutionLock(e.currentTarget.dataset.evolutionToggleLock);
            });
        });

        // Évolutions - supprimer
        container.querySelectorAll('[data-evolution-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteEvolution(e.currentTarget.dataset.evolutionDelete);
            });
        });

        // Ajouter évolution
        container.querySelector('#btn-add-evolution')?.addEventListener('click', () => this.addEvolution());
    }

    updatePartenaire(index, field, value) {
        const partenaires = [...this.state.partenaires];
        partenaires[index] = { ...partenaires[index], [field]: value };
        this.setState({ partenaires });
    }

    updatePartenaireMultiple(index, updates) {
        const partenaires = [...this.state.partenaires];
        partenaires[index] = { ...partenaires[index], ...updates };
        this.setState({ partenaires });
    }

    addScenario() {
        const scenarios = [...this.state.scenarios];
        const newScenario = {
            id: `scenario-${Date.now()}`,
            nom: `Scénario ${scenarios.length}`,
            description: 'Nouveau scénario',
            pourcentages: { ...this.state.basePercentages },
            bloque: false,
            actif: false
        };
        scenarios.push(newScenario);
        this.setState({ scenarios, activeScenarioId: newScenario.id });
        toast.success('Nouveau scénario créé');
    }

    duplicateScenario(scenarioId) {
        const scenario = this.state.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        const scenarios = [...this.state.scenarios];
        const newScenario = {
            id: `scenario-${Date.now()}`,
            nom: `${scenario.nom} (Copie)`,
            description: `Copie de ${scenario.nom}`,
            pourcentages: { ...scenario.pourcentages },
            bloque: false,
            actif: false
        };
        scenarios.push(newScenario);
        this.setState({ scenarios, activeScenarioId: newScenario.id });
        toast.success('Scénario dupliqué');
    }

    async deleteScenario(scenarioId) {
        if (scenarioId === 'base') {
            toast.warning('Le scénario de base ne peut pas être supprimé');
            return;
        }

        const scenario = this.state.scenarios.find(s => s.id === scenarioId);
        const confirmed = await modal.confirm({
            title: 'Supprimer le scénario',
            message: `Êtes-vous sûr de vouloir supprimer le scénario "${scenario?.nom}" ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            const scenarios = this.state.scenarios.filter(s => s.id !== scenarioId);
            const activeScenarioId = this.state.activeScenarioId === scenarioId ? 'base' : this.state.activeScenarioId;
            this.setState({ scenarios, activeScenarioId });
            toast.info('Scénario supprimé');
        }
    }

    // Évolutions
    getEvolutions() {
        const activeScenario = this.state.scenarios.find(s => s.id === this.state.activeScenarioId);
        if (!activeScenario) return [];

        return [
            { id: 'base', nom: 'Base', pourcentages: { ...activeScenario.pourcentages }, bloque: false },
            { id: 'evolution-1', nom: 'Évolution 1', pourcentages: { ...activeScenario.pourcentages }, bloque: false },
            { id: 'evolution-2', nom: 'Évolution 2', pourcentages: { ...activeScenario.pourcentages }, bloque: false },
            ...this.state.evolutions
        ];
    }

    updateEvolutionPourcentage(evolutionId, missionId, value) {
        // Pour simplifier, on met à jour les pourcentages du scénario actif
        const scenarios = this.state.scenarios.map(s => {
            if (s.id === this.state.activeScenarioId) {
                return {
                    ...s,
                    pourcentages: {
                        ...s.pourcentages,
                        [missionId]: value
                    }
                };
            }
            return s;
        });
        this.setState({ scenarios });
    }

    toggleEvolutionLock(evolutionId) {
        // Toggle lock state
        const evolutions = this.state.evolutions.map(e => {
            if (e.id === evolutionId) {
                return { ...e, bloque: !e.bloque };
            }
            return e;
        });
        this.setState({ evolutions });
        toast.info(evolutions.find(e => e.id === evolutionId)?.bloque ? 'Évolution bloquée' : 'Évolution débloquée');
    }

    deleteEvolution(evolutionId) {
        if (evolutionId === 'base') return;
        const evolutions = this.state.evolutions.filter(e => e.id !== evolutionId);
        this.setState({ evolutions });
        toast.info('Évolution supprimée');
    }

    addEvolution() {
        const evolutions = [...this.state.evolutions];
        const activeScenario = this.state.scenarios.find(s => s.id === this.state.activeScenarioId);
        evolutions.push({
            id: `evolution-${Date.now()}`,
            nom: `Évolution ${evolutions.length + 3}`,
            pourcentages: { ...(activeScenario?.pourcentages || this.state.basePercentages) },
            bloque: false
        });
        this.setState({ evolutions });
        toast.success('Nouvelle évolution ajoutée');
    }

    // Calculs
    calculerMontantsMission(pourcentages) {
        const resultats = {};
        let total = 0;
        Object.entries(pourcentages).forEach(([mission, pourcentage]) => {
            const montant = (this.state.montantTravaux * pourcentage) / 100;
            resultats[mission] = { pourcentage, montant };
            total += montant;
        });
        return { resultats, total };
    }

    calculerTotauxPartenaires() {
        const { partenaires, montantTravaux } = this.state;
        const totalPourcentage = partenaires.reduce((sum, p) => sum + p.pourcentage, 0);
        const totalMontant = partenaires.reduce((sum, p) => sum + (p.montantPrevisionnel || (montantTravaux * p.pourcentage / 100)), 0);
        const totalHeures = partenaires.reduce((sum, p) => sum + p.heuresEstimees, 0);
        const totalHeuresEuros = partenaires.reduce((sum, p) => sum + (p.coutHoraire * p.heuresEstimees), 0);
        const coutHoraireMoyen = partenaires.length > 0
            ? partenaires.reduce((sum, p) => sum + p.coutHoraire, 0) / partenaires.length
            : 0;
        const coutHoraireMin = partenaires.length > 0
            ? Math.min(...partenaires.map(p => p.coutHoraireMinimum || p.coutHoraire))
            : 0;

        return { totalPourcentage, totalMontant, totalHeures, totalHeuresEuros, coutHoraireMoyen, coutHoraireMin };
    }

    // Ventilation
    calculerVentilation() {
        const { basePercentages, partenaires, montantTravaux } = this.state;
        const missions = Object.keys(basePercentages);
        const resultats = {
            missions: [],
            partenaires: partenaires.map(p => ({ ...p, total: 0 })),
            totalGlobal: 0
        };

        const coutTotalPartenaires = partenaires.reduce((sum, p) =>
            sum + (p.coutHoraire || 0) * (p.heuresEstimees || 0), 0
        );

        missions.forEach(mission => {
            const pourcentage = basePercentages[mission] || 0;
            const montantMission = (montantTravaux * pourcentage) / 100;

            const repartitionPartenaires = partenaires.map((p, index) => {
                const coutPartenaire = (p.coutHoraire || 0) * (p.heuresEstimees || 0);
                const ratio = coutTotalPartenaires > 0 ? coutPartenaire / coutTotalPartenaires : 1 / partenaires.length;
                const montantPartenaire = montantMission * ratio;
                const heuresPartenaire = montantPartenaire / (p.coutHoraire || 1);

                resultats.partenaires[index].total += montantPartenaire;

                return {
                    partenaireId: p.nom,
                    montant: montantPartenaire,
                    heures: heuresPartenaire
                };
            });

            const heuresTotal = repartitionPartenaires.reduce((sum, r) => sum + r.heures, 0);

            resultats.missions.push({
                nom: mission,
                pourcentage,
                montant: montantMission,
                heuresTotal,
                repartitionPartenaires
            });

            resultats.totalGlobal += montantMission;
        });

        return resultats;
    }

    // Export
    exportExcel() {
        toast.info('Export Excel en cours...');
        // Simulation export
        setTimeout(() => {
            toast.success('Export Excel réussi');
        }, 1000);
    }

    exportPDF() {
        toast.info('Export PDF en cours...');
        // Simulation export
        setTimeout(() => {
            toast.success('Export PDF réussi');
        }, 1000);
    }

    save() {
        toast.info('Sauvegarde en cours...');
        // Simulation sauvegarde
        setTimeout(() => {
            toast.success('Honoraires sauvegardés');
        }, 500);
    }

    render() {
        const {
            activeTab, montantTravaux, missionId, inheritedData,
            basePercentages, partenaires, scenarios, activeScenarioId
        } = this.state;

        const totaux = this.calculerTotauxPartenaires();
        const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

        return `
            <div class="page-honoraires">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.fileText}
                            Calcul d'Honoraires
                        </h1>
                        <p class="page-subtitle">
                            Évolution en temps réel des pourcentages et ventilation par mission/partenaire
                        </p>
                    </div>
                    <div class="page-actions">
                        <button id="btn-save" class="btn btn-secondary">
                            ${icons.save}
                            <span>Sauvegarder</span>
                        </button>
                        <button id="btn-export-excel" class="btn btn-secondary">
                            ${icons.download}
                            <span>Exporter Excel</span>
                        </button>
                        <button id="btn-export-pdf" class="btn btn-primary">
                            ${icons.download}
                            <span>Exporter PDF</span>
                        </button>
                    </div>
                </div>

                <!-- Mission Link -->
                <div class="card mb-4">
                    <label class="form-label">
                        Lier à une Mission (optionnel - pour héritage automatique)
                    </label>
                    <input
                        type="number"
                        id="mission-id"
                        class="form-input"
                        style="max-width: 250px;"
                        value="${missionId || ''}"
                        placeholder="ID de la mission"
                    />
                    <p class="form-hint">
                        Si une mission est sélectionnée, le montant des travaux et l'équipe seront hérités automatiquement
                    </p>
                </div>

                <!-- Montant des travaux -->
                <div class="card mb-4">
                    <label class="form-label">
                        Montant des Travaux (€) ${inheritedData?.montantTravaux ? '(hérité, non modifiable)' : ''}
                    </label>
                    <input
                        type="number"
                        id="montant-travaux"
                        class="form-input"
                        style="max-width: 250px;"
                        value="${montantTravaux}"
                        ${inheritedData?.montantTravaux ? 'disabled' : ''}
                        placeholder="Montant des travaux"
                    />
                    <p class="form-hint">
                        ${inheritedData?.montantTravaux
                            ? 'Ce montant est hérité de la mission et ne peut pas être modifié'
                            : 'Ce montant est unique et sera utilisé pour tous les calculs d\'honoraires'}
                    </p>
                </div>

                <!-- Tableau équipe -->
                <div class="card mb-4">
                    <h2 class="card-title">
                        ${icons.users}
                        Équipe constituée - Répartition des honoraires
                    </h2>

                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Poste</th>
                                    <th class="hide-mobile">Coût horaire moyen HT / Minimum (€/h)</th>
                                    <th class="text-center">Pourcentage (%)</th>
                                    <th class="text-center">Montant prévisionnel (€ HT)</th>
                                    <th class="text-center hide-tablet">Heures estimées</th>
                                    <th class="text-center hide-tablet">Total heures (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${partenaires.map((p, index) => {
                                    const montantCalc = p.pourcentage > 0
                                        ? (montantTravaux * p.pourcentage) / 100
                                        : p.montantPrevisionnel;
                                    const heuresCalc = p.coutHoraire > 0 && montantCalc > 0
                                        ? montantCalc / p.coutHoraire
                                        : p.heuresEstimees;
                                    const totalHeures = p.coutHoraire * p.heuresEstimees;

                                    return `
                                        <tr>
                                            <td class="font-medium">${p.nom}</td>
                                            <td class="hide-mobile">
                                                <div class="flex flex-col gap-2">
                                                    <div>
                                                        <label class="text-xs text-muted">Moyen HT (€/h)</label>
                                                        <input
                                                            type="number"
                                                            class="form-input form-input-sm"
                                                            data-partenaire-cout="${index}"
                                                            value="${p.coutHoraire}"
                                                            step="0.01"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label class="text-xs text-muted">Minimum (€/h)</label>
                                                        <input
                                                            type="number"
                                                            class="form-input form-input-sm"
                                                            data-partenaire-cout-min="${index}"
                                                            value="${p.coutHoraireMinimum || 0}"
                                                            step="0.01"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    class="form-input form-input-sm text-center"
                                                    data-partenaire-pourcentage="${index}"
                                                    value="${p.pourcentage}"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    class="form-input form-input-sm text-center"
                                                    data-partenaire-montant="${index}"
                                                    value="${montantCalc.toFixed(2)}"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </td>
                                            <td class="hide-tablet">
                                                <input
                                                    type="number"
                                                    class="form-input form-input-sm text-center"
                                                    data-partenaire-heures="${index}"
                                                    value="${heuresCalc.toFixed(1)}"
                                                    step="0.1"
                                                    min="0"
                                                />
                                            </td>
                                            <td class="text-center hide-tablet font-medium">
                                                ${formatCurrency(totalHeures)}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                            <tfoot>
                                <tr class="font-bold bg-muted">
                                    <td>TOTAL</td>
                                    <td class="hide-mobile">
                                        ${totaux.coutHoraireMoyen.toFixed(2)} €/h (moy.) / ${totaux.coutHoraireMin.toFixed(2)} €/h (min.)
                                    </td>
                                    <td class="text-center">${totaux.totalPourcentage.toFixed(2)}%</td>
                                    <td class="text-center">${formatCurrency(totaux.totalMontant)}</td>
                                    <td class="text-center hide-tablet">${totaux.totalHeures.toFixed(1)} h</td>
                                    <td class="text-center hide-tablet">${formatCurrency(totaux.totalHeuresEuros)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- Résumé honoraires prévisionnels -->
                    <div class="honoraires-summary mt-4">
                        <h3 class="text-lg font-bold mb-3">Honoraires prévisionnels</h3>
                        <div class="stats-grid stats-grid-3">
                            <div class="stat-card">
                                <div class="stat-label">Total honoraires équipe</div>
                                <div class="stat-value">${formatCurrency(totaux.totalMontant)} HT</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">Total heures</div>
                                <div class="stat-value">${totaux.totalHeures.toFixed(1)} h</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">Coût horaire moyen</div>
                                <div class="stat-value">${totaux.totalHeures > 0 ? formatCurrency(totaux.totalMontant / totaux.totalHeures) : '0,00 €'}/h</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs mb-4">
                    <button class="tab ${activeTab === 'scenarios' ? 'active' : ''}" data-tab="scenarios">
                        ${icons.fileText}
                        Scénarios
                    </button>
                    <button class="tab ${activeTab === 'evolution' ? 'active' : ''}" data-tab="evolution">
                        ${icons.trendingUp}
                        Évolution des %
                    </button>
                    <button class="tab ${activeTab === 'ventilation' ? 'active' : ''}" data-tab="ventilation">
                        ${icons.users}
                        Ventilation Mission/Partenaire
                    </button>
                </div>

                <!-- Tab Content -->
                ${activeTab === 'scenarios' ? this.renderScenariosTab() : ''}
                ${activeTab === 'evolution' ? this.renderEvolutionTab() : ''}
                ${activeTab === 'ventilation' ? this.renderVentilationTab() : ''}
            </div>
        `;
    }

    renderScenariosTab() {
        const { scenarios, activeScenarioId, basePercentages } = this.state;

        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">Scénarios d'Honoraires</h3>
                        <p class="card-subtitle">Gérez plusieurs scénarios d'honoraires (Base, Évolution 1, Évolution 2)</p>
                    </div>
                    <button id="btn-add-scenario" class="btn btn-primary">
                        ${icons.plus}
                        <span>Nouveau scénario</span>
                    </button>
                </div>

                <!-- Liste des scénarios -->
                <div class="scenarios-grid mb-4">
                    ${scenarios.map(scenario => `
                        <div
                            class="scenario-card ${activeScenarioId === scenario.id ? 'active' : ''}"
                            data-scenario-select="${scenario.id}"
                        >
                            <div class="scenario-header">
                                <div class="scenario-title">
                                    <span>${scenario.nom}</span>
                                    ${scenario.id === 'base' ? '<span class="badge badge-info">Base</span>' : ''}
                                    ${activeScenarioId === scenario.id ? icons.checkCircle : ''}
                                </div>
                            </div>
                            <p class="scenario-description">${scenario.description}</p>
                            ${scenario.id !== 'base' ? `
                                <div class="scenario-actions">
                                    <button class="btn btn-sm btn-ghost" data-scenario-duplicate="${scenario.id}">
                                        ${icons.copy}
                                        Dupliquer
                                    </button>
                                    <button class="btn btn-sm btn-ghost btn-danger" data-scenario-delete="${scenario.id}">
                                        ${icons.trash}
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Actions sur le scénario actif -->
                <div class="card-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.card').querySelector('#btn-save')?.click()">
                        ${icons.save}
                        <span>Sauvegarder</span>
                    </button>
                    <button class="btn btn-secondary">
                        ${icons.download}
                        <span>Excel</span>
                    </button>
                    <button class="btn btn-primary">
                        ${icons.download}
                        <span>PDF</span>
                    </button>
                </div>

                <!-- Tableau des pourcentages par mission -->
                <div class="mt-4">
                    <h4 class="font-semibold mb-2">Pourcentages par mission</h4>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Mission</th>
                                    <th class="text-center">Pourcentage (%)</th>
                                    <th class="text-right">Montant (€ HT)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(scenarios.find(s => s.id === activeScenarioId)?.pourcentages || basePercentages).map(([mission, pourcentage]) => `
                                    <tr>
                                        <td>${mission}</td>
                                        <td class="text-center">${pourcentage.toFixed(1)}%</td>
                                        <td class="text-right">${formatCurrency((this.state.montantTravaux * pourcentage) / 100)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr class="font-bold">
                                    <td>Total</td>
                                    <td class="text-center">
                                        ${Object.values(scenarios.find(s => s.id === activeScenarioId)?.pourcentages || basePercentages).reduce((sum, p) => sum + p, 0).toFixed(1)}%
                                    </td>
                                    <td class="text-right">
                                        ${formatCurrency(Object.values(scenarios.find(s => s.id === activeScenarioId)?.pourcentages || basePercentages).reduce((sum, p) => sum + (this.state.montantTravaux * p / 100), 0))}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderEvolutionTab() {
        const { basePercentages, montantTravaux } = this.state;
        const evolutions = this.getEvolutions();
        const missions = Object.keys(basePercentages);

        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">Évolution des Pourcentages</h3>
                        <p class="card-subtitle">Modifiez les % en temps réel et suivez l'évolution des montants</p>
                    </div>
                    <button id="btn-add-evolution" class="btn btn-primary">
                        ${icons.plus}
                        <span>Nouvelle Évolution</span>
                    </button>
                </div>

                <!-- Règle 60/40 -->
                <div class="alert alert-info mb-4">
                    <strong>Règle indicative 60/40 :</strong> Les pourcentages totaux devraient se situer entre 60% et 100% (indication, non bloquante)
                </div>

                <!-- Tableau évolutions -->
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mission</th>
                                ${evolutions.slice(0, 3).map(evolution => `
                                    <th class="text-center" style="min-width: 150px;">
                                        <div class="evolution-header">
                                            <span>${evolution.nom}</span>
                                            ${evolution.id !== 'base' ? `
                                                <button class="btn-icon btn-icon-sm" data-evolution-delete="${evolution.id}">
                                                    ${icons.trash}
                                                </button>
                                            ` : ''}
                                        </div>
                                        <div class="evolution-actions">
                                            <button class="btn-icon btn-icon-sm ${evolution.bloque ? 'text-danger' : ''}" data-evolution-toggle-lock="${evolution.id}">
                                                ${evolution.bloque ? icons.lock : icons.unlock}
                                            </button>
                                        </div>
                                        ${evolution.bloque ? '<span class="text-xs text-danger">Bloqué</span>' : ''}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${missions.map(mission => `
                                <tr>
                                    <td class="font-medium">${mission}</td>
                                    ${evolutions.slice(0, 3).map(evolution => {
                                        const pourcentage = evolution.pourcentages[mission] || basePercentages[mission] || 0;
                                        const montant = (montantTravaux * pourcentage) / 100;
                                        return `
                                            <td class="text-center">
                                                <div class="evolution-cell">
                                                    <input
                                                        type="number"
                                                        class="form-input form-input-sm text-center"
                                                        data-evolution-pourcentage="${evolution.id}|${mission}"
                                                        value="${pourcentage}"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        ${evolution.bloque ? 'disabled' : ''}
                                                    />
                                                    <div class="text-xs text-muted mt-1">${formatCurrency(montant)}</div>
                                                </div>
                                            </td>
                                        `;
                                    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="font-bold bg-muted">
                                <td>Total</td>
                                ${evolutions.slice(0, 3).map(evolution => {
                                    const totalPourcentage = Object.values(evolution.pourcentages || basePercentages).reduce((sum, p) => sum + (p || 0), 0);
                                    const totalMontant = (montantTravaux * totalPourcentage) / 100;
                                    const isValid = totalPourcentage >= 60 && totalPourcentage <= 100;
                                    return `
                                        <td class="text-center">
                                            <div class="${isValid ? 'text-success' : 'text-warning'}">
                                                ${formatCurrency(totalMontant)}
                                            </div>
                                            <div class="text-sm ${isValid ? 'text-success' : 'text-warning'}">
                                                ${totalPourcentage.toFixed(1)}%
                                            </div>
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }

    renderVentilationTab() {
        const ventilation = this.calculerVentilation();
        const { partenaires } = this.state;

        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">Ventilation Mission par Mission et par Partenaire</h3>
                        <p class="card-subtitle">Répartition détaillée des honoraires par mission et par partenaire</p>
                    </div>
                </div>

                <!-- Tableau ventilation -->
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mission</th>
                                <th class="text-center">% Base</th>
                                <th class="text-right">Montant Mission</th>
                                <th class="text-right">Heures Total</th>
                                ${partenaires.map(p => `
                                    <th class="text-center" style="min-width: 180px;">
                                        <div>${p.nom}</div>
                                        <div class="text-xs text-muted">${formatCurrency(p.coutHoraire)}/h</div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${ventilation.missions.map(mission => `
                                <tr>
                                    <td class="font-medium">${mission.nom}</td>
                                    <td class="text-center">${mission.pourcentage.toFixed(1)}%</td>
                                    <td class="text-right font-medium">${formatCurrency(mission.montant)}</td>
                                    <td class="text-right">${mission.heuresTotal.toFixed(1)} h</td>
                                    ${mission.repartitionPartenaires.map(rep => `
                                        <td class="text-center">
                                            <div class="font-medium">${formatCurrency(rep.montant)}</div>
                                            <div class="text-xs text-muted">${rep.heures.toFixed(1)} h</div>
                                            <div class="text-xs text-muted">${((rep.montant / mission.montant) * 100).toFixed(1)}%</div>
                                        </td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="font-bold bg-muted">
                                <td>Total</td>
                                <td class="text-center">
                                    ${Object.values(this.state.basePercentages).reduce((sum, p) => sum + (p || 0), 0).toFixed(1)}%
                                </td>
                                <td class="text-right">${formatCurrency(ventilation.totalGlobal)}</td>
                                <td class="text-right">
                                    ${ventilation.missions.reduce((sum, m) => sum + m.heuresTotal, 0).toFixed(1)} h
                                </td>
                                ${ventilation.partenaires.map((p, index) => {
                                    const totalHeures = ventilation.missions.reduce((sum, m) =>
                                        sum + (m.repartitionPartenaires[index]?.heures || 0), 0
                                    );
                                    return `
                                        <td class="text-center">
                                            <div>${formatCurrency(p.total)}</div>
                                            <div class="text-xs text-muted">${totalHeures.toFixed(1)} h</div>
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Résumé -->
                <div class="stats-grid stats-grid-3 mt-4">
                    <div class="stat-card stat-card-info">
                        <div class="stat-label">Montant Total</div>
                        <div class="stat-value">${formatCurrency(ventilation.totalGlobal)}</div>
                    </div>
                    <div class="stat-card stat-card-success">
                        <div class="stat-label">Heures Total</div>
                        <div class="stat-value">${ventilation.missions.reduce((sum, m) => sum + m.heuresTotal, 0).toFixed(1)} h</div>
                    </div>
                    <div class="stat-card stat-card-purple">
                        <div class="stat-label">Nombre de Missions</div>
                        <div class="stat-value">${ventilation.missions.length}</div>
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
export function renderHonorairesPage(container) {
    const page = new HonorairesPage();
    page.mount(container);
    return page;
}
