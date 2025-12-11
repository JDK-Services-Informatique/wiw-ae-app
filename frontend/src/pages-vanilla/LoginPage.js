/**
 * Page de connexion vanilla JS
 */

import { Component } from '../core/component';
import { router } from '../core/router';
import { authService } from '../core/auth';

export class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'login', // 'login' ou 'register'
      loading: false,
      error: null
    };
  }

  render() {
    const { mode, loading, error } = this.state;
    const isLogin = mode === 'login';

    return `
      <div class="auth-page">
        <div class="auth-container">
          <div class="auth-card card">
            <div class="auth-header">
              <h1>${isLogin ? 'Connexion' : 'Inscription'}</h1>
              <p>${isLogin
                ? 'Connectez-vous à votre compte'
                : 'Créez votre compte gratuit'}</p>
            </div>

            ${error ? `
              <div class="alert alert-error">
                ${error}
              </div>
            ` : ''}

            <form id="auth-form" class="auth-form">
              ${!isLogin ? `
                <div class="form-group">
                  <label for="nom">Nom complet</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    class="form-control"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
              ` : ''}

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-control"
                  placeholder="exemple@email.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  minlength="6"
                />
              </div>

              ${!isLogin ? `
                <div class="form-group">
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    class="form-control"
                    placeholder="••••••••"
                    required
                    minlength="6"
                  />
                </div>
              ` : ''}

              <button
                type="submit"
                class="btn btn-block ${loading ? 'loading' : ''}"
                ${loading ? 'disabled' : ''}
              >
                ${loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer un compte')}
              </button>
            </form>

            <div class="auth-footer">
              <p>
                ${isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                <button class="btn-link" data-action="toggle-mode">
                  ${isLogin ? 'S\'inscrire' : 'Se connecter'}
                </button>
              </p>
              ${isLogin ? `
                <a href="/forgot-password" class="btn-link" data-link>
                  Mot de passe oublié ?
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  onMounted() {
    const form = this.$('#auth-form');
    this.addEventListener(form, 'submit', this.handleSubmit.bind(this));
    this.addEventListener(this.element, 'click', this.handleClick.bind(this));
  }

  handleClick(e) {
    const action = e.target.closest('[data-action]')?.dataset.action;

    if (action === 'toggle-mode') {
      this.setState({
        mode: this.state.mode === 'login' ? 'register' : 'login',
        error: null
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    if (this.state.mode === 'register') {
      if (data.password !== data.confirmPassword) {
        this.setState({ error: 'Les mots de passe ne correspondent pas' });
        return;
      }
    }

    this.setState({ loading: true, error: null });

    try {
      if (this.state.mode === 'login') {
        await authService.login(data.email, data.password);
      } else {
        await authService.register({
          nom: data.nom,
          email: data.email,
          motDePasse: data.password
        });
      }

      // Redirection après succès
      router.navigate('/dashboard');
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message || 'Une erreur est survenue'
      });
    }
  }
}

export default LoginPage;
