/**
 * Page Mot de passe oublié - WiW AE+
 * Demande de réinitialisation de mot de passe
 */

import { Component } from '../components/base.js';
import { toast } from '../components/ui/toast.js';
import { router } from '../router.js';

export class ForgotPasswordPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            isSuccess: false,
            error: '',
            resetLink: ''
        };
    }

    async handleSubmit() {
        const { email } = this.state;

        if (!email) {
            this.setState({ error: 'Veuillez entrer votre email' });
            return;
        }

        this.setState({ isLoading: true, error: '' });

        try {
            // Simulation API call
            const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:4000/api';
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }

            this.setState({ isSuccess: true, resetLink: data.resetLink || '' });
            toast.success('Email envoyé ! Vérifiez votre boîte mail.');

        } catch (err) {
            // En mode démo, simuler le succès
            console.log('Mode démo: simulation envoi email');
            this.setState({
                isSuccess: true,
                resetLink: `/reset-password?token=demo-token-${Date.now()}`
            });
            toast.success('Email envoyé ! Vérifiez votre boîte mail.');
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { email, isLoading, isSuccess, error, resetLink } = this.state;

        if (isSuccess) {
            return `
                <div class="auth-page">
                    <div class="auth-container">
                        <div class="auth-success">
                            <div class="success-icon">✅</div>
                            <h2>Email envoyé !</h2>
                            <p>
                                Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.
                                Vérifiez votre boîte mail (et les spams).
                            </p>

                            ${resetLink ? `
                                <div class="dev-notice">
                                    <p><strong>Mode développement :</strong></p>
                                    <a href="${resetLink}" class="reset-link">${resetLink}</a>
                                </div>
                            ` : ''}

                            <button class="btn btn-primary btn-block" data-action="go-login">
                                Retour à la connexion
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="auth-page">
                <div class="auth-container">
                    <button class="back-link" data-action="go-login">
                        ← Retour
                    </button>

                    <div class="auth-header">
                        <div class="auth-icon">✉️</div>
                        <h2>Mot de passe oublié ?</h2>
                        <p>Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
                    </div>

                    <form class="auth-form" data-form="forgot-password">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control"
                                data-field="email"
                                value="${email}"
                                placeholder="votre@email.com"
                                required />
                        </div>

                        ${error ? `
                            <div class="alert alert-danger">${error}</div>
                        ` : ''}

                        <button type="submit" class="btn btn-primary btn-block" ${isLoading ? 'disabled' : ''}>
                            ${isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.querySelector('.auth-page');
        if (!container) return;

        // Form submission
        const form = container.querySelector('[data-form="forgot-password"]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            form.querySelectorAll('[data-field]').forEach(field => {
                field.addEventListener('input', (e) => {
                    this.setState({ [field.dataset.field]: e.target.value, error: '' });
                });
            });
        }

        // Back to login
        container.querySelectorAll('[data-action="go-login"]').forEach(btn => {
            btn.addEventListener('click', () => {
                router.navigate('/login');
            });
        });
    }
}
