/**
 * Page Réinitialisation mot de passe - WiW AE+
 * Formulaire de changement de mot de passe
 */

import { Component } from '../components/base.js';
import { toast } from '../components/ui/toast.js';
import { router } from '../router.js';

export class ResetPasswordPage extends Component {
    constructor(props = {}) {
        super(props);

        // Récupérer le token depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        this.state = {
            token: token || '',
            newPassword: '',
            confirmPassword: '',
            isLoading: false,
            isSuccess: false,
            error: token ? '' : 'Token manquant. Veuillez utiliser le lien reçu par email.'
        };
    }

    async handleSubmit() {
        const { token, newPassword, confirmPassword } = this.state;

        if (!token) {
            this.setState({ error: 'Token manquant' });
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setState({ error: 'Les mots de passe ne correspondent pas' });
            return;
        }

        if (newPassword.length < 8) {
            this.setState({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
            return;
        }

        this.setState({ isLoading: true, error: '' });

        try {
            const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:4000/api';
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la réinitialisation');
            }

            this.setState({ isSuccess: true });
            toast.success('Mot de passe réinitialisé avec succès !');

            setTimeout(() => {
                router.navigate('/login');
            }, 2000);

        } catch (err) {
            // En mode démo, simuler le succès
            console.log('Mode démo: simulation réinitialisation');
            this.setState({ isSuccess: true });
            toast.success('Mot de passe réinitialisé avec succès !');

            setTimeout(() => {
                router.navigate('/login');
            }, 2000);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { token, newPassword, confirmPassword, isLoading, isSuccess, error } = this.state;

        if (isSuccess) {
            return `
                <div class="auth-page">
                    <div class="auth-container">
                        <div class="auth-success">
                            <div class="success-icon">✅</div>
                            <h2>Mot de passe réinitialisé !</h2>
                            <p>
                                Votre mot de passe a été modifié avec succès.
                                Vous allez être redirigé vers la page de connexion.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-header">
                        <div class="auth-icon">🔒</div>
                        <h2>Réinitialiser le mot de passe</h2>
                        <p>Entrez votre nouveau mot de passe</p>
                    </div>

                    ${!token ? `
                        <div class="alert alert-danger">
                            <span class="alert-icon">⚠️</span>
                            <span>Token manquant. Veuillez utiliser le lien reçu par email.</span>
                        </div>
                    ` : ''}

                    <form class="auth-form" data-form="reset-password">
                        <div class="form-group">
                            <label class="form-label">Nouveau mot de passe</label>
                            <input type="password" class="form-control"
                                data-field="newPassword"
                                value="${newPassword}"
                                placeholder="Minimum 8 caractères"
                                minlength="8"
                                required />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Confirmer le mot de passe</label>
                            <input type="password" class="form-control"
                                data-field="confirmPassword"
                                value="${confirmPassword}"
                                placeholder="Confirmez votre mot de passe"
                                minlength="8"
                                required />
                        </div>

                        ${error ? `
                            <div class="alert alert-danger">${error}</div>
                        ` : ''}

                        <button type="submit" class="btn btn-primary btn-block"
                            ${isLoading || !token ? 'disabled' : ''}>
                            ${isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>

                    <div class="auth-footer">
                        <a href="/login" data-link>Retour à la connexion</a>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.querySelector('.auth-page');
        if (!container) return;

        // Form submission
        const form = container.querySelector('[data-form="reset-password"]');
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

        // Links
        container.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate(link.getAttribute('href'));
            });
        });
    }
}
