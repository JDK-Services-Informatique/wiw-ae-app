/**
 * Page Honoraires vanilla JS
 */

import { Component } from '../core/component';
import { honorairesApi } from '../core/api';
import { formatMontant } from '../utils/formatNumber';

export class HonorairesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      montantTravaux: '',
      complexite: 'moyenne',
      partenaires: [],
      resultat: null
    };
  }

  render() {
    const { loading, montantTravaux, complexite, partenaires, resultat } = this.state;

    return `
      <div class="honoraires-page">
        <div class="page-header">
          <h2>Calcul d'honoraires</h2>
        </div>

        <div class="honoraires-container">
          <!-- Formulaire de calcul -->
          <div class="card">
            <h3>Paramètres du calcul</h3>

            <form id="calc-form">
              <div class="form-group">
                <label for="montantTravaux">Montant des travaux (€ HT)</label>
                <input
                  type="number"
                  id="montantTravaux"
                  name="montantTravaux"
                  class="form-control"
                  value="${montantTravaux}"
                  placeholder="Ex: 500000"
                  required
                />
              </div>

              <div class="form-group">
                <label for="complexite">Complexité du projet</label>
                <select id="complexite" name="complexite" class="form-control">
                  <option value="simple" ${complexite === 'simple' ? 'selected' : ''}>Simple</option>
                  <option value="moyenne" ${complexite === 'moyenne' ? 'selected' : ''}>Moyenne</option>
                  <option value="complexe" ${complexite === 'complexe' ? 'selected' : ''}>Complexe</option>
                </select>
              </div>

              <!-- Partenaires -->
              <div class="partenaires-section">
                <div class="section-header">
                  <h4>Partenaires</h4>
                  <button type="button" class="btn btn-sm" data-action="add-partenaire">
                    + Ajouter
                  </button>
                </div>

                <div id="partenaires-list">
                  ${partenaires.map((p, i) => `
                    <div class="partenaire-row" data-index="${i}">
                      <input
                        type="text"
                        class="form-control"
                        name="partenaire-nom-${i}"
                        value="${p.nom}"
                        placeholder="Nom du partenaire"
                      />
                      <input
                        type="number"
                        class="form-control"
                        name="partenaire-taux-${i}"
                        value="${p.taux}"
                        placeholder="Taux %"
                        min="0"
                        max="100"
                      />
                      <button type="button" class="btn-icon" data-action="remove-partenaire" data-index="${i}">
                        🗑️
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-block ${loading ? 'loading' : ''}"
                ${loading ? 'disabled' : ''}
              >
                ${loading ? 'Calcul...' : 'Calculer les honoraires'}
              </button>
            </form>
          </div>

          <!-- Résultats -->
          ${resultat ? `
            <div class="card results-card">
              <h3>Résultats</h3>

              <div class="result-grid">
                <div class="result-item">
                  <span class="result-label">Montant travaux</span>
                  <span class="result-value">${formatMontant(resultat.montantTravaux)}</span>
                </div>

                <div class="result-item">
                  <span class="result-label">Taux appliqué</span>
                  <span class="result-value">${resultat.taux}%</span>
                </div>

                <div class="result-item highlight">
                  <span class="result-label">Honoraires HT</span>
                  <span class="result-value">${formatMontant(resultat.honorairesHT)}</span>
                </div>

                <div class="result-item">
                  <span class="result-label">TVA (20%)</span>
                  <span class="result-value">${formatMontant(resultat.tva)}</span>
                </div>

                <div class="result-item highlight">
                  <span class="result-label">Honoraires TTC</span>
                  <span class="result-value">${formatMontant(resultat.honorairesTTC)}</span>
                </div>
              </div>

              ${resultat.partenaires?.length > 0 ? `
                <div class="partenaires-results">
                  <h4>Répartition par partenaire</h4>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Partenaire</th>
                        <th>Taux</th>
                        <th>Montant HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${resultat.partenaires.map(p => `
                        <tr>
                          <td>${p.nom}</td>
                          <td>${p.taux}%</td>
                          <td>${formatMontant(p.montant)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  onMounted() {
    const form = this.$('#calc-form');
    this.addEventListener(form, 'submit', this.handleSubmit.bind(this));
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const index = e.target.closest('[data-index]')?.dataset.index;

    if (action === 'add-partenaire') {
      this.setState({
        partenaires: [...this.state.partenaires, { nom: '', taux: '' }]
      });
    } else if (action === 'remove-partenaire' && index !== undefined) {
      const newPartenaires = [...this.state.partenaires];
      newPartenaires.splice(parseInt(index), 1);
      this.setState({ partenaires: newPartenaires });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const montantTravaux = parseFloat(formData.get('montantTravaux'));
    const complexite = formData.get('complexite');

    // Collecter les partenaires
    const partenaires = this.state.partenaires.map((_, i) => ({
      nom: formData.get(`partenaire-nom-${i}`),
      taux: parseFloat(formData.get(`partenaire-taux-${i}`)) || 0
    })).filter(p => p.nom && p.taux > 0);

    this.setState({ loading: true });

    try {
      // Calcul local (ou appel API)
      const taux = this.getTaux(montantTravaux, complexite);
      const honorairesHT = montantTravaux * (taux / 100);
      const tva = honorairesHT * 0.20;
      const honorairesTTC = honorairesHT + tva;

      const partenairesResults = partenaires.map(p => ({
        ...p,
        montant: honorairesHT * (p.taux / 100)
      }));

      this.setState({
        loading: false,
        resultat: {
          montantTravaux,
          taux,
          honorairesHT,
          tva,
          honorairesTTC,
          partenaires: partenairesResults
        }
      });
    } catch (error) {
      console.error('Erreur calcul:', error);
      this.setState({ loading: false });
    }
  }

  /**
   * Calcule le taux d'honoraires selon le barème
   */
  getTaux(montant, complexite) {
    // Barème simplifié
    const bareme = {
      simple: { base: 8, reduction: 0.5 },
      moyenne: { base: 10, reduction: 0.6 },
      complexe: { base: 12, reduction: 0.7 }
    };

    const { base, reduction } = bareme[complexite] || bareme.moyenne;

    // Dégressivité selon le montant
    if (montant > 1000000) {
      return base * reduction;
    } else if (montant > 500000) {
      return base * (reduction + 0.1);
    } else if (montant > 200000) {
      return base * (reduction + 0.2);
    }

    return base;
  }
}

export default HonorairesPage;
