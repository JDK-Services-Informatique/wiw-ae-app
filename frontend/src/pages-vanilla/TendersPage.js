/**
 * Page Appels d'offres vanilla JS
 */

import { Component } from '../core/component';
import { appelsApi } from '../core/api';
import { formatMontant } from '../utils/formatNumber';

const STATUS_BADGES = {
  'Nouveau': 'badge-info',
  'En cours': 'badge-warning',
  'En négociation': 'badge-secondary',
  'Gagné': 'badge-success',
  'Perdu': 'badge-danger'
};

const STATUTS = [
  { value: 'tous', label: 'Tous' },
  { value: 'Nouveau', label: 'Nouveaux' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Gagné', label: 'Gagnés' },
  { value: 'Perdu', label: 'Perdus' }
];

export class TendersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      aos: [],
      filterStatut: 'tous',
      viewMode: 'table', // 'table' ou 'cards'
      showForm: false,
      editingAO: null,
      formData: this.getEmptyFormData()
    };
  }

  getEmptyFormData() {
    return {
      titre: '',
      client: '',
      type: '',
      montant: '',
      dateRendu: '',
      dureePrevisionnelle: '',
      statut: 'Nouveau',
      description: ''
    };
  }

  render() {
    const { loading, aos, filterStatut, viewMode, showForm, editingAO, formData } = this.state;

    const filteredAOs = filterStatut === 'tous'
      ? aos
      : aos.filter(ao => ao.statut === filterStatut);

    const stats = {
      total: aos.length,
      nouveau: aos.filter(ao => ao.statut === 'Nouveau').length,
      enCours: aos.filter(ao => ao.statut === 'En cours').length,
      gagne: aos.filter(ao => ao.statut === 'Gagné').length,
      perdu: aos.filter(ao => ao.statut === 'Perdu').length
    };

    if (loading) {
      return `
        <div class="tenders-page">
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="tenders-page">
        <!-- Header -->
        <div class="page-header">
          <h2>Appels d'offres</h2>
          <button class="btn" data-action="new-ao">
            + Nouvel AO
          </button>
        </div>

        <!-- Filtres -->
        <div class="card filters-card">
          <div class="filters-row">
            <span class="filters-label">Filtrer par statut:</span>
            <div class="filters-buttons">
              ${STATUTS.map(s => `
                <button
                  class="btn ${filterStatut === s.value ? '' : 'btn-secondary'}"
                  data-action="filter"
                  data-value="${s.value}"
                >
                  ${s.label} (${this.getStatCount(s.value, stats)})
                </button>
              `).join('')}
            </div>
            <div class="view-toggle">
              <button
                class="btn-icon ${viewMode === 'table' ? 'active' : ''}"
                data-action="view"
                data-value="table"
                title="Vue tableau"
              >
                ☰
              </button>
              <button
                class="btn-icon ${viewMode === 'cards' ? 'active' : ''}"
                data-action="view"
                data-value="cards"
                title="Vue cartes"
              >
                ▦
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des AO -->
        <div class="card">
          ${viewMode === 'table'
            ? this.renderTable(filteredAOs)
            : this.renderCards(filteredAOs)}
        </div>

        <!-- Modal Formulaire -->
        ${showForm ? this.renderForm(formData, editingAO) : ''}
      </div>
    `;
  }

  getStatCount(statut, stats) {
    switch (statut) {
      case 'tous': return stats.total;
      case 'Nouveau': return stats.nouveau;
      case 'En cours': return stats.enCours;
      case 'Gagné': return stats.gagne;
      case 'Perdu': return stats.perdu;
      default: return 0;
    }
  }

  renderTable(aos) {
    if (aos.length === 0) {
      return `
        <div class="empty-state">
          <p>Aucun appel d'offres trouvé</p>
        </div>
      `;
    }

    return `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Date rendu</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${aos.map(ao => `
              <tr data-id="${ao.id}">
                <td>
                  <strong>${ao.titre}</strong>
                </td>
                <td>${ao.type || '-'}</td>
                <td>${ao.client || '-'}</td>
                <td>${formatMontant(ao.montant, 0)}</td>
                <td>${ao.dateRendu ? new Date(ao.dateRendu).toLocaleDateString('fr-FR') : '-'}</td>
                <td>
                  <span class="badge ${STATUS_BADGES[ao.statut] || 'badge-secondary'}">
                    ${ao.statut}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="btn-icon" data-action="edit" data-id="${ao.id}" title="Modifier">
                      ✏️
                    </button>
                    <button class="btn-icon" data-action="delete" data-id="${ao.id}" title="Supprimer">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderCards(aos) {
    if (aos.length === 0) {
      return `
        <div class="empty-state">
          <p>Aucun appel d'offres trouvé</p>
        </div>
      `;
    }

    return `
      <div class="cards-grid">
        ${aos.map(ao => `
          <div class="ao-card card" data-id="${ao.id}">
            <div class="ao-card-header">
              <h4>${ao.titre}</h4>
              <span class="badge ${STATUS_BADGES[ao.statut] || 'badge-secondary'}">
                ${ao.statut}
              </span>
            </div>
            <div class="ao-card-body">
              <p><strong>Client:</strong> ${ao.client || '-'}</p>
              <p><strong>Type:</strong> ${ao.type || '-'}</p>
              <p><strong>Montant:</strong> ${formatMontant(ao.montant, 0)}</p>
              <p><strong>Date rendu:</strong> ${ao.dateRendu ? new Date(ao.dateRendu).toLocaleDateString('fr-FR') : '-'}</p>
            </div>
            <div class="ao-card-footer">
              <button class="btn btn-sm" data-action="edit" data-id="${ao.id}">
                Modifier
              </button>
              <button class="btn btn-sm btn-secondary" data-action="delete" data-id="${ao.id}">
                Supprimer
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderForm(data, isEditing) {
    return `
      <div class="modal-overlay" data-action="close-modal">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>${isEditing ? 'Modifier l\'AO' : 'Nouvel appel d\'offres'}</h3>
            <button class="btn-icon" data-action="close-modal">✕</button>
          </div>
          <form id="ao-form" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label for="titre">Titre *</label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  class="form-control"
                  value="${data.titre || ''}"
                  required
                />
              </div>
              <div class="form-group">
                <label for="client">Client</label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  class="form-control"
                  value="${data.client || ''}"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="type">Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  class="form-control"
                  value="${data.type || ''}"
                />
              </div>
              <div class="form-group">
                <label for="montant">Montant estimé</label>
                <input
                  type="number"
                  id="montant"
                  name="montant"
                  class="form-control"
                  value="${data.montant || ''}"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dateRendu">Date de rendu</label>
                <input
                  type="date"
                  id="dateRendu"
                  name="dateRendu"
                  class="form-control"
                  value="${data.dateRendu ? data.dateRendu.split('T')[0] : ''}"
                />
              </div>
              <div class="form-group">
                <label for="statut">Statut</label>
                <select id="statut" name="statut" class="form-control">
                  <option value="Nouveau" ${data.statut === 'Nouveau' ? 'selected' : ''}>Nouveau</option>
                  <option value="En cours" ${data.statut === 'En cours' ? 'selected' : ''}>En cours</option>
                  <option value="En négociation" ${data.statut === 'En négociation' ? 'selected' : ''}>En négociation</option>
                  <option value="Gagné" ${data.statut === 'Gagné' ? 'selected' : ''}>Gagné</option>
                  <option value="Perdu" ${data.statut === 'Perdu' ? 'selected' : ''}>Perdu</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                class="form-control"
                rows="3"
              >${data.description || ''}</textarea>
            </div>
          </form>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-action="close-modal">
              Annuler
            </button>
            <button class="btn" data-action="save-ao">
              ${isEditing ? 'Mettre à jour' : 'Créer'}
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
      const aos = await appelsApi.getAll();
      this.setState({
        loading: false,
        aos: Array.isArray(aos) ? aos : []
      });
    } catch (error) {
      console.error('Erreur chargement AO:', error);
      this.setState({ loading: false, aos: [] });
    }
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const id = e.target.closest('[data-id]')?.dataset.id;
    const value = e.target.closest('[data-value]')?.dataset.value;

    switch (action) {
      case 'new-ao':
        this.setState({
          showForm: true,
          editingAO: null,
          formData: this.getEmptyFormData()
        });
        break;

      case 'edit':
        const ao = this.state.aos.find(a => a.id === parseInt(id));
        if (ao) {
          this.setState({
            showForm: true,
            editingAO: ao,
            formData: { ...ao }
          });
        }
        break;

      case 'delete':
        this.handleDelete(parseInt(id));
        break;

      case 'close-modal':
        this.setState({ showForm: false, editingAO: null });
        break;

      case 'save-ao':
        this.handleSave();
        break;

      case 'filter':
        this.setState({ filterStatut: value });
        break;

      case 'view':
        this.setState({ viewMode: value });
        break;
    }
  }

  async handleSave() {
    const form = this.$('#ao-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Convertir montant en nombre
    if (data.montant) {
      data.montant = parseFloat(data.montant);
    }

    try {
      if (this.state.editingAO) {
        await appelsApi.update(this.state.editingAO.id, data);
      } else {
        await appelsApi.create(data);
      }

      this.setState({ showForm: false, editingAO: null });
      await this.loadData();
    } catch (error) {
      console.error('Erreur sauvegarde AO:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet appel d\'offres ?')) {
      return;
    }

    try {
      await appelsApi.delete(id);
      await this.loadData();
    } catch (error) {
      console.error('Erreur suppression AO:', error);
      alert('Erreur lors de la suppression');
    }
  }
}

export default TendersPage;
