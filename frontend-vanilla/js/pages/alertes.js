// Alertes Page - Gestion des alertes et relances
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class AlertesPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            alertes: storage.get('wiw-alertes') || [],
            showForm: false,
            editingId: null,
            formData: this.getEmptyFormData()
        };

        this.priorites = ['basse', 'normale', 'haute', 'urgente'];
        this.statuts = ['en-attente', 'en-cours', 'terminée'];
    }

    getEmptyFormData() {
        return {
            titre: '',
            description: '',
            dateRelance: '',
            contact: '',
            telephone: '',
            email: '',
            priorite: 'normale',
            statut: 'en-attente'
        };
    }

    getPrioriteColor(priorite) {
        const colors = {
            'basse': '#6c757d',
            'normale': '#0d6efd',
            'haute': '#fd7e14',
            'urgente': '#dc3545'
        };
        return colors[priorite] || '#6c757d';
    }

    getStatutColor(statut) {
        const colors = {
            'en-attente': '#ffc107',
            'en-cours': '#0dcaf0',
            'terminée': '#198754'
        };
        return colors[statut] || '#6c757d';
    }

    getStatutLabel(statut) {
        const labels = {
            'en-attente': 'En attente',
            'en-cours': 'En cours',
            'terminée': 'Terminée'
        };
        return labels[statut] || statut;
    }

    toggleForm() {
        this.setState({ showForm: !this.state.showForm, formData: this.getEmptyFormData(), editingId: null });
    }

    editAlerte(alerte) {
        this.setState({ showForm: true, formData: { ...alerte }, editingId: alerte.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deleteAlerte(id) {
        const alerte = this.state.alertes.find(a => a.id === id);
        const confirmed = await showConfirm(`Supprimer l'alerte "${alerte?.titre}" ?`);
        if (confirmed) {
            const newAlertes = this.state.alertes.filter(a => a.id !== id);
            storage.set('wiw-alertes', newAlertes);
            this.setState({ alertes: newAlertes });
            showToast('Alerte supprimée', 'success');
        }
    }

    saveAlerte() {
        const { formData, editingId, alertes } = this.state;

        if (!formData.titre.trim() || !formData.dateRelance) {
            showToast('Titre et date de relance obligatoires', 'warning');
            return;
        }

        let newAlertes;
        if (editingId) {
            newAlertes = alertes.map(a => a.id === editingId ? { ...formData, id: editingId } : a);
            showToast('Alerte modifiée', 'success');
        } else {
            const nouvelleAlerte = {
                ...formData,
                id: Date.now(),
                dateCreation: new Date().toISOString()
            };
            newAlertes = [...alertes, nouvelleAlerte];
            showToast('Alerte créée', 'success');
        }

        storage.set('wiw-alertes', newAlertes);
        this.setState({ alertes: newAlertes, showForm: false, editingId: null, formData: this.getEmptyFormData() });
    }

    getSortedAlertes() {
        return [...this.state.alertes].sort((a, b) => {
            const dateA = new Date(a.dateRelance);
            const dateB = new Date(b.dateRelance);
            if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
            const prioriteOrder = { urgente: 0, haute: 1, normale: 2, basse: 3 };
            return prioriteOrder[a.priorite] - prioriteOrder[b.priorite];
        });
    }

    render() {
        const { showForm, editingId, formData, alertes } = this.state;
        const sortedAlertes = this.getSortedAlertes();
        const alertesEnCours = sortedAlertes.filter(a => a.statut !== 'terminée');
        const alertesTerminees = sortedAlertes.filter(a => a.statut === 'terminée');

        return `
            <div class="page-alertes">
                <div class="page-header">
                    <h1>🔔 Alertes & Relances</h1>
                    <button class="btn ${showForm ? 'btn-secondary' : 'btn-primary'}" data-action="toggle-form">
                        ${showForm ? '✖ Annuler' : '+ Nouvelle alerte'}
                    </button>
                </div>

                ${showForm ? this.renderForm(formData, editingId) : ''}

                ${this.renderStats(alertes, alertesEnCours, alertesTerminees)}

                ${alertesEnCours.length > 0 ? `
                    <h2 style="font-size: 22px; margin-bottom: 20px; font-weight: 600;">
                        📌 Alertes en cours (${alertesEnCours.length})
                    </h2>
                    <div style="display: grid; gap: 15px; margin-bottom: 40px;">
                        ${alertesEnCours.map(a => this.renderAlerteCard(a)).join('')}
                    </div>
                ` : ''}

                ${alertesTerminees.length > 0 ? `
                    <h2 style="font-size: 22px; margin-bottom: 20px; font-weight: 600; opacity: 0.7;">
                        ✅ Alertes terminées (${alertesTerminees.length})
                    </h2>
                    <div style="display: grid; gap: 15px;">
                        ${alertesTerminees.map(a => this.renderAlerteCard(a)).join('')}
                    </div>
                ` : ''}

                ${alertes.length === 0 ? `
                    <div class="card" style="text-align: center; padding: 60px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🔔</div>
                        <h3>Aucune alerte</h3>
                        <p style="opacity: 0.7; margin-bottom: 20px;">Créez votre première alerte ou relance</p>
                        <button class="btn btn-primary" data-action="toggle-form">+ Nouvelle alerte</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderStats(alertes, enCours, terminees) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div class="card stat-card" style="text-align: center; padding: 20px;">
                    <div style="font-size: 32px; font-weight: bold; color: #0d6efd;">${alertes.length}</div>
                    <div style="opacity: 0.7; margin-top: 5px;">Total alertes</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 20px;">
                    <div style="font-size: 32px; font-weight: bold; color: #ffc107;">${enCours.length}</div>
                    <div style="opacity: 0.7; margin-top: 5px;">En cours</div>
                </div>
                <div class="card stat-card" style="text-align: center; padding: 20px;">
                    <div style="font-size: 32px; font-weight: bold; color: #198754;">${terminees.length}</div>
                    <div style="opacity: 0.7; margin-top: 5px;">Terminées</div>
                </div>
            </div>
        `;
    }

    renderForm(formData, editingId) {
        return `
            <div class="card" style="margin-bottom: 30px;">
                <h2 style="margin-bottom: 20px; font-size: 20px;">
                    ${editingId ? "✏️ Modifier l'alerte" : '➕ Nouvelle alerte'}
                </h2>

                <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Titre *</label>
                        <input type="text" class="form-input" id="form-titre" value="${formData.titre}" placeholder="Ex: Relance devis projet X">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date de relance *</label>
                        <input type="date" class="form-input" id="form-date" value="${formData.dateRelance}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priorité</label>
                        <select class="form-select" id="form-priorite">
                            ${this.priorites.map(p => `
                                <option value="${p}" ${formData.priorite === p ? 'selected' : ''}>${p.charAt(0).toUpperCase() + p.slice(1)}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Statut</label>
                        <select class="form-select" id="form-statut">
                            ${this.statuts.map(s => `
                                <option value="${s}" ${formData.statut === s ? 'selected' : ''}>${this.getStatutLabel(s)}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label class="form-label">Description</label>
                    <textarea class="form-input" id="form-description" rows="3" placeholder="Notes, contexte, détails...">${formData.description}</textarea>
                </div>

                <h3 style="margin-top: 20px; margin-bottom: 15px; font-size: 16px;">👤 Contact</h3>
                <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Nom du contact</label>
                        <input type="text" class="form-input" id="form-contact" value="${formData.contact}" placeholder="Ex: M. Dupont">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <input type="tel" class="form-input" id="form-telephone" value="${formData.telephone}" placeholder="06 12 34 56 78">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="form-email" value="${formData.email}" placeholder="contact@exemple.fr">
                    </div>
                </div>

                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn btn-secondary" data-action="cancel-form">Annuler</button>
                    <button class="btn btn-primary" data-action="save-alerte">${editingId ? '💾 Enregistrer' : '✓ Ajouter'}</button>
                </div>
            </div>
        `;
    }

    renderAlerteCard(alerte) {
        const isOverdue = new Date(alerte.dateRelance) < new Date() && alerte.statut !== 'terminée';

        return `
            <div class="card alerte-card" style="
                border-left: 4px solid ${this.getPrioriteColor(alerte.priorite)};
                ${isOverdue ? 'background: rgba(220, 53, 69, 0.05);' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <h3 style="font-size: 18px; margin: 0;">${alerte.titre}</h3>
                            ${isOverdue ? '<span class="badge badge-error">En retard</span>' : ''}
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
                            <span class="badge" style="background: ${this.getPrioriteColor(alerte.priorite)}; color: white;">
                                ${alerte.priorite.charAt(0).toUpperCase() + alerte.priorite.slice(1)}
                            </span>
                            <span class="badge" style="background: ${this.getStatutColor(alerte.statut)}; color: ${alerte.statut === 'en-attente' ? '#000' : '#fff'};">
                                ${this.getStatutLabel(alerte.statut)}
                            </span>
                        </div>
                        ${alerte.description ? `<p style="font-size: 14px; opacity: 0.8; margin-bottom: 10px;">${alerte.description}</p>` : ''}
                        <div style="font-size: 13px; opacity: 0.7;">
                            📅 Relance: ${new Date(alerte.dateRelance).toLocaleDateString('fr-FR')}
                            ${alerte.contact ? ` • 👤 ${alerte.contact}` : ''}
                            ${alerte.telephone ? ` • 📞 ${alerte.telephone}` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-secondary" data-edit-alerte="${alerte.id}" style="padding: 6px 10px;">✏️</button>
                        <button class="btn btn-secondary" data-delete-alerte="${alerte.id}" style="padding: 6px 10px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Toggle form
        document.querySelectorAll('[data-action="toggle-form"]').forEach(btn => {
            btn.addEventListener('click', () => this.toggleForm());
        });

        // Cancel form
        document.querySelector('[data-action="cancel-form"]')?.addEventListener('click', () => {
            this.setState({ showForm: false, editingId: null, formData: this.getEmptyFormData() });
        });

        // Save alerte
        document.querySelector('[data-action="save-alerte"]')?.addEventListener('click', () => {
            this.state.formData.titre = document.getElementById('form-titre')?.value || '';
            this.state.formData.dateRelance = document.getElementById('form-date')?.value || '';
            this.state.formData.priorite = document.getElementById('form-priorite')?.value || 'normale';
            this.state.formData.statut = document.getElementById('form-statut')?.value || 'en-attente';
            this.state.formData.description = document.getElementById('form-description')?.value || '';
            this.state.formData.contact = document.getElementById('form-contact')?.value || '';
            this.state.formData.telephone = document.getElementById('form-telephone')?.value || '';
            this.state.formData.email = document.getElementById('form-email')?.value || '';
            this.saveAlerte();
        });

        // Edit alerte
        document.querySelectorAll('[data-edit-alerte]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.editAlerte);
                const alerte = this.state.alertes.find(a => a.id === id);
                if (alerte) this.editAlerte(alerte);
            });
        });

        // Delete alerte
        document.querySelectorAll('[data-delete-alerte]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteAlerte(parseInt(btn.dataset.deleteAlerte)));
        });
    }
}
