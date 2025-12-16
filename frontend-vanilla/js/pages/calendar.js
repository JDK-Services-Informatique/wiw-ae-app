// Calendar Page - Calendrier et Planning
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class CalendarPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            currentDate: new Date(),
            viewMode: 'calendrier', // calendrier, planning
            editingEvent: null,
            events: storage.get('wiw-calendar-events') || this.getDefaultEvents()
        };
        this.monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                           'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    }

    getDefaultEvents() {
        return [
            { id: 1, date: 15, month: 11, year: 2024, title: 'Réunion client ABC', type: 'reunion', priorite: 'normale', echeance: '2024-12-15' },
            { id: 2, date: 20, month: 11, year: 2024, title: 'Rendu AO Hôpital', type: 'ao', priorite: 'haute', echeance: '2024-12-20' },
            { id: 3, date: 22, month: 11, year: 2024, title: 'Deadline projet XYZ', type: 'deadline', priorite: 'critique', echeance: '2024-12-22' },
            { id: 4, date: 28, month: 11, year: 2024, title: 'Signature contrat', type: 'contrat', priorite: 'normale', echeance: '2024-12-28' },
            { id: 5, date: 5, month: 0, year: 2025, title: 'Visite chantier', type: 'visite', priorite: 'normale', echeance: '2025-01-05' },
            { id: 6, date: 15, month: 0, year: 2025, title: 'Rendu plans APD', type: 'deadline', priorite: 'haute', echeance: '2025-01-15' }
        ];
    }

    getAlertes() {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return this.state.events.filter(e => {
            const eventDate = new Date(e.year, e.month, e.date);
            return eventDate >= today && eventDate <= nextWeek;
        }).sort((a, b) => {
            const dateA = new Date(a.year, a.month, a.date);
            const dateB = new Date(b.year, b.month, b.date);
            return dateA - dateB;
        });
    }

    getEventForDate(date) {
        const { currentDate, events } = this.state;
        return events.find(event =>
            event.date === date &&
            event.month === currentDate.getMonth() &&
            event.year === currentDate.getFullYear()
        );
    }

    navigateMonth(direction) {
        const { currentDate } = this.state;
        this.setState({
            currentDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
        });
    }

    setViewMode(mode) {
        this.setState({ viewMode: mode });
    }

    handleEventClick(event) {
        switch(event.type) {
            case 'ao':
                router.navigate('/tenders');
                break;
            case 'deadline':
                router.navigate('/references');
                break;
            case 'contrat':
                router.navigate('/missions');
                break;
            case 'visite':
                router.navigate('/references');
                break;
        }
    }

    editEvent(event) {
        this.setState({ editingEvent: {...event} });
    }

    async deleteEvent(event) {
        const confirmed = await showConfirm(`Supprimer l'événement "${event.title}" ?`);
        if (confirmed) {
            const newEvents = this.state.events.filter(e => e.id !== event.id);
            storage.set('wiw-calendar-events', newEvents);
            this.setState({ events: newEvents });
            showToast('Événement supprimé', 'success');
        }
    }

    saveEvent() {
        const { editingEvent, events } = this.state;
        if (!editingEvent.title.trim()) {
            showToast('Le titre est obligatoire', 'warning');
            return;
        }

        let newEvents;
        if (editingEvent.id) {
            // Modification
            newEvents = events.map(e => e.id === editingEvent.id ? editingEvent : e);
            showToast('Événement modifié', 'success');
        } else {
            // Nouvel événement
            const echeanceDate = new Date(editingEvent.echeance);
            const newEvent = {
                ...editingEvent,
                id: Date.now(),
                date: echeanceDate.getDate(),
                month: echeanceDate.getMonth(),
                year: echeanceDate.getFullYear()
            };
            newEvents = [...events, newEvent];
            showToast('Événement ajouté', 'success');
        }

        storage.set('wiw-calendar-events', newEvents);
        this.setState({ events: newEvents, editingEvent: null });
    }

    cancelEdit() {
        this.setState({ editingEvent: null });
    }

    createNewEvent() {
        this.setState({
            editingEvent: {
                title: '',
                type: 'reunion',
                priorite: 'normale',
                echeance: new Date().toISOString().split('T')[0]
            }
        });
    }

    updateEditingEvent(field, value) {
        this.setState({
            editingEvent: { ...this.state.editingEvent, [field]: value }
        });
    }

    render() {
        const { currentDate, viewMode, editingEvent, events } = this.state;
        const alertes = this.getAlertes();

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

        return `
            <div class="page-calendar">
                <div class="page-header">
                    <h2>Calendrier & Planning</h2>
                    <div class="header-actions">
                        <button class="btn ${viewMode === 'calendrier' ? '' : 'btn-secondary'}" data-view="calendrier">
                            Calendrier
                        </button>
                        <button class="btn ${viewMode === 'planning' ? '' : 'btn-secondary'}" data-view="planning">
                            Planning ${alertes.length > 0 ? `<span class="badge badge-error">${alertes.length}</span>` : ''}
                        </button>
                        <button class="btn btn-primary" data-action="new-event">+ Nouvel événement</button>
                    </div>
                </div>

                ${editingEvent ? this.renderEventForm() : ''}

                ${alertes.length > 0 && viewMode === 'calendrier' ? this.renderAlertesSection(alertes) : ''}

                ${viewMode === 'calendrier' ? this.renderCalendarView(daysInMonth, firstDayOfMonth) : ''}
                ${viewMode === 'planning' ? this.renderPlanningView(alertes) : ''}

                ${viewMode === 'calendrier' ? this.renderLegend() : ''}
            </div>
        `;
    }

    renderEventForm() {
        const { editingEvent } = this.state;
        return `
            <div class="card" style="margin-bottom: 20px; background: rgba(124, 58, 237, 0.1);">
                <h3 style="margin-bottom: 20px;">${editingEvent.id ? '✏️ Modifier' : '➕ Nouvel'} événement</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Titre *</label>
                        <input type="text" class="form-input" id="event-title"
                               value="${editingEvent.title || ''}" placeholder="Titre de l'événement">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type</label>
                        <select class="form-select" id="event-type">
                            <option value="reunion" ${editingEvent.type === 'reunion' ? 'selected' : ''}>Réunion</option>
                            <option value="ao" ${editingEvent.type === 'ao' ? 'selected' : ''}>Appel d'offres</option>
                            <option value="deadline" ${editingEvent.type === 'deadline' ? 'selected' : ''}>Deadline</option>
                            <option value="contrat" ${editingEvent.type === 'contrat' ? 'selected' : ''}>Contrat</option>
                            <option value="visite" ${editingEvent.type === 'visite' ? 'selected' : ''}>Visite</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priorité</label>
                        <select class="form-select" id="event-priorite">
                            <option value="normale" ${editingEvent.priorite === 'normale' ? 'selected' : ''}>Normale</option>
                            <option value="haute" ${editingEvent.priorite === 'haute' ? 'selected' : ''}>Haute</option>
                            <option value="critique" ${editingEvent.priorite === 'critique' ? 'selected' : ''}>Critique</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-input" id="event-echeance" value="${editingEvent.echeance || ''}">
                    </div>
                </div>
                <div class="form-actions" style="margin-top: 20px;">
                    <button class="btn btn-primary" data-action="save-event">💾 Enregistrer</button>
                    <button class="btn btn-secondary" data-action="cancel-edit">❌ Annuler</button>
                </div>
            </div>
        `;
    }

    renderAlertesSection(alertes) {
        return `
            <div class="card" style="margin-bottom: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);">
                <h3 style="color: #ef4444; margin-bottom: 12px;">⚠️ Alertes à venir (7 prochains jours)</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${alertes.map(alerte => {
                        const dateEvent = new Date(alerte.echeance);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        dateEvent.setHours(0, 0, 0, 0);
                        const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));

                        return `
                            <div class="alerte-item" data-event-id="${alerte.id}"
                                 style="padding: 10px; background: rgba(0,0,0,0.2); border-radius: 6px;
                                        display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                <div>
                                    <div style="font-weight: bold;">${alerte.title}</div>
                                    <div style="font-size: 12px; opacity: 0.7;">
                                        ${dateEvent.toLocaleDateString('fr-FR')} • ${joursRestants === 0 ? "Aujourd'hui" : `Dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                                    </div>
                                </div>
                                <span class="badge ${alerte.priorite === 'critique' ? 'badge-error' : alerte.priorite === 'haute' ? 'badge-warning' : 'badge-info'}">
                                    ${alerte.priorite}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderCalendarView(daysInMonth, firstDayOfMonth) {
        const { currentDate } = this.state;
        const today = new Date();

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 20px;">
                        ${this.monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}
                    </h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-secondary" data-nav="-1">‹ Précédent</button>
                        <button class="btn btn-secondary" data-nav="1">Suivant ›</button>
                    </div>
                </div>

                <div class="calendar-grid">
                    ${this.dayNames.map(day => `
                        <div class="calendar-header-cell">${day}</div>
                    `).join('')}

                    ${Array.from({ length: firstDayOfMonth }, (_, i) => `
                        <div class="calendar-cell empty"></div>
                    `).join('')}

                    ${Array.from({ length: daysInMonth }, (_, i) => {
                        const date = i + 1;
                        const event = this.getEventForDate(date);
                        const isToday = date === today.getDate() &&
                                       currentDate.getMonth() === today.getMonth() &&
                                       currentDate.getFullYear() === today.getFullYear();
                        const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), date).getDay();
                        const isSunday = dayOfWeek === 0;

                        let cellClass = 'calendar-cell';
                        if (isSunday) cellClass += ' sunday';
                        if (isToday) cellClass += ' today';

                        return `
                            <div class="${cellClass}">
                                <div class="calendar-date">${date}</div>
                                ${event ? `
                                    <div class="calendar-event ${event.type}" data-event-id="${event.id}">
                                        ${event.title}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderPlanningView(alertes) {
        const { events } = this.state;
        const sortedEvents = [...events].sort((a, b) => new Date(a.echeance) - new Date(b.echeance));

        return `
            <div>
                ${alertes.length > 0 ? `
                    <div class="card" style="margin-bottom: 20px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2);">
                        <h3 style="margin-bottom: 15px; color: #ef4444; display: flex; align-items: center; gap: 8px;">
                            <span>⚠️</span> Alertes prioritaires (7 prochains jours)
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
                            ${alertes.map(alerte => {
                                const dateEvent = new Date(alerte.echeance);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                dateEvent.setHours(0, 0, 0, 0);
                                const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));

                                return `
                                    <div class="alerte-card" data-event-id="${alerte.id}" style="
                                        padding: 12px;
                                        background: ${joursRestants === 0 ? 'rgba(245, 158, 11, 0.15)' : joursRestants <= 3 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(255, 255, 255, 0.5)'};
                                        border-radius: 6px;
                                        border: 1px solid ${joursRestants === 0 ? 'rgba(245, 158, 11, 0.4)' : joursRestants <= 3 ? 'rgba(251, 146, 60, 0.3)' : 'rgba(239, 68, 68, 0.2)'};
                                        cursor: pointer;">
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
                                            <div style="font-weight: bold; font-size: 14px;">${alerte.title}</div>
                                            <span class="badge ${alerte.priorite === 'critique' ? 'badge-error' : alerte.priorite === 'haute' ? 'badge-warning' : 'badge-info'}" style="font-size: 10px;">
                                                ${alerte.priorite}
                                            </span>
                                        </div>
                                        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 6px;">
                                            📅 ${dateEvent.toLocaleDateString('fr-FR')} • ${alerte.type}
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <span style="
                                                padding: 4px 10px;
                                                border-radius: 4px;
                                                font-size: 11px;
                                                font-weight: bold;
                                                background: ${joursRestants === 0 ? '#f59e0b' : joursRestants <= 3 ? '#fb923c' : '#ef4444'};
                                                color: white;">
                                                ${joursRestants === 0 ? "AUJOURD'HUI" : `Dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                                            </span>
                                            <button class="btn btn-secondary" data-edit-event="${alerte.id}"
                                                    style="padding: 4px 8px; font-size: 11px;">Modifier</button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="card">
                    <h3 style="margin-bottom: 15px;">📋 Planning des événements</h3>
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Événement</th>
                                    <th>Type</th>
                                    <th>Priorité</th>
                                    <th>Délai</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedEvents.map(event => {
                                    const dateEvent = new Date(event.echeance);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    dateEvent.setHours(0, 0, 0, 0);
                                    const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));
                                    const estEnRetard = joursRestants < 0;
                                    const estAujourdhui = joursRestants === 0;
                                    const estUrgent = joursRestants >= 0 && joursRestants <= 3;
                                    const estAlerte = alertes.some(a => a.id === event.id);

                                    return `
                                        <tr style="
                                            background: ${estEnRetard ? 'rgba(239, 68, 68, 0.1)' : estAujourdhui ? 'rgba(245, 158, 11, 0.1)' : estUrgent ? 'rgba(251, 146, 60, 0.05)' : estAlerte ? 'rgba(239, 68, 68, 0.03)' : 'transparent'};
                                            border-left: ${estAlerte ? '3px solid #ef4444' : 'none'};">
                                            <td style="font-weight: ${estUrgent || estAujourdhui || estEnRetard ? 'bold' : 'normal'};">
                                                ${dateEvent.toLocaleDateString('fr-FR')}
                                            </td>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 6px;">
                                                    ${estAlerte ? '<span style="color: #ef4444;">⚠️</span>' : ''}
                                                    ${event.title}
                                                </div>
                                            </td>
                                            <td><span class="badge badge-info">${event.type}</span></td>
                                            <td>
                                                <span class="badge ${event.priorite === 'critique' ? 'badge-error' : event.priorite === 'haute' ? 'badge-warning' : 'badge-info'}">
                                                    ${event.priorite}
                                                </span>
                                            </td>
                                            <td>
                                                <span style="
                                                    padding: 4px 8px;
                                                    border-radius: 4px;
                                                    font-size: 12px;
                                                    font-weight: bold;
                                                    background: ${estEnRetard ? '#ef4444' : estAujourdhui ? '#f59e0b' : estUrgent ? '#fb923c' : '#e9ecef'};
                                                    color: ${(estEnRetard || estAujourdhui || estUrgent) ? 'white' : '#666'};">
                                                    ${estEnRetard ? `${Math.abs(joursRestants)}j retard` : estAujourdhui ? "AUJOURD'HUI" : estUrgent ? `Dans ${joursRestants}j` : `${joursRestants}j`}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn-icon" title="Modifier" data-edit-event="${event.id}">✏️</button>
                                                <button class="btn-icon" title="Supprimer" data-delete-event="${event.id}">🗑️</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderLegend() {
        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px; font-size: 18px;">Légende</h3>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 12px; height: 12px; border-radius: 4px; background: rgba(168, 85, 247, 0.6);"></div>
                        <span style="font-size: 14px;">Réunions</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 12px; height: 12px; border-radius: 4px; background: rgba(239, 68, 68, 0.6);"></div>
                        <span style="font-size: 14px;">Appels d'offres</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 12px; height: 12px; border-radius: 4px; background: rgba(245, 158, 11, 0.6);"></div>
                        <span style="font-size: 14px;">Deadlines</span>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // View mode buttons
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => this.setViewMode(btn.dataset.view));
        });

        // Navigation buttons
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => this.navigateMonth(parseInt(btn.dataset.nav)));
        });

        // New event button
        document.querySelector('[data-action="new-event"]')?.addEventListener('click', () => this.createNewEvent());

        // Save/Cancel event
        document.querySelector('[data-action="save-event"]')?.addEventListener('click', () => {
            const title = document.getElementById('event-title')?.value || '';
            const type = document.getElementById('event-type')?.value || 'reunion';
            const priorite = document.getElementById('event-priorite')?.value || 'normale';
            const echeance = document.getElementById('event-echeance')?.value || '';

            this.setState({
                editingEvent: { ...this.state.editingEvent, title, type, priorite, echeance }
            }, false);
            this.saveEvent();
        });

        document.querySelector('[data-action="cancel-edit"]')?.addEventListener('click', () => this.cancelEdit());

        // Edit event buttons
        document.querySelectorAll('[data-edit-event]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = parseInt(btn.dataset.editEvent);
                const event = this.state.events.find(e => e.id === eventId);
                if (event) this.editEvent(event);
            });
        });

        // Delete event buttons
        document.querySelectorAll('[data-delete-event]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = parseInt(btn.dataset.deleteEvent);
                const event = this.state.events.find(e => e.id === eventId);
                if (event) this.deleteEvent(event);
            });
        });

        // Alerte items click
        document.querySelectorAll('.alerte-item, .alerte-card').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('[data-edit-event]')) return;
                const eventId = parseInt(item.dataset.eventId);
                const event = this.state.events.find(e => e.id === eventId);
                if (event) this.handleEventClick(event);
            });
        });

        // Calendar event click
        document.querySelectorAll('.calendar-event').forEach(item => {
            item.addEventListener('click', () => {
                const eventId = parseInt(item.dataset.eventId);
                const event = this.state.events.find(e => e.id === eventId);
                if (event) this.editEvent(event);
            });
        });
    }
}
