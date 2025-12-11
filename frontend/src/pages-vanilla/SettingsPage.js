/**
 * Page Paramètres vanilla JS
 */

import { Component } from '../core/component';
import { appStore, actions } from '../core/store';
import { authService } from '../core/auth';
import storage, { STORAGE_KEYS } from '../utils/storage';

export class SettingsPage extends Component {
  constructor(props) {
    super(props);
    const state = appStore.getState();
    const user = authService.getCurrentUser();

    this.state = {
      theme: state.theme,
      user: user || {},
      saving: false,
      message: null
    };
  }

  render() {
    const { theme, user, saving, message } = this.state;

    return `
      <div class="settings-page">
        <div class="page-header">
          <h2>Paramètres</h2>
        </div>

        ${message ? `
          <div class="alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}">
            ${message.text}
          </div>
        ` : ''}

        <!-- Apparence -->
        <div class="card settings-section">
          <h3>Apparence</h3>

          <div class="setting-item">
            <div class="setting-info">
              <label>Thème</label>
              <p>Choisissez le thème de l'interface</p>
            </div>
            <div class="setting-control">
              <div class="theme-toggle">
                <button
                  class="theme-btn ${theme === 'light' ? 'active' : ''}"
                  data-action="set-theme"
                  data-value="light"
                >
                  ☀️ Clair
                </button>
                <button
                  class="theme-btn ${theme === 'dark' ? 'active' : ''}"
                  data-action="set-theme"
                  data-value="dark"
                >
                  🌙 Sombre
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profil -->
        <div class="card settings-section">
          <h3>Profil</h3>

          <form id="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  class="form-control"
                  value="${user.nom || ''}"
                />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  value="${user.email || ''}"
                  disabled
                />
              </div>
            </div>

            <button type="submit" class="btn ${saving ? 'loading' : ''}" ${saving ? 'disabled' : ''}>
              ${saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        <!-- Données -->
        <div class="card settings-section">
          <h3>Données</h3>

          <div class="setting-item">
            <div class="setting-info">
              <label>Exporter les données</label>
              <p>Téléchargez une copie de toutes vos données</p>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" data-action="export-data">
                📥 Exporter
              </button>
            </div>
          </div>

          <div class="setting-item danger">
            <div class="setting-info">
              <label>Supprimer les données locales</label>
              <p>Efface toutes les données stockées localement</p>
            </div>
            <div class="setting-control">
              <button class="btn btn-danger" data-action="clear-data">
                🗑️ Effacer
              </button>
            </div>
          </div>
        </div>

        <!-- Compte -->
        <div class="card settings-section">
          <h3>Compte</h3>

          <div class="setting-item">
            <div class="setting-info">
              <label>Déconnexion</label>
              <p>Se déconnecter de l'application</p>
            </div>
            <div class="setting-control">
              <button class="btn btn-secondary" data-action="logout">
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  onMounted() {
    const form = this.$('#profile-form');
    this.addEventListener(form, 'submit', this.handleProfileSubmit.bind(this));
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const value = e.target.closest('[data-value]')?.dataset.value;

    switch (action) {
      case 'set-theme':
        this.setTheme(value);
        break;
      case 'export-data':
        this.exportData();
        break;
      case 'clear-data':
        this.clearData();
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  setTheme(theme) {
    actions.setTheme(theme);
    this.setState({ theme });
  }

  async handleProfileSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    this.setState({ saving: true, message: null });

    try {
      // Mettre à jour le localStorage
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...data };
      storage.set(STORAGE_KEYS.USER, updatedUser);

      this.setState({
        saving: false,
        user: updatedUser,
        message: { type: 'success', text: 'Profil mis à jour avec succès' }
      });

      // Effacer le message après 3 secondes
      setTimeout(() => this.setState({ message: null }), 3000);
    } catch (error) {
      this.setState({
        saving: false,
        message: { type: 'error', text: 'Erreur lors de la mise à jour' }
      });
    }
  }

  exportData() {
    const data = storage.export();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiw-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.setState({
      message: { type: 'success', text: 'Données exportées avec succès' }
    });
    setTimeout(() => this.setState({ message: null }), 3000);
  }

  clearData() {
    if (!confirm('Êtes-vous sûr de vouloir effacer toutes les données locales ? Cette action est irréversible.')) {
      return;
    }

    storage.clearApp();
    this.setState({
      message: { type: 'success', text: 'Données locales effacées' }
    });
    setTimeout(() => this.setState({ message: null }), 3000);
  }

  logout() {
    authService.logout();
  }
}

export default SettingsPage;
