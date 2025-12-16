// Missions Conseil Page - Gestion des missions de conseil
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class MissionsPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            missions: storage.get('wiw-missions-conseil') || [],
            showForm: false,
            editingId: null,
            formData: this.getEmptyFormData()
        };

        this.typesMissions = [
            { value: 'MOE', label: "1 - MOE (Maîtrise d'œuvre)", icon: '🏗️' },
            { value: 'AMO', label: "2 - AMO (Assistance Maîtrise d'Ouvrage)", icon: '🤝' },
            { value: 'FAISABILITE', label: '3 - Étude de Faisabilité', icon: '🔍' },
            { value: 'PREALABLE', label: '4 - Étude préalable', icon: '📊' },
            { value: 'PROG', label: '5 - PROG (Programme)', icon: '📄' },
            { value: 'CONSEIL', label: '6 - Conseil', icon: '💡' },
            { value: 'EXPERTISE', label: '7 - Expertise', icon: '🎓' },
            { value: 'AUDIT', label: '8 - Audit Technique et Financier', icon: '🔎' },
            { value: 'OPC', label: '9 - OPC (Ordonnancement, Pilotage, Coordination)', icon: '⚙️' },
            { value: 'SPS', label: '10 - SPS (Sécurité Protection Santé)', icon: '🦺' }
        ];

        this.statuts = {
            'brouillon': { label: 'Brouillon', color: '#6b7280' },
            'envoye': { label: 'Envoyé', color: '#3b82f6' },
            'accepte': { label: 'Accepté', color: '#10b981' },
            'refuse': { label: 'Refusé', color: '#ef4444' },
            'en_cours': { label: 'En cours', color: '#f59e0b' },
            'termine': { label: 'Terminé', color: '#8b5cf6' }
        };
    }

    getEmptyFormData() {
        return {
            numero: '',
            date: new Date().toISOString().slice(0, 10),
            typeMission: '',
            elementMission: 'Base',
            intitule: '',
            client: {
                nom: '',
                adresse: '',
                codePostal: '',
                ville: '',
                telephone: '',
                email: ''
            },
            equipe: [],
            description: '',
            dureeEstimee: '',
            coutHoraireMoyen: 0,
            montantTravauxHT: 0,
            honorairesPropose: 0,
            statut: 'brouillon',
            notes: ''
        };
    }

    showFormPanel() {
        this.setState({ showForm: true, formData: this.getEmptyFormData(), editingId: null });
    }

    hideFormPanel() {
        this.setState({ showForm: false, editingId: null });
    }

    editMission(mission) {
        this.setState({ showForm: true, formData: { ...mission }, editingId: mission.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deleteMission(id) {
        const mission = this.state.missions.find(m => m.id === id);
        const confirmed = await showConfirm(`Supprimer la mission "${mission?.numero}" ?`);
        if (confirmed) {
            const newMissions = this.state.missions.filter(m => m.id !== id);
            storage.set('wiw-missions-conseil', newMissions);
            this.setState({ missions: newMissions });
            showToast('Mission supprimée', 'success');
        }
    }

    duplicateMission(mission) {
        const copie = {
            ...mission,
            id: Date.now(),
            numero: `${mission.numero}-COPIE`,
            statut: 'brouillon',
            dateCreation: new Date().toISOString()
        };
        const newMissions = [...this.state.missions, copie];
        storage.set('wiw-missions-conseil', newMissions);
        this.setState({ missions: newMissions });
        showToast('Mission dupliquée', 'success');
    }

    saveMission() {
        const { formData, editingId, missions } = this.state;

        // Validation
        if (!formData.numero || !formData.typeMission || !formData.intitule) {
            showToast('Veuillez remplir tous les champs obligatoires', 'warning');
            return;
        }

        if (formData.equipe.length > 2) {
            showToast('Maximum 2 partenaires autorisés', 'warning');
            return;
        }

        let newMissions;
        if (editingId) {
            newMissions = missions.map(m => m.id === editingId ? { ...formData, id: editingId } : m);
            showToast('Mission modifiée', 'success');
        } else {
            const nouvelleMission = {
                ...formData,
                id: Date.now(),
                dateCreation: new Date().toISOString()
            };
            newMissions = [...missions, nouvelleMission];
            showToast('Mission créée', 'success');
        }

        storage.set('wiw-missions-conseil', newMissions);
        this.setState({ missions: newMissions, showForm: false, editingId: null });
    }

    updateFormField(field, value) {
        const { formData } = this.state;
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            this.setState({
                formData: {
                    ...formData,
                    [parent]: { ...formData[parent], [child]: value }
                }
            }, false);
        } else {
            this.setState({ formData: { ...formData, [field]: value } }, false);
        }
    }

    addEquipeMember() {
        const { formData } = this.state;
        if (formData.equipe.length >= 2) {
            showToast('Maximum 2 partenaires autorisés', 'warning');
            return;
        }
        const newEquipe = [...formData.equipe, { nom: '', fonction: '', coutHoraire: 0 }];
        this.setState({ formData: { ...formData, equipe: newEquipe } });
    }

    removeEquipeMember(index) {
        const { formData } = this.state;
        const newEquipe = formData.equipe.filter((_, i) => i !== index);
        this.setState({ formData: { ...formData, equipe: newEquipe } });
    }

    calculerTotalHonoraires(mission) {
        const honorairesEquipe = (mission.equipe || []).reduce((sum, p) => {
            return sum + (parseFloat(p.coutHoraire) || 0) * (parseFloat(mission.dureeEstimee) || 0) * 8;
        }, 0);
        return honorairesEquipe + (parseFloat(mission.honorairesPropose) || 0);
    }

    formatMontant(value) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    }

    getTypeLabel(value) {
        const type = this.typesMissions.find(t => t.value === value);
        return type ? type.label : value;
    }

    getStatutInfo(statut) {
        return this.statuts[statut] || { label: statut, color: '#6b7280' };
    }

    render() {
        const { missions, showForm, editingId, formData } = this.state;

        // Statistiques
        const stats = {
            total: missions.length,
            brouillon: missions.filter(m => m.statut === 'brouillon').length,
            enCours: missions.filter(m => m.statut === 'en_cours').length,
            termine: missions.filter(m => m.statut === 'termine').length,
            totalHonoraires: missions.reduce((sum, m) => sum + this.calculerTotalHonoraires(m), 0)
        };

        return `
            <div class="page-missions">
                <div class="page-header">
                    <h2>Missions Conseil</h2>
                    <div class="header-actions">
                        <button class="btn btn-secondary" data-action="go-team">👥 Gérer l'équipe</button>
                        <button class="btn btn-secondary" data-action="go-bet">🏗️ Consulter BET</button>
                        <button class="btn btn-primary" data-action="new-mission">+ Nouvelle mission</button>
                    </div>
                </div>

                ${this.renderStats(stats)}

                ${showForm ? this.renderForm(formData, editingId) : ''}

                ${this.renderMissionsList(missions)}
            </div>
        `;
    }

    renderStats(stats) {
        return `
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div class="stat-value" style="font-size: 28px; font-weight: bold; color: var(--brand);">${stats.total}</div>
                    <div class="stat-label" style="font-size: 12px; opacity: 0.7;">Total missions</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div class="stat-value" style="font-size: 28px; font-weight: bold; color: #6b7280;">${stats.brouillon}</div>
                    <div class="stat-label" style="font-size: 12px; opacity: 0.7;">Brouillons</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div class="stat-value" style="font-size: 28px; font-weight: bold; color: #f59e0b;">${stats.enCours}</div>
                    <div class="stat-label" style="font-size: 12px; opacity: 0.7;">En cours</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div class="stat-value" style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${stats.termine}</div>
                    <div class="stat-label" style="font-size: 12px; opacity: 0.7;">Terminées</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div class="stat-value" style="font-size: 20px; font-weight: bold; color: #10b981;">${this.formatMontant(stats.totalHonoraires)}</div>
                    <div class="stat-label" style="font-size: 12px; opacity: 0.7;">Total honoraires</div>
                </div>
            </div>
        `;
    }

    renderForm(formData, editingId) {
        return `
            <div class="card" style="margin-bottom: 20px; background: rgba(124, 58, 237, 0.05);">
                <h3 style="margin-bottom: 20px;">${editingId ? '✏️ Modifier' : '➕ Nouvelle'} Mission</h3>

                <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">N° Mission *</label>
                        <input type="text" class="form-input" id="form-numero" value="${formData.numero}" placeholder="MCxx">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date *</label>
                        <input type="date" class="form-input" id="form-date" value="${formData.date}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type de mission *</label>
                        <select class="form-select" id="form-type">
                            <option value="">-- Sélectionner --</option>
                            ${this.typesMissions.map(t => `
                                <option value="${t.value}" ${formData.typeMission === t.value ? 'selected' : ''}>${t.icon} ${t.label}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Élément mission</label>
                        <select class="form-select" id="form-element">
                            ${['Base', 'Additionnelle', 'Complémentaire', 'Optionnelle'].map(e => `
                                <option value="${e}" ${formData.elementMission === e ? 'selected' : ''}>${e}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label class="form-label">Intitulé *</label>
                    <input type="text" class="form-input" id="form-intitule" value="${formData.intitule}" placeholder="Intitulé de la mission">
                </div>

                <h4 style="margin: 20px 0 15px; color: var(--brand);">📋 Client</h4>
                <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Nom du client</label>
                        <input type="text" class="form-input" id="form-client-nom" value="${formData.client.nom}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <input type="text" class="form-input" id="form-client-tel" value="${formData.client.telephone}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="form-client-email" value="${formData.client.email}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ville</label>
                        <input type="text" class="form-input" id="form-client-ville" value="${formData.client.ville}">
                    </div>
                </div>

                <h4 style="margin: 20px 0 15px; color: var(--brand);">💰 Honoraires & Durée</h4>
                <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Durée estimée (jours)</label>
                        <input type="number" class="form-input" id="form-duree" value="${formData.dureeEstimee}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Montant travaux HT (€)</label>
                        <input type="number" class="form-input" id="form-montant-travaux" value="${formData.montantTravauxHT}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Honoraires proposés (€ HT)</label>
                        <input type="number" class="form-input" id="form-honoraires" value="${formData.honorairesPropose}" min="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Statut</label>
                        <select class="form-select" id="form-statut">
                            ${Object.entries(this.statuts).map(([value, info]) => `
                                <option value="${value}" ${formData.statut === value ? 'selected' : ''}>${info.label}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <h4 style="margin: 20px 0 15px; color: var(--brand);">👥 Équipe (max 2 partenaires)</h4>
                <div id="equipe-container">
                    ${(formData.equipe || []).map((membre, index) => `
                        <div class="equipe-membre" style="display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 10px; margin-bottom: 10px; padding: 10px; background: var(--panel); border-radius: 6px;">
                            <input type="text" class="form-input equipe-nom" data-index="${index}" value="${membre.nom}" placeholder="Nom">
                            <input type="text" class="form-input equipe-fonction" data-index="${index}" value="${membre.fonction}" placeholder="Fonction">
                            <input type="number" class="form-input equipe-cout" data-index="${index}" value="${membre.coutHoraire}" placeholder="€/h" style="width: 80px;">
                            <button class="btn btn-secondary remove-membre" data-index="${index}">🗑️</button>
                        </div>
                    `).join('')}
                </div>
                ${formData.equipe.length < 2 ? `
                    <button class="btn btn-secondary" data-action="add-membre" style="margin-top: 10px;">+ Ajouter un partenaire</button>
                ` : ''}

                <div class="form-group" style="margin-top: 20px;">
                    <label class="form-label">Description</label>
                    <textarea class="form-input" id="form-description" rows="3" placeholder="Description de la mission">${formData.description}</textarea>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label class="form-label">Notes</label>
                    <textarea class="form-input" id="form-notes" rows="2" placeholder="Notes internes">${formData.notes}</textarea>
                </div>

                <div class="form-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" data-action="save-mission">💾 Enregistrer</button>
                    <button class="btn btn-secondary" data-action="cancel-form">❌ Annuler</button>
                </div>
            </div>
        `;
    }

    renderMissionsList(missions) {
        if (missions.length === 0) {
            return `
                <div class="card" style="text-align: center; padding: 60px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
                    <h3>Aucune mission</h3>
                    <p style="opacity: 0.7; margin-bottom: 20px;">Créez votre première mission conseil</p>
                    <button class="btn btn-primary" data-action="new-mission">+ Nouvelle mission</button>
                </div>
            `;
        }

        return `
            <div class="missions-list" style="display: grid; gap: 15px;">
                ${missions.map(mission => {
                    const statutInfo = this.getStatutInfo(mission.statut);
                    const totalHonoraires = this.calculerTotalHonoraires(mission);

                    return `
                        <div class="card mission-card">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                        <span style="font-weight: bold; font-size: 16px;">${mission.numero}</span>
                                        <span class="badge" style="background: ${statutInfo.color}; color: white;">${statutInfo.label}</span>
                                        <span class="badge badge-info">${this.getTypeLabel(mission.typeMission).split(' ')[0]}</span>
                                    </div>
                                    <h3 style="margin-bottom: 8px;">${mission.intitule}</h3>
                                    <div style="font-size: 13px; opacity: 0.7; margin-bottom: 10px;">
                                        <span>👤 ${mission.client.nom || 'Client non défini'}</span>
                                        ${mission.client.ville ? ` • 📍 ${mission.client.ville}` : ''}
                                        <span> • 📅 ${new Date(mission.date).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    ${mission.equipe && mission.equipe.length > 0 ? `
                                        <div style="font-size: 12px; margin-bottom: 10px;">
                                            👥 Équipe: ${mission.equipe.map(m => m.nom).join(', ')}
                                        </div>
                                    ` : ''}
                                </div>
                                <div style="text-align: right; min-width: 150px;">
                                    <div style="font-size: 20px; font-weight: bold; color: #10b981;">${this.formatMontant(totalHonoraires)}</div>
                                    <div style="font-size: 11px; opacity: 0.6;">Honoraires HT</div>
                                    ${mission.dureeEstimee ? `
                                        <div style="font-size: 12px; margin-top: 5px;">⏱️ ${mission.dureeEstimee} jours</div>
                                    ` : ''}
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                                <button class="btn btn-secondary" data-edit-mission="${mission.id}" style="padding: 6px 12px; font-size: 12px;">✏️ Modifier</button>
                                <button class="btn btn-secondary" data-duplicate-mission="${mission.id}" style="padding: 6px 12px; font-size: 12px;">📋 Dupliquer</button>
                                <button class="btn btn-secondary" data-export-mission="${mission.id}" style="padding: 6px 12px; font-size: 12px;">📥 Export</button>
                                <button class="btn btn-secondary" data-delete-mission="${mission.id}" style="padding: 6px 12px; font-size: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">🗑️</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    bindEvents() {
        // Navigation buttons
        document.querySelector('[data-action="go-team"]')?.addEventListener('click', () => router.navigate('/team'));
        document.querySelector('[data-action="go-bet"]')?.addEventListener('click', () => router.navigate('/bet'));

        // New mission
        document.querySelectorAll('[data-action="new-mission"]').forEach(btn => {
            btn.addEventListener('click', () => this.showFormPanel());
        });

        // Cancel form
        document.querySelector('[data-action="cancel-form"]')?.addEventListener('click', () => this.hideFormPanel());

        // Save mission
        document.querySelector('[data-action="save-mission"]')?.addEventListener('click', () => {
            // Collect form data
            this.state.formData.numero = document.getElementById('form-numero')?.value || '';
            this.state.formData.date = document.getElementById('form-date')?.value || '';
            this.state.formData.typeMission = document.getElementById('form-type')?.value || '';
            this.state.formData.elementMission = document.getElementById('form-element')?.value || 'Base';
            this.state.formData.intitule = document.getElementById('form-intitule')?.value || '';
            this.state.formData.client.nom = document.getElementById('form-client-nom')?.value || '';
            this.state.formData.client.telephone = document.getElementById('form-client-tel')?.value || '';
            this.state.formData.client.email = document.getElementById('form-client-email')?.value || '';
            this.state.formData.client.ville = document.getElementById('form-client-ville')?.value || '';
            this.state.formData.dureeEstimee = document.getElementById('form-duree')?.value || '';
            this.state.formData.montantTravauxHT = parseFloat(document.getElementById('form-montant-travaux')?.value) || 0;
            this.state.formData.honorairesPropose = parseFloat(document.getElementById('form-honoraires')?.value) || 0;
            this.state.formData.statut = document.getElementById('form-statut')?.value || 'brouillon';
            this.state.formData.description = document.getElementById('form-description')?.value || '';
            this.state.formData.notes = document.getElementById('form-notes')?.value || '';

            // Collect equipe
            const equipeMembres = [];
            document.querySelectorAll('.equipe-membre').forEach((el, index) => {
                const nom = el.querySelector('.equipe-nom')?.value || '';
                const fonction = el.querySelector('.equipe-fonction')?.value || '';
                const coutHoraire = parseFloat(el.querySelector('.equipe-cout')?.value) || 0;
                if (nom) equipeMembres.push({ nom, fonction, coutHoraire });
            });
            this.state.formData.equipe = equipeMembres;

            this.saveMission();
        });

        // Add membre
        document.querySelector('[data-action="add-membre"]')?.addEventListener('click', () => this.addEquipeMember());

        // Remove membre
        document.querySelectorAll('.remove-membre').forEach(btn => {
            btn.addEventListener('click', () => this.removeEquipeMember(parseInt(btn.dataset.index)));
        });

        // Edit mission
        document.querySelectorAll('[data-edit-mission]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.editMission);
                const mission = this.state.missions.find(m => m.id === id);
                if (mission) this.editMission(mission);
            });
        });

        // Duplicate mission
        document.querySelectorAll('[data-duplicate-mission]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.duplicateMission);
                const mission = this.state.missions.find(m => m.id === id);
                if (mission) this.duplicateMission(mission);
            });
        });

        // Delete mission
        document.querySelectorAll('[data-delete-mission]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteMission(parseInt(btn.dataset.deleteMission)));
        });

        // Export mission
        document.querySelectorAll('[data-export-mission]').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Export PDF/Excel à implémenter', 'info');
            });
        });
    }
}
