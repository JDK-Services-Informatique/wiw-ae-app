/**
 * Page Dashboard vanilla JS
 */

import { Component } from '../core/component';
import { appelsApi, referencesApi } from '../core/api';
import { authService } from '../core/auth';

export class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      stats: {
        totalAO: 0,
        aoEnCours: 0,
        aoGagnes: 0,
        totalReferences: 0
      },
      recentAO: []
    };
  }

  render() {
    const { loading, stats, recentAO } = this.state;
    const user = authService.getCurrentUser();

    if (loading) {
      return `
        <div class="dashboard-page">
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="dashboard-page">
        <!-- Welcome -->
        <div class="welcome-banner card">
          <h2>Bienvenue, ${user?.nom || 'Utilisateur'} 👋</h2>
          <p>Voici un aperçu de votre activité</p>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <div class="stat-value">${stats.totalAO}</div>
              <div class="stat-label">Appels d'offres</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">${stats.aoEnCours}</div>
              <div class="stat-label">En cours</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">🏆</div>
            <div class="stat-content">
              <div class="stat-value">${stats.aoGagnes}</div>
              <div class="stat-label">Gagnés</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-value">${stats.totalReferences}</div>
              <div class="stat-label">Références</div>
            </div>
          </div>
        </div>

        <!-- Recent AO -->
        <div class="recent-section card">
          <h3>Appels d'offres récents</h3>
          ${recentAO.length > 0 ? `
            <div class="recent-list">
              ${recentAO.map(ao => `
                <div class="recent-item">
                  <div class="recent-item-info">
                    <span class="recent-item-title">${ao.titre}</span>
                    <span class="recent-item-client">${ao.client || '-'}</span>
                  </div>
                  <span class="badge ${this.getStatusBadge(ao.statut)}">${ao.statut}</span>
                </div>
              `).join('')}
            </div>
            <div class="recent-footer">
              <a href="/tenders" class="btn btn-secondary" data-link>
                Voir tous les AO
              </a>
            </div>
          ` : `
            <div class="empty-state">
              <p>Aucun appel d'offres pour le moment</p>
              <a href="/tenders" class="btn" data-link>
                Créer un AO
              </a>
            </div>
          `}
        </div>
      </div>
    `;
  }

  getStatusBadge(statut) {
    const badges = {
      'Nouveau': 'badge-info',
      'En cours': 'badge-warning',
      'En négociation': 'badge-secondary',
      'Gagné': 'badge-success',
      'Perdu': 'badge-danger'
    };
    return badges[statut] || 'badge-secondary';
  }

  async onMounted() {
    await this.loadData();
  }

  async loadData() {
    try {
      const [aos, references] = await Promise.all([
        appelsApi.getAll().catch(() => []),
        referencesApi.getAll().catch(() => [])
      ]);

      const aoList = Array.isArray(aos) ? aos : [];
      const refList = Array.isArray(references) ? references : [];

      this.setState({
        loading: false,
        stats: {
          totalAO: aoList.length,
          aoEnCours: aoList.filter(ao => ao.statut === 'En cours').length,
          aoGagnes: aoList.filter(ao => ao.statut === 'Gagné').length,
          totalReferences: refList.length
        },
        recentAO: aoList.slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      this.setState({ loading: false });
    }
  }
}

export default DashboardPage;
