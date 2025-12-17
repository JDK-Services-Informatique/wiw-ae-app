/**
 * Page Contact - WiW AE+
 * Formulaire de contact et informations support
 */

import { Component } from '../components/base.js';
import { toast } from '../components/ui/toast.js';

export class ContactPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            formData: {
                nom: '',
                email: '',
                entreprise: '',
                telephone: '',
                sujet: 'question',
                message: ''
            },
            submitted: false
        };

        this.sujets = [
            { value: 'question', label: 'Question générale' },
            { value: 'demo', label: 'Demande de démo' },
            { value: 'technique', label: 'Support technique' },
            { value: 'commercial', label: 'Question commerciale' },
            { value: 'partenariat', label: 'Partenariat' },
            { value: 'autre', label: 'Autre' }
        ];
    }

    handleSubmit() {
        const { formData } = this.state;

        if (!formData.nom || !formData.email || !formData.message) {
            toast.warning('Veuillez remplir tous les champs obligatoires');
            return;
        }

        console.log('Contact form submitted:', formData);

        this.setState({ submitted: true });
        toast.success('Message envoyé ! Nous vous répondrons sous 24h');

        setTimeout(() => {
            this.setState({
                submitted: false,
                formData: {
                    nom: '',
                    email: '',
                    entreprise: '',
                    telephone: '',
                    sujet: 'question',
                    message: ''
                }
            });
        }, 3000);
    }

    render() {
        const { formData, submitted } = this.state;

        return `
            <div class="contact-page">
                <div class="page-header">
                    <h1 class="page-title">Contact & Support</h1>
                    <p class="page-subtitle">Une question ? Contactez notre équipe</p>
                </div>

                <!-- Contact Cards -->
                <div class="contact-cards">
                    <div class="card contact-card">
                        <div class="contact-icon">✉️</div>
                        <h3>Email</h3>
                        <p class="contact-value">support@wiw-app.com</p>
                        <p class="contact-note">Réponse sous 24h</p>
                    </div>

                    <div class="card contact-card">
                        <div class="contact-icon">📱</div>
                        <h3>Téléphone</h3>
                        <p class="contact-value">+33 1 23 45 67 89</p>
                        <p class="contact-note">Lun-Ven 9h-18h</p>
                    </div>

                    <div class="card contact-card">
                        <div class="contact-icon">📚</div>
                        <h3>Documentation</h3>
                        <p class="contact-value">Centre d'aide</p>
                        <button class="btn btn-sm btn-secondary" data-action="docs">Consulter</button>
                    </div>
                </div>

                <!-- Formulaire -->
                <div class="card">
                    <h3>Envoyez-nous un message</h3>

                    ${submitted ? `
                        <div class="success-message">
                            <div class="success-icon">✅</div>
                            <h3>Message envoyé !</h3>
                            <p>Nous vous répondrons dans les plus brefs délais.</p>
                        </div>
                    ` : `
                        <form data-form="contact">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Nom complet *</label>
                                    <input type="text" class="form-control"
                                        data-field="nom"
                                        value="${formData.nom}"
                                        placeholder="Jean Dupont" required />
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control"
                                        data-field="email"
                                        value="${formData.email}"
                                        placeholder="jean.dupont@exemple.fr" required />
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Entreprise</label>
                                    <input type="text" class="form-control"
                                        data-field="entreprise"
                                        value="${formData.entreprise}"
                                        placeholder="Cabinet Architecture" />
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Téléphone</label>
                                    <input type="tel" class="form-control"
                                        data-field="telephone"
                                        value="${formData.telephone}"
                                        placeholder="06 12 34 56 78" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Sujet</label>
                                <select class="form-control" data-field="sujet">
                                    ${this.sujets.map(s => `
                                        <option value="${s.value}" ${formData.sujet === s.value ? 'selected' : ''}>
                                            ${s.label}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Message *</label>
                                <textarea class="form-control" rows="6"
                                    data-field="message"
                                    placeholder="Décrivez votre besoin ou votre question..."
                                    required>${formData.message}</textarea>
                            </div>

                            <button type="submit" class="btn btn-primary">Envoyer le message</button>
                        </form>
                    `}
                </div>

                <!-- FAQ -->
                <div class="card faq-section">
                    <h3>Questions fréquentes</h3>

                    <details class="faq-item">
                        <summary>Comment démarrer avec WIW ?</summary>
                        <p>Créez votre compte, choisissez votre plan (essai gratuit 14 jours), puis accédez au tableau de bord. Notre équipe peut vous accompagner pour une démo personnalisée.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Puis-je changer de plan à tout moment ?</summary>
                        <p>Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements sont effectifs immédiatement.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Mes données sont-elles sécurisées ?</summary>
                        <p>Absolument. Nous utilisons un chiffrement de niveau bancaire (SSL/TLS), des sauvegardes quotidiennes et nos serveurs sont hébergés en France (conformité RGPD).</p>
                    </details>

                    <details class="faq-item">
                        <summary>Proposez-vous une formation ?</summary>
                        <p>Oui, nous proposons des webinaires gratuits chaque semaine et des formations personnalisées pour les plans PREMIUM et ENTERPRISE.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Quels sont les moyens de paiement acceptés ?</summary>
                        <p>Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), les virements bancaires et les prélèvements SEPA pour les abonnements annuels.</p>
                    </details>
                </div>

                <!-- Horaires -->
                <div class="card support-hours">
                    <h3>🕐 Horaires du support</h3>
                    <div class="hours-grid">
                        <div>
                            <strong>Lundi - Vendredi</strong>
                            <p>9h00 - 18h00</p>
                        </div>
                        <div>
                            <strong>Samedi</strong>
                            <p>10h00 - 16h00</p>
                        </div>
                        <div>
                            <strong>Dimanche</strong>
                            <p>Fermé</p>
                        </div>
                        <div>
                            <strong>Jours fériés</strong>
                            <p>Fermé</p>
                        </div>
                    </div>
                    <p class="text-secondary text-sm">💡 Pour les urgences (plan ENTERPRISE), contactez le +33 6 00 00 00 00 (24/7)</p>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.querySelector('.contact-page');
        if (!container) return;

        // Form submission
        const form = container.querySelector('[data-form="contact"]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            form.querySelectorAll('[data-field]').forEach(field => {
                field.addEventListener('input', (e) => {
                    this.state.formData[field.dataset.field] = e.target.value;
                });
            });
        }

        // Docs button
        container.querySelectorAll('[data-action="docs"]').forEach(btn => {
            btn.addEventListener('click', () => {
                toast.info('Documentation en cours de développement');
            });
        });
    }
}
