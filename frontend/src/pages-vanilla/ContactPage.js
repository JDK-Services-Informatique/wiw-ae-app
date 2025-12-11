/**
 * Page Contact vanilla JS
 */

import { Component } from '../core/component';

export class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      sent: false,
      error: null
    };
  }

  render() {
    const { sending, sent, error } = this.state;

    return `
      <div class="contact-page">
        <div class="container">
          <div class="contact-header">
            <h1>Contactez-nous</h1>
            <p>Une question ? Un besoin spécifique ? Nous sommes là pour vous aider.</p>
          </div>

          <div class="contact-grid">
            <!-- Formulaire -->
            <div class="card contact-form-card">
              ${sent ? `
                <div class="success-message">
                  <div class="success-icon">✓</div>
                  <h3>Message envoyé !</h3>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                  <button class="btn" data-action="reset">
                    Envoyer un autre message
                  </button>
                </div>
              ` : `
                <h3>Envoyez-nous un message</h3>

                ${error ? `
                  <div class="alert alert-error">${error}</div>
                ` : ''}

                <form id="contact-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="nom">Nom *</label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        class="form-control"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="sujet">Sujet *</label>
                    <select id="sujet" name="sujet" class="form-control" required>
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="demo">Demande de démo</option>
                      <option value="support">Support technique</option>
                      <option value="commercial">Demande commerciale</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      class="form-control"
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-block ${sending ? 'loading' : ''}"
                    ${sending ? 'disabled' : ''}
                  >
                    ${sending ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              `}
            </div>

            <!-- Informations de contact -->
            <div class="contact-info">
              <div class="card info-card">
                <div class="info-icon">📧</div>
                <h4>Email</h4>
                <p>contact@wiw-app.com</p>
              </div>

              <div class="card info-card">
                <div class="info-icon">📱</div>
                <h4>Téléphone</h4>
                <p>+33 1 23 45 67 89</p>
              </div>

              <div class="card info-card">
                <div class="info-icon">📍</div>
                <h4>Adresse</h4>
                <p>123 Avenue des Architectes<br/>75001 Paris, France</p>
              </div>

              <div class="card info-card">
                <div class="info-icon">🕐</div>
                <h4>Horaires</h4>
                <p>Lundi - Vendredi<br/>9h00 - 18h00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  onMounted() {
    const form = this.$('#contact-form');
    if (form) {
      this.addEventListener(form, 'submit', this.handleSubmit.bind(this));
    }
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;

    if (action === 'reset') {
      this.setState({ sent: false, error: null });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    this.setState({ sending: true, error: null });

    try {
      // Simuler l'envoi (remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Message envoyé:', data);
      this.setState({ sending: false, sent: true });
    } catch (error) {
      this.setState({
        sending: false,
        error: 'Erreur lors de l\'envoi. Veuillez réessayer.'
      });
    }
  }
}

export default ContactPage;
