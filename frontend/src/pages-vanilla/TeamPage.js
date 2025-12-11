/**
 * Page Équipe vanilla JS
 */

import { Component } from '../core/component';
import { equipeApi } from '../core/api';

export class TeamPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      membres: [],
      showForm: false,
      editingMembre: null,
      formData: this.getEmptyFormData()
    };
  }

  getEmptyFormData() {
    return {
      nom: '',
      prenom: '',
      poste: '',
      email: '',
      telephone: '',
      competences: ''
    };
  }

  render() {
    const { loading, membres, showForm, editingMembre, formData } = this.state;

    if (loading) {
      return `
        <div class="team-page">
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="team-page">
        <div class="page-header">
          <h2>Équipe</h2>
          <button class="btn" data-action="new-membre">
            + Nouveau membre
          </button>
        </div>

        <!-- Liste des membres -->
        <div class="team-grid">
          ${membres.length > 0 ? membres.map(membre => `
            <div class="team-card card" data-id="${membre.id}">
              <div class="team-avatar">
                ${(membre.prenom?.charAt(0) || '') + (membre.nom?.charAt(0) || '')}
              </div>
              <div class="team-info">
                <h4>${membre.prenom || ''} ${membre.nom || ''}</h4>
                <p class="team-poste">${membre.poste || 'Poste non défini'}</p>
                ${membre.email ? `<p class="team-contact">📧 ${membre.email}</p>` : ''}
                ${membre.telephone ? `<p class="team-contact">📱 ${membre.telephone}</p>` : ''}
                ${membre.competences ? `
                  <div class="team-competences">
                    ${membre.competences.split(',').map(c => `
                      <span class="badge badge-secondary">${c.trim()}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
              <div class="team-actions">
                <button class="btn btn-sm" data-action="edit" data-id="${membre.id}">
                  Modifier
                </button>
                <button class="btn btn-sm btn-secondary" data-action="delete" data-id="${membre.id}">
                  Supprimer
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state card">
              <p>Aucun membre dans l'équipe</p>
              <button class="btn" data-action="new-membre">
                Ajouter un membre
              </button>
            </div>
          `}
        </div>

        <!-- Modal Formulaire -->
        ${showForm ? this.renderForm(formData, editingMembre) : ''}
      </div>
    `;
  }

  renderForm(data, isEditing) {
    return `
      <div class="modal-overlay" data-action="close-modal">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>${isEditing ? 'Modifier le membre' : 'Nouveau membre'}</h3>
            <button class="btn-icon" data-action="close-modal">✕</button>
          </div>
          <form id="membre-form" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label for="prenom">Prénom *</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  class="form-control"
                  value="${data.prenom || ''}"
                  required
                />
              </div>
              <div class="form-group">
                <label for="nom">Nom *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  class="form-control"
                  value="${data.nom || ''}"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="poste">Poste</label>
              <input
                type="text"
                id="poste"
                name="poste"
                class="form-control"
                value="${data.poste || ''}"
                placeholder="Ex: Architecte, Ingénieur structure..."
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  value="${data.email || ''}"
                />
              </div>
              <div class="form-group">
                <label for="telephone">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  class="form-control"
                  value="${data.telephone || ''}"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="competences">Compétences</label>
              <input
                type="text"
                id="competences"
                name="competences"
                class="form-control"
                value="${data.competences || ''}"
                placeholder="Ex: BIM, Revit, AutoCAD (séparées par des virgules)"
              />
              <small class="form-help">Séparez les compétences par des virgules</small>
            </div>
          </form>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-action="close-modal">
              Annuler
            </button>
            <button class="btn" data-action="save-membre">
              ${isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  onMounted() {
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
    this.loadData();
  }

  async loadData() {
    try {
      const membres = await equipeApi.getAll();
      this.setState({
        loading: false,
        membres: Array.isArray(membres) ? membres : []
      });
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
      this.setState({ loading: false, membres: [] });
    }
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const id = e.target.closest('[data-id]')?.dataset.id;

    switch (action) {
      case 'new-membre':
        this.setState({
          showForm: true,
          editingMembre: null,
          formData: this.getEmptyFormData()
        });
        break;

      case 'edit':
        const membre = this.state.membres.find(m => m.id === parseInt(id));
        if (membre) {
          this.setState({
            showForm: true,
            editingMembre: membre,
            formData: { ...membre }
          });
        }
        break;

      case 'delete':
        this.handleDelete(parseInt(id));
        break;

      case 'close-modal':
        this.setState({ showForm: false, editingMembre: null });
        break;

      case 'save-membre':
        this.handleSave();
        break;
    }
  }

  async handleSave() {
    const form = this.$('#membre-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      if (this.state.editingMembre) {
        await equipeApi.update(this.state.editingMembre.id, data);
      } else {
        await equipeApi.create(data);
      }

      this.setState({ showForm: false, editingMembre: null });
      await this.loadData();
    } catch (error) {
      console.error('Erreur sauvegarde membre:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      return;
    }

    try {
      await equipeApi.delete(id);
      await this.loadData();
    } catch (error) {
      console.error('Erreur suppression membre:', error);
      alert('Erreur lors de la suppression');
    }
  }
}

export default TeamPage;
