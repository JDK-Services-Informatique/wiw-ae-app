// BET Page - Gestion des Bureaux d'Études Techniques partenaires
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class BETPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            viewMode: 'liste',
            selectedBET: null,
            editingBET: null,
            filterMetier: 'tous',
            bets: storage.get('wiw-bets') || this.getDefaultBETs(),
            etudes: storage.get('wiw-etudes-bet') || this.getDefaultEtudes()
        };

        this.metiers = ['Structure', 'Thermique & Fluides', 'Acoustique', 'VRD', 'Sécurité', 'Environnement'];
    }

    getDefaultBETs() {
        return [
            {
                id: 1,
                nom: 'Bureau Études BET MARTIN',
                type: 'Structure',
                contact: {
                    responsable: 'M. Pierre Martin',
                    telephone: '01 23 45 67 89',
                    email: 'contact@bet-martin.fr',
                    adresse: '15 rue des Ingénieurs, 75015 Paris'
                },
                competences: ['Calcul béton armé', 'Calcul métal', 'Diagnostic structure', 'Renforcement'],
                certifications: ['Qualibat', 'ISO 9001'],
                tarifHoraire: 75
            },
            {
                id: 2,
                nom: 'Ingénierie Thermique LEROY',
                type: 'Thermique & Fluides',
                contact: {
                    responsable: 'Mme Sophie Leroy',
                    telephone: '01 34 56 78 90',
                    email: 'contact@leroy-thermique.fr',
                    adresse: '8 avenue de la Thermique, 69003 Lyon'
                },
                competences: ['Étude thermique RT2020', 'CVC', 'Plomberie', 'Électricité', 'BBC'],
                certifications: ['Qualibat', 'RGE'],
                tarifHoraire: 70
            },
            {
                id: 3,
                nom: 'BET Acoustique SONIC',
                type: 'Acoustique',
                contact: {
                    responsable: 'M. Jean Petit',
                    telephone: '01 45 67 89 01',
                    email: 'contact@sonic-acoustique.fr',
                    adresse: '22 boulevard du Son, 31000 Toulouse'
                },
                competences: ['Isolation acoustique', 'Mesures in situ', 'Modélisation', 'Correction acoustique'],
                certifications: ['Qualibat'],
                tarifHoraire: 80
            }
        ];
    }

    getDefaultEtudes() {
        return [
            {
                id: 1, betId: 1, betNom: 'Bureau Études BET MARTIN',
                projet: 'Résidence Les Oliviers', type: 'Structure béton armé',
                statut: 'En cours', dateDebut: '2024-10-01', dateLivraison: '2024-12-15',
                montant: 35000, avancement: 65
            },
            {
                id: 2, betId: 2, betNom: 'Ingénierie Thermique LEROY',
                projet: 'Centre Commercial Rivoli', type: 'Étude thermique RT2020',
                statut: 'En cours', dateDebut: '2024-09-15', dateLivraison: '2024-11-30',
                montant: 28000, avancement: 80
            },
            {
                id: 3, betId: 3, betNom: 'BET Acoustique SONIC',
                projet: 'École Primaire', type: 'Isolation acoustique',
                statut: 'Terminé', dateDebut: '2024-08-01', dateLivraison: '2024-10-15',
                montant: 15000, avancement: 100
            }
        ];
    }

    formatMontant(value) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    }

    getTypeBadgeColor(type) {
        const colors = {
            'Structure': '#3b82f6',
            'Thermique & Fluides': '#ef4444',
            'Acoustique': '#8b5cf6',
            'VRD': '#10b981',
            'Sécurité': '#f59e0b',
            'Environnement': '#06b6d4'
        };
        return colors[type] || '#6b7280';
    }

    setViewMode(mode) {
        this.setState({ viewMode: mode });
    }

    setFilterMetier(metier) {
        this.setState({ filterMetier: metier });
    }

    selectBET(bet) {
        this.setState({ selectedBET: bet });
    }

    closeModal() {
        this.setState({ selectedBET: null, editingBET: null });
    }

    editBET(bet) {
        this.setState({ editingBET: { ...bet } });
    }

    newBET() {
        this.setState({
            editingBET: {
                nom: '',
                type: 'Structure',
                contact: { responsable: '', telephone: '', email: '', adresse: '' },
                competences: [],
                certifications: [],
                tarifHoraire: 0
            }
        });
    }

    saveBET() {
        const { editingBET, bets } = this.state;
        if (!editingBET.nom.trim()) {
            showToast('Le nom du BET est obligatoire', 'warning');
            return;
        }

        let newBETs;
        if (editingBET.id) {
            newBETs = bets.map(b => b.id === editingBET.id ? editingBET : b);
            showToast('BET modifié', 'success');
        } else {
            newBETs = [...bets, { ...editingBET, id: Date.now() }];
            showToast('BET ajouté', 'success');
        }

        storage.set('wiw-bets', newBETs);
        this.setState({ bets: newBETs, editingBET: null });
    }

    async deleteBET(id) {
        const bet = this.state.bets.find(b => b.id === id);
        const confirmed = await showConfirm(`Supprimer le BET "${bet?.nom}" ?`);
        if (confirmed) {
            const newBETs = this.state.bets.filter(b => b.id !== id);
            storage.set('wiw-bets', newBETs);
            this.setState({ bets: newBETs, selectedBET: null });
            showToast('BET supprimé', 'success');
        }
    }

    getFilteredBETs() {
        const { filterMetier, bets } = this.state;
        return filterMetier === 'tous' ? bets : bets.filter(b => b.type === filterMetier);
    }

    render() {
        const { viewMode, selectedBET, editingBET, filterMetier, bets, etudes } = this.state;
        const filteredBETs = this.getFilteredBETs();
        const etudesEnCours = etudes.filter(e => e.statut === 'En cours');

        return `
            <div class="page-bet">
                <div class="page-header">
                    <div>
                        <h2 style="font-size: 24px; margin-bottom: 5px;">🏗️ Partenaires BET</h2>
                        <p style="font-size: 14px; opacity: 0.7;">Gestion des Bureaux d'Études Techniques</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn ${viewMode === 'liste' ? '' : 'btn-secondary'}" data-view="liste">📋 Liste</button>
                        <button class="btn ${viewMode === 'etudes' ? '' : 'btn-secondary'}" data-view="etudes">📊 Études (${etudesEnCours.length})</button>
                        <button class="btn btn-primary" data-action="new-bet">+ Nouveau BET</button>
                    </div>
                </div>

                ${this.renderStats(bets, etudes)}

                ${viewMode === 'liste' ? this.renderListeView(filteredBETs, filterMetier) : this.renderEtudesView(etudes)}

                ${selectedBET ? this.renderDetailModal(selectedBET) : ''}
                ${editingBET ? this.renderEditModal(editingBET) : ''}
            </div>
        `;
    }

    renderStats(bets, etudes) {
        const totalMontant = etudes.filter(e => e.statut === 'En cours').reduce((sum, e) => sum + e.montant, 0);
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div style="font-size: 28px; font-weight: bold; color: var(--brand);">${bets.length}</div>
                    <div style="font-size: 12px; opacity: 0.7;">Partenaires BET</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${etudes.filter(e => e.statut === 'En cours').length}</div>
                    <div style="font-size: 12px; opacity: 0.7;">Études en cours</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 15px;">
                    <div style="font-size: 20px; font-weight: bold; color: #10b981;">${this.formatMontant(totalMontant)}</div>
                    <div style="font-size: 12px; opacity: 0.7;">Montant études</div>
                </div>
            </div>
        `;
    }

    renderListeView(bets, filterMetier) {
        return `
            <!-- Filtres -->
            <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
                <button class="btn ${filterMetier === 'tous' ? '' : 'btn-secondary'}" data-filter="tous">Tous (${this.state.bets.length})</button>
                ${this.metiers.map(m => {
                    const count = this.state.bets.filter(b => b.type === m).length;
                    if (count === 0) return '';
                    return `<button class="btn ${filterMetier === m ? '' : 'btn-secondary'}" data-filter="${m}"
                                    style="${filterMetier === m ? `background: ${this.getTypeBadgeColor(m)}; color: white;` : ''}">
                        ${m} (${count})
                    </button>`;
                }).join('')}
            </div>

            <!-- Liste -->
            <div style="display: grid; gap: 15px;">
                ${bets.length === 0 ? `
                    <div class="card" style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🏗️</div>
                        <p>Aucun BET trouvé</p>
                    </div>
                ` : bets.map(bet => `
                    <div class="card bet-card" data-bet-id="${bet.id}" style="cursor: pointer; border-left: 4px solid ${this.getTypeBadgeColor(bet.type)};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <h3 style="font-size: 18px; margin: 0;">${bet.nom}</h3>
                                    <span class="badge" style="background: ${this.getTypeBadgeColor(bet.type)}; color: white;">${bet.type}</span>
                                </div>
                                <div style="font-size: 13px; opacity: 0.7; margin-bottom: 10px;">
                                    👤 ${bet.contact.responsable} • 📞 ${bet.contact.telephone} • 📧 ${bet.contact.email}
                                </div>
                                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                                    ${bet.competences.slice(0, 4).map(c => `
                                        <span style="background: var(--panel); padding: 4px 8px; border-radius: 4px; font-size: 11px;">${c}</span>
                                    `).join('')}
                                    ${bet.competences.length > 4 ? `<span style="font-size: 11px; opacity: 0.6;">+${bet.competences.length - 4}</span>` : ''}
                                </div>
                            </div>
                            <div style="text-align: right; min-width: 120px;">
                                <div style="font-size: 20px; font-weight: bold; color: #10b981;">${bet.tarifHoraire} €/h</div>
                                <div style="font-size: 11px; opacity: 0.6;">Tarif horaire</div>
                                <div style="display: flex; gap: 5px; margin-top: 10px; justify-content: flex-end;">
                                    <button class="btn btn-secondary" data-edit-bet="${bet.id}" style="padding: 4px 8px; font-size: 11px;">✏️</button>
                                    <button class="btn btn-secondary" data-delete-bet="${bet.id}" style="padding: 4px 8px; font-size: 11px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">🗑️</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEtudesView(etudes) {
        return `
            <div class="card">
                <h3 style="margin-bottom: 15px;">📊 Études en cours</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Projet</th>
                                <th>BET</th>
                                <th>Type</th>
                                <th>Statut</th>
                                <th style="text-align: center;">Avancement</th>
                                <th style="text-align: right;">Montant</th>
                                <th>Livraison</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${etudes.map(e => `
                                <tr>
                                    <td style="font-weight: 500;">${e.projet}</td>
                                    <td>${e.betNom}</td>
                                    <td>${e.type}</td>
                                    <td>
                                        <span class="badge ${e.statut === 'Terminé' ? 'badge-success' : 'badge-warning'}">
                                            ${e.statut}
                                        </span>
                                    </td>
                                    <td style="text-align: center;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="flex: 1; height: 8px; background: var(--panel); border-radius: 4px; overflow: hidden;">
                                                <div style="width: ${e.avancement}%; height: 100%; background: ${e.avancement === 100 ? '#10b981' : '#3b82f6'};"></div>
                                            </div>
                                            <span style="font-size: 12px; font-weight: bold;">${e.avancement}%</span>
                                        </div>
                                    </td>
                                    <td style="text-align: right; font-weight: bold; color: #10b981;">${this.formatMontant(e.montant)}</td>
                                    <td style="font-size: 13px;">${new Date(e.dateLivraison).toLocaleDateString('fr-FR')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderDetailModal(bet) {
        return `
            <div class="modal-overlay" data-close-modal>
                <div class="modal-content card" style="max-width: 600px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                        <div>
                            <h3>${bet.nom}</h3>
                            <span class="badge" style="background: ${this.getTypeBadgeColor(bet.type)}; color: white;">${bet.type}</span>
                        </div>
                        <button class="btn btn-secondary" data-close-modal>✕</button>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">📋 Contact</h4>
                        <p>👤 ${bet.contact.responsable}</p>
                        <p>📞 ${bet.contact.telephone}</p>
                        <p>📧 ${bet.contact.email}</p>
                        <p>📍 ${bet.contact.adresse}</p>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 10px;">🛠️ Compétences</h4>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${bet.competences.map(c => `<span class="badge badge-info">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-size: 24px; font-weight: bold; color: #10b981;">${bet.tarifHoraire} €/h</span>
                        </div>
                        <button class="btn btn-secondary" data-close-modal>Fermer</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderEditModal(bet) {
        return `
            <div class="modal-overlay">
                <div class="modal-content card" style="max-width: 600px;">
                    <h3 style="margin-bottom: 20px;">${bet.id ? '✏️ Modifier' : '➕ Nouveau'} BET</h3>
                    <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label class="form-label">Nom *</label>
                            <input type="text" class="form-input" id="edit-nom" value="${bet.nom}" placeholder="Nom du BET">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Type *</label>
                            <select class="form-select" id="edit-type">
                                ${this.metiers.map(m => `<option value="${m}" ${bet.type === m ? 'selected' : ''}>${m}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Responsable</label>
                            <input type="text" class="form-input" id="edit-responsable" value="${bet.contact.responsable}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Téléphone</label>
                            <input type="text" class="form-input" id="edit-telephone" value="${bet.contact.telephone}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="edit-email" value="${bet.contact.email}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tarif horaire (€)</label>
                            <input type="number" class="form-input" id="edit-tarif" value="${bet.tarifHoraire}" min="0">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label class="form-label">Adresse</label>
                        <input type="text" class="form-input" id="edit-adresse" value="${bet.contact.adresse}">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button class="btn btn-secondary" data-action="cancel-edit">Annuler</button>
                        <button class="btn btn-primary" data-action="save-bet">💾 Enregistrer</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // View mode
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
        });

        // Filters
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => this.setFilterMetier(btn.dataset.filter));
        });

        // New BET
        document.querySelector('[data-action="new-bet"]')?.addEventListener('click', () => this.newBET());

        // BET cards
        document.querySelectorAll('.bet-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-edit-bet]') || e.target.closest('[data-delete-bet]')) return;
                const id = parseInt(card.dataset.betId);
                const bet = this.state.bets.find(b => b.id === id);
                if (bet) this.selectBET(bet);
            });
        });

        // Edit BET
        document.querySelectorAll('[data-edit-bet]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.editBet);
                const bet = this.state.bets.find(b => b.id === id);
                if (bet) this.editBET(bet);
            });
        });

        // Delete BET
        document.querySelectorAll('[data-delete-bet]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBET(parseInt(btn.dataset.deleteBet));
            });
        });

        // Close modal
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || e.target.hasAttribute('data-close-modal')) {
                    this.closeModal();
                }
            });
        });

        // Cancel edit
        document.querySelector('[data-action="cancel-edit"]')?.addEventListener('click', () => this.closeModal());

        // Save BET
        document.querySelector('[data-action="save-bet"]')?.addEventListener('click', () => {
            this.state.editingBET.nom = document.getElementById('edit-nom')?.value || '';
            this.state.editingBET.type = document.getElementById('edit-type')?.value || 'Structure';
            this.state.editingBET.contact.responsable = document.getElementById('edit-responsable')?.value || '';
            this.state.editingBET.contact.telephone = document.getElementById('edit-telephone')?.value || '';
            this.state.editingBET.contact.email = document.getElementById('edit-email')?.value || '';
            this.state.editingBET.contact.adresse = document.getElementById('edit-adresse')?.value || '';
            this.state.editingBET.tarifHoraire = parseFloat(document.getElementById('edit-tarif')?.value) || 0;
            this.saveBET();
        });
    }
}
