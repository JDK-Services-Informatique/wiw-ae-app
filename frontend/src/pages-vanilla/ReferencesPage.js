/**
 * Page Références vanilla JS
 */

import { Component } from '../core/component';
import { referencesApi } from '../core/api';
import { formatMontant } from '../utils/formatNumber';

export class ReferencesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      references: [],
      searchTerm: '',
      showForm: false,
      editingRef: null,
      formData: this.getEmptyFormData()
    };
  }

  getEmptyFormData() {
    return {
      titre: '',
      client: '',
      annee: new Date().getFullYear(),
      montant: '',
      surface: '',
      description: '',
      localisation: ''
    };
  }

  render() {
    const { loading, references, searchTerm, showForm, editingRef, formData } = this.state;

    const filteredRefs = references.filter(ref =>
      ref.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.client?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
      return `
        <div class="references-page">
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="references-page">
        <div class="page-header">
          <h2>Références</h2>
          <button class="btn" data-action="new-ref">
            + Nouvelle référence
          </button>
        </div>

        <!-- Recherche -->
        <div class="card search-card">
          <div class="search-input-wrapper">
            <input
              type="text"
              id="search"
              class="form-control"
              placeholder="Rechercher une référence..."
              value="${searchTerm}"
            />
          </div>
          <div class="references-count">
            ${filteredRefs.length} référence(s) trouvée(s)
          </div>
        </div>

        <!-- Liste des références -->
        <div class="references-grid">
          ${filteredRefs.length > 0 ? filteredRefs.map(ref => `
            <div class="reference-card card" data-id="${ref.id}">
              <div class="ref-header">
                <h4>${ref.titre}</h4>
                <span class="ref-year">${ref.annee || '-'}</span>
              </div>
              <div class="ref-body">
                <p><strong>Client:</strong> ${ref.client || '-'}</p>
                <p><strong>Localisation:</strong> ${ref.localisation || '-'}</p>
                <p><strong>Montant:</strong> ${formatMontant(ref.montant)}</p>
                ${ref.surface ? `<p><strong>Surface:</strong> ${ref.surface} m²</p>` : ''}
                ${ref.description ? `<p class="ref-description">${ref.description}</p>` : ''}
              </div>
              <div class="ref-footer">
                <button class="btn btn-sm" data-action="edit" data-id="${ref.id}">
                  Modifier
                </button>
                <button class="btn btn-sm btn-secondary" data-action="delete" data-id="${ref.id}">
                  Supprimer
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state card">
              <p>Aucune référence trouvée</p>
              <button class="btn" data-action="new-ref">
                Créer une référence
              </button>
            </div>
          `}
        </div>

        <!-- Modal Formulaire -->
        ${showForm ? this.renderForm(formData, editingRef) : ''}
      </div>
    `;
  }

  renderForm(data, isEditing) {
    return `
      <div class="modal-overlay" data-action="close-modal">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>${isEditing ? 'Modifier la référence' : 'Nouvelle référence'}</h3>
            <button class="btn-icon" data-action="close-modal">✕</button>
          </div>
          <form id="ref-form" class="modal-body">
            <div class="form-group">
              <label for="titre">Titre du projet *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                class="form-control"
                value="${data.titre || ''}"
                required
              />
            </div>

            <div class="form-row">
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
              <div class="form-group">
                <label for="annee">Année</label>
                <input
                  type="number"
                  id="annee"
                  name="annee"
                  class="form-control"
                  value="${data.annee || ''}"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="montant">Montant (€)</label>
                <input
                  type="number"
                  id="montant"
                  name="montant"
                  class="form-control"
                  value="${data.montant || ''}"
                />
              </div>
              <div class="form-group">
                <label for="surface">Surface (m²)</label>
                <input
                  type="number"
                  id="surface"
                  name="surface"
                  class="form-control"
                  value="${data.surface || ''}"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="localisation">Localisation</label>
              <input
                type="text"
                id="localisation"
                name="localisation"
                class="form-control"
                value="${data.localisation || ''}"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                class="form-control"
                rows="4"
              >${data.description || ''}</textarea>
            </div>
          </form>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-action="close-modal">
              Annuler
            </button>
            <button class="btn" data-action="save-ref">
              ${isEditing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  onMounted() {
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
    this.addEventListener(this.element, 'input', this.handleInput.bind(this));
    this.loadData();
  }

  async loadData() {
    try {
      const references = await referencesApi.getAll();
      this.setState({
        loading: false,
        references: Array.isArray(references) ? references : []
      });
    } catch (error) {
      console.error('Erreur chargement références:', error);
      this.setState({ loading: false, references: [] });
    }
  }

  handleInput(e) {
    if (e.target.id === 'search') {
      this.setState({ searchTerm: e.target.value });
    }
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const id = e.target.closest('[data-id]')?.dataset.id;

    switch (action) {
      case 'new-ref':
        this.setState({
          showForm: true,
          editingRef: null,
          formData: this.getEmptyFormData()
        });
        break;

      case 'edit':
        const ref = this.state.references.find(r => r.id === parseInt(id));
        if (ref) {
          this.setState({
            showForm: true,
            editingRef: ref,
            formData: { ...ref }
          });
        }
        break;

      case 'delete':
        this.handleDelete(parseInt(id));
        break;

      case 'close-modal':
        this.setState({ showForm: false, editingRef: null });
        break;

      case 'save-ref':
        this.handleSave();
        break;
    }
  }

  async handleSave() {
    const form = this.$('#ref-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Convertir les nombres
    if (data.montant) data.montant = parseFloat(data.montant);
    if (data.surface) data.surface = parseFloat(data.surface);
    if (data.annee) data.annee = parseInt(data.annee);

    try {
      if (this.state.editingRef) {
        await referencesApi.update(this.state.editingRef.id, data);
      } else {
        await referencesApi.create(data);
      }

      this.setState({ showForm: false, editingRef: null });
      await this.loadData();
    } catch (error) {
      console.error('Erreur sauvegarde référence:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async handleDelete(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette référence ?')) {
      return;
    }

    try {
      await referencesApi.delete(id);
      await this.loadData();
    } catch (error) {
      console.error('Erreur suppression référence:', error);
      alert('Erreur lors de la suppression');
    }
  }
}

export default ReferencesPage;
