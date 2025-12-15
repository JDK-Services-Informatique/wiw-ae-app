/**
 * Page Login - WiW AE+
 */

import { Component, html } from '../components/base.js';
import { icons } from '../components/icons.js';
import { authService } from '../api/auth.js';
import { router } from '../router.js';
import { t } from '../i18n/index.js';
import { toast } from '../components/ui/toast.js';

export class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            loading: false,
            error: null
        };
    }

    render() {
        const { email, password, showPassword, loading, error } = this.state;

        return `
            <div class="login-page">
                <div class="login-container">
                    <div class="login-header">
                        <div class="login-logo">W</div>
                        <h1 class="login-title">${t('auth.welcomeBack')}</h1>
                        <p class="login-subtitle">${t('auth.signIn')} pour accéder à votre espace</p>
                    </div>

                    <form class="login-form" id="login-form">
                        ${error ? `
                            <div class="form-error mb-md p-md rounded bg-error-light">
                                ${error}
                            </div>
                        ` : ''}

                        <div class="form-group">
                            <label class="form-label" for="email">${t('auth.email')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="form-input"
                                placeholder="nom@entreprise.com"
                                value="${email}"
                                required
                                autocomplete="email"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="password">${t('auth.password')}</label>
                            <div class="relative">
                                <input
                                    type="${showPassword ? 'text' : 'password'}"
                                    id="password"
                                    name="password"
                                    class="form-input"
                                    placeholder="••••••••"
                                    value="${password}"
                                    required
                                    autocomplete="current-password"
                                />
                                <button
                                    type="button"
                                    class="absolute right-0 top-0 h-full px-md text-muted"
                                    id="toggle-password"
                                    aria-label="Afficher le mot de passe"
                                >
                                    ${showPassword ? icons.eyeOff : icons.eye}
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mb-lg">
                            <label class="form-check">
                                <input type="checkbox" class="form-check-input" id="remember" />
                                <span class="form-check-label">${t('auth.rememberMe')}</span>
                            </label>
                            <a href="/forgot-password" class="text-sm text-brand">${t('auth.forgotPassword')}</a>
                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary w-full"
                            ${loading ? 'disabled' : ''}
                        >
                            ${loading ? `
                                <span class="loader-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
                                ${t('common.loading')}
                            ` : t('auth.signIn')}
                        </button>
                    </form>

                    <div class="login-footer">
                        <p>
                            ${t('auth.noAccount')}
                            <a href="/pricing">${t('auth.signUp')}</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    onMount() {
        const form = this.$('#login-form');
        const emailInput = this.$('#email');
        const passwordInput = this.$('#password');
        const toggleBtn = this.$('#toggle-password');

        // Form submit
        this.on(form, 'submit', this.handleSubmit);

        // Toggle password visibility
        this.on(toggleBtn, 'click', () => {
            this.state.showPassword = !this.state.showPassword;
            passwordInput.type = this.state.showPassword ? 'text' : 'password';
            toggleBtn.innerHTML = this.state.showPassword ? icons.eyeOff : icons.eye;
        });

        // Track input changes
        this.on(emailInput, 'input', (e) => {
            this.state.email = e.target.value;
        });

        this.on(passwordInput, 'input', (e) => {
            this.state.password = e.target.value;
        });

        // Focus email input
        emailInput.focus();
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: t('errors.required') });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            await authService.login(email, password);
            toast.success(t('auth.loginSuccess'));
            router.navigate('/dashboard');
        } catch (error) {
            this.setState({
                error: error.message || t('auth.loginError'),
                loading: false
            });
        }
    }
}

// Export pour le router
export function renderLogin() {
    const page = new LoginPage();
    return page.render();
}

export default LoginPage;
