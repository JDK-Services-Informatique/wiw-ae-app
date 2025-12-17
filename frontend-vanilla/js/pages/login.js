/**
 * Page Login - WiW AE+
 * Version améliorée avec validation et UX avancée
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { authService } from '../api/auth.js';
import { router } from '../router.js';
import { t } from '../i18n/index.js';
import { toast } from '../components/ui/toast.js';
import { FormValidator } from '../utils/validation.js';

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
        this.validator = null;
    }

    render() {
        const { email, password, showPassword, loading, error } = this.state;

        return `
            <div class="login-page animate-fadeIn">
                <div class="login-container">
                    <div class="login-header">
                        <div class="login-logo animate-scaleIn">W</div>
                        <h1 class="login-title">${t('auth.welcomeBack')}</h1>
                        <p class="login-subtitle">${t('auth.signIn')} pour accéder à votre espace</p>
                    </div>

                    <form class="login-form" id="login-form" novalidate>
                        ${error ? `
                            <div class="alert alert-error" role="alert">
                                <span class="alert-icon">⚠️</span>
                                <span>${error}</span>
                                <button type="button" class="alert-close" data-dismiss-error>×</button>
                            </div>
                        ` : ''}

                        <div class="form-group">
                            <label class="form-label form-label-required" for="email">${t('auth.email')}</label>
                            <div class="form-input-wrapper">
                                <span class="form-input-icon form-input-icon-left">✉️</span>
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
                        </div>

                        <div class="form-group">
                            <label class="form-label form-label-required" for="password">${t('auth.password')}</label>
                            <div class="form-input-wrapper">
                                <span class="form-input-icon form-input-icon-left">🔒</span>
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
                                <button type="button" class="form-input-action" id="toggle-password" title="Afficher/Masquer">
                                    ${showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mb-lg">
                            <label class="form-checkbox-custom">
                                <input type="checkbox" id="remember" name="remember" />
                                <span class="form-checkbox-box"></span>
                                <span>${t('auth.rememberMe')}</span>
                            </label>
                            <a href="/forgot-password" class="text-sm text-brand hover-underline">${t('auth.forgotPassword')}</a>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg w-full" ${loading ? 'disabled' : ''} id="submit-btn">
                            ${loading ? `
                                <span class="btn-loader">
                                    <span class="dots-loader"><span></span><span></span><span></span></span>
                                </span>
                                Connexion...
                            ` : `
                                <span>${t('auth.signIn')}</span>
                                <span class="btn-icon">→</span>
                            `}
                        </button>

                        <div class="login-divider"><span>ou</span></div>

                        <button type="button" class="btn btn-outline w-full" id="demo-login">
                            <span>🚀</span>
                            <span>Accès démo</span>
                        </button>
                    </form>

                    <div class="login-footer">
                        <p>${t('auth.noAccount')} <a href="/pricing" class="font-medium">${t('auth.signUp')}</a></p>
                    </div>

                    <div class="login-security">
                        <span class="security-icon">🔐</span>
                        <span>Connexion sécurisée SSL</span>
                    </div>
                </div>

                <div class="login-decoration" aria-hidden="true">
                    <div class="deco-circle deco-1"></div>
                    <div class="deco-circle deco-2"></div>
                    <div class="deco-circle deco-3"></div>
                </div>
            </div>
        `;
    }

    onMount() {
        const form = this.$('#login-form');
        const emailInput = this.$('#email');
        const passwordInput = this.$('#password');
        const toggleBtn = this.$('#toggle-password');
        const demoBtn = this.$('#demo-login');

        // Initialiser le validateur
        this.validator = new FormValidator(form, {
            email: { rules: ['required', 'email'] },
            password: { rules: ['required', { minLength: 1, message: 'Veuillez entrer votre mot de passe' }] }
        }, { validateOnBlur: true, validateOnInput: false, showErrorsInline: true });

        // Form submit
        this.on(form, 'submit', this.handleSubmit);

        // Toggle password
        this.on(toggleBtn, 'click', () => {
            this.state.showPassword = !this.state.showPassword;
            passwordInput.type = this.state.showPassword ? 'text' : 'password';
            toggleBtn.textContent = this.state.showPassword ? '🙈' : '👁️';
        });

        // Track inputs
        this.on(emailInput, 'input', (e) => { this.state.email = e.target.value; this.clearError(); });
        this.on(passwordInput, 'input', (e) => { this.state.password = e.target.value; this.clearError(); });

        // Demo login
        this.on(demoBtn, 'click', () => this.handleDemoLogin());

        // Dismiss error
        const dismissBtn = this.$('[data-dismiss-error]');
        if (dismissBtn) this.on(dismissBtn, 'click', () => this.clearError());

        // Focus email
        setTimeout(() => emailInput?.focus(), 300);
    }

    clearError() {
        if (this.state.error) {
            this.state.error = null;
            const alert = this.$('.alert-error');
            if (alert) alert.remove();
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if (!this.validator.validate()) return;

        const { email, password } = this.state;
        this.setState({ loading: true, error: null });

        try {
            await authService.login(email, password);
            toast.success(t('auth.loginSuccess'));

            const btn = this.$('#submit-btn');
            if (btn) {
                btn.innerHTML = '<span class="success-check">✓</span> Connecté !';
                btn.classList.add('btn-success');
            }

            setTimeout(() => router.navigate('/dashboard'), 500);
        } catch (error) {
            this.setState({ error: error.message || t('auth.loginError'), loading: false });
        }
    }

    handleDemoLogin = async () => {
        this.setState({ email: 'demo@wiw-ae.com', password: 'demo123' });
        const emailInput = this.$('#email');
        const passwordInput = this.$('#password');
        if (emailInput) emailInput.value = 'demo@wiw-ae.com';
        if (passwordInput) passwordInput.value = 'demo123';
        setTimeout(() => this.handleSubmit(new Event('submit')), 300);
    }
}

export function renderLogin() {
    const page = new LoginPage();
    return page.render();
}

export default LoginPage;
