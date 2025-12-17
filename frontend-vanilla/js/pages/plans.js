/**
 * Plans & Tarifs - WiW AE+
 * Page de gestion des abonnements
 */

import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';

export class PlansPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            currentPlan: storage.get('wiw-plan') || 'STARTER',
            showPaymentModal: false,
            showDevisModal: false,
            selectedPlan: null,
            paymentForm: this.getDefaultPaymentForm(),
            devisForm: this.getDefaultDevisForm()
        };

        this.plans = [
            {
                nom: 'STARTER',
                prix: '29€',
                periode: '/mois',
                description: 'Pour démarrer votre activité',
                features: [
                    '5 projets actifs',
                    '2 utilisateurs',
                    'Gestion des AO',
                    'Suivi des honoraires',
                    'Support email'
                ],
                color: 'var(--info)'
            },
            {
                nom: 'PREMIUM',
                prix: '79€',
                periode: '/mois',
                description: 'Le plus populaire',
                features: [
                    'Projets illimités',
                    '10 utilisateurs',
                    'Analytics avancés',
                    'Export PDF/Excel',
                    'API REST',
                    'Support prioritaire'
                ],
                color: 'var(--primary)',
                badge: 'Populaire'
            },
            {
                nom: 'ENTERPRISE',
                prix: '199€',
                periode: '/mois',
                description: 'Pour les grandes agences',
                features: [
                    'Tout illimité',
                    'SSO / SAML',
                    'API dédiée',
                    'SLA 99.9%',
                    'Formation équipe',
                    'Chargé de compte dédié'
                ],
                color: 'var(--warning)'
            }
        ];
    }

    getDefaultPaymentForm() {
        return {
            cardNumber: '',
            cardName: '',
            expiryDate: '',
            cvv: '',
            billingAddress: '',
            city: '',
            postalCode: '',
            country: 'France'
        };
    }

    getDefaultDevisForm() {
        return {
            entreprise: '',
            nom: '',
            email: '',
            telephone: '',
            nombreUtilisateurs: '',
            besoinsSpecifiques: '',
            budget: ''
        };
    }

    handleChoosePlan(planName) {
        if (this.state.currentPlan === planName) return;

        if (planName === 'ENTERPRISE') {
            this.setState({ showDevisModal: true });
            return;
        }

        this.setState({
            selectedPlan: planName,
            showPaymentModal: true
        });
    }

    handlePaymentSubmit() {
        const { paymentForm, selectedPlan } = this.state;

        if (!paymentForm.cardNumber || !paymentForm.cardName || !paymentForm.expiryDate || !paymentForm.cvv) {
            toast.warning('Veuillez remplir toutes les informations de paiement');
            return;
        }

        const cardNumberClean = paymentForm.cardNumber.replace(/\s/g, '');
        if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
            toast.warning('Numéro de carte invalide (16 chiffres requis)');
            return;
        }

        toast.info('Traitement du paiement en cours...');

        setTimeout(() => {
            storage.set('wiw-plan', selectedPlan);
            this.setState({
                currentPlan: selectedPlan,
                showPaymentModal: false,
                selectedPlan: null,
                paymentForm: this.getDefaultPaymentForm()
            });
            toast.success(`Plan ${selectedPlan} activé avec succès !`);
        }, 1500);
    }

    handleDevisSubmit() {
        const { devisForm } = this.state;

        if (!devisForm.entreprise || !devisForm.nom || !devisForm.email || !devisForm.telephone) {
            toast.warning('Veuillez remplir tous les champs obligatoires');
            return;
        }

        console.log('Demande de devis ENTERPRISE:', devisForm);
        toast.success('Demande de devis envoyée ! Notre équipe vous contactera sous 24h.');

        this.setState({
            showDevisModal: false,
            devisForm: this.getDefaultDevisForm()
        });
    }

    formatCardNumber(value) {
        const cleaned = value.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 19);
    }

    formatExpiryDate(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    }

    render() {
        const { currentPlan, showPaymentModal, showDevisModal, selectedPlan } = this.state;

        return `
            <div class="plans-page">
                <div class="page-header">
                    <h1 class="page-title">Plans & Tarifs</h1>
                    <p class="page-subtitle">Choisissez l'offre qui correspond à vos besoins</p>
                </div>

                <div class="alert alert-info">
                    Votre plan actuel : <strong>${currentPlan}</strong>
                </div>

                <!-- Plans Grid -->
                <div class="plans-grid">
                    ${this.plans.map(plan => this.renderPlanCard(plan)).join('')}
                </div>

                <!-- FAQ -->
                <div class="card faq-section">
                    <h3>Questions fréquentes</h3>

                    <details class="faq-item">
                        <summary>Puis-je changer de plan à tout moment ?</summary>
                        <p>Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Y a-t-il une période d'engagement ?</summary>
                        <p>Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Proposez-vous une période d'essai gratuite ?</summary>
                        <p>Oui, nous offrons 14 jours d'essai gratuit sur tous les plans, sans carte bancaire requise.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Comment se passe la facturation ?</summary>
                        <p>La facturation est mensuelle et automatique. Vous recevez une facture par email à chaque paiement.</p>
                    </details>

                    <details class="faq-item">
                        <summary>Comment fonctionne le plan ENTERPRISE ?</summary>
                        <p>Le plan ENTERPRISE est entièrement personnalisé selon vos besoins. Après avoir demandé un devis, notre équipe vous contacte sous 24h pour une offre sur mesure.</p>
                    </details>
                </div>

                <!-- Modals -->
                ${showPaymentModal ? this.renderPaymentModal() : ''}
                ${showDevisModal ? this.renderDevisModal() : ''}
            </div>
        `;
    }

    renderPlanCard(plan) {
        const { currentPlan } = this.state;
        const isCurrentPlan = currentPlan === plan.nom;

        return `
            <div class="plan-card ${isCurrentPlan ? 'current' : ''}" style="--plan-color: ${plan.color}">
                ${plan.badge ? `<span class="plan-badge">${plan.badge}</span>` : ''}

                <div class="plan-header">
                    <h3 class="plan-name" style="color: ${plan.color}">${plan.nom}</h3>
                    <p class="plan-description">${plan.description}</p>
                    <div class="plan-price">${plan.prix}</div>
                    <div class="plan-period">${plan.periode}</div>
                </div>

                <div class="divider"></div>

                <ul class="plan-features">
                    ${plan.features.map(feature => `
                        <li class="plan-feature"><span class="feature-check">✓</span> ${feature}</li>
                    `).join('')}
                </ul>

                <button
                    class="btn ${isCurrentPlan ? 'btn-success' : plan.nom === 'ENTERPRISE' ? 'btn-warning' : 'btn-primary'} btn-block"
                    ${isCurrentPlan ? 'disabled' : ''}
                    data-action="choose-plan"
                    data-plan="${plan.nom}"
                >
                    ${isCurrentPlan
                        ? '✓ Plan actuel'
                        : plan.nom === 'ENTERPRISE'
                            ? 'Demander un devis'
                            : 'Choisir ce plan'
                    }
                </button>
            </div>
        `;
    }

    renderPaymentModal() {
        const { paymentForm, selectedPlan } = this.state;
        const plan = this.plans.find(p => p.nom === selectedPlan);

        return `
            <div class="modal-overlay" data-action="close-payment">
                <div class="modal-content modal-lg" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <div>
                            <h2>Paiement sécurisé</h2>
                            <p class="text-secondary">Activation du plan <strong>${selectedPlan}</strong> - ${plan?.prix}/mois</p>
                        </div>
                        <button class="btn btn-icon" data-action="close-payment">×</button>
                    </div>

                    <form data-form="payment">
                        <!-- Récapitulatif -->
                        <div class="payment-summary">
                            <div class="summary-row">
                                <span class="fw-bold">Plan ${selectedPlan}</span>
                                <span class="summary-price">${plan?.prix}/mois</span>
                            </div>
                            <p class="text-secondary text-sm">Facturation mensuelle - Annulation à tout moment - 14 jours d'essai gratuit</p>
                        </div>

                        <div class="form-grid">
                            <div class="form-group form-group-full">
                                <label class="form-label">Numéro de carte *</label>
                                <input type="text" class="form-control font-mono"
                                    data-field="cardNumber"
                                    value="${paymentForm.cardNumber}"
                                    placeholder="1234 5678 9012 3456"
                                    maxlength="19" required />
                                <div class="text-secondary text-sm">Visa - Mastercard - Amex</div>
                            </div>

                            <div class="form-group form-group-full">
                                <label class="form-label">Nom sur la carte *</label>
                                <input type="text" class="form-control text-uppercase"
                                    data-field="cardName"
                                    value="${paymentForm.cardName}"
                                    placeholder="JEAN DUPONT" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Date d'expiration *</label>
                                <input type="text" class="form-control font-mono"
                                    data-field="expiryDate"
                                    value="${paymentForm.expiryDate}"
                                    placeholder="MM/AA"
                                    maxlength="5" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">CVV *</label>
                                <input type="text" class="form-control font-mono"
                                    data-field="cvv"
                                    value="${paymentForm.cvv}"
                                    placeholder="123"
                                    maxlength="3" required />
                            </div>
                        </div>

                        <div class="divider"></div>

                        <h4 class="form-section-title">Adresse de facturation</h4>

                        <div class="form-grid">
                            <div class="form-group form-group-full">
                                <label class="form-label">Adresse</label>
                                <input type="text" class="form-control"
                                    data-field="billingAddress"
                                    value="${paymentForm.billingAddress}"
                                    placeholder="15 rue de la République" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Ville</label>
                                <input type="text" class="form-control"
                                    data-field="city"
                                    value="${paymentForm.city}"
                                    placeholder="Paris" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Code postal</label>
                                <input type="text" class="form-control"
                                    data-field="postalCode"
                                    value="${paymentForm.postalCode}"
                                    placeholder="75001" />
                            </div>

                            <div class="form-group form-group-full">
                                <label class="form-label">Pays</label>
                                <select class="form-control" data-field="country">
                                    <option value="France" ${paymentForm.country === 'France' ? 'selected' : ''}>France</option>
                                    <option value="Belgique" ${paymentForm.country === 'Belgique' ? 'selected' : ''}>Belgique</option>
                                    <option value="Suisse" ${paymentForm.country === 'Suisse' ? 'selected' : ''}>Suisse</option>
                                    <option value="Luxembourg" ${paymentForm.country === 'Luxembourg' ? 'selected' : ''}>Luxembourg</option>
                                    <option value="Canada" ${paymentForm.country === 'Canada' ? 'selected' : ''}>Canada</option>
                                </select>
                            </div>
                        </div>

                        <!-- Sécurité -->
                        <div class="security-notice">
                            <span class="security-icon">🔒</span>
                            <div>
                                <strong>Paiement 100% sécurisé</strong><br />
                                <span class="text-secondary">Vos informations sont cryptées et protégées par SSL</span>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success">Valider le paiement</button>
                            <button type="button" class="btn btn-secondary" data-action="close-payment">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    renderDevisModal() {
        const { devisForm } = this.state;

        return `
            <div class="modal-overlay" data-action="close-devis">
                <div class="modal-content modal-lg" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <div>
                            <h2>Demande de devis ENTERPRISE</h2>
                            <p class="text-secondary">Notre équipe vous contactera sous 24h pour une offre sur mesure</p>
                        </div>
                        <button class="btn btn-icon" data-action="close-devis">×</button>
                    </div>

                    <form data-form="devis">
                        <div class="form-grid">
                            <div class="form-group form-group-full">
                                <label class="form-label">Nom de l'entreprise *</label>
                                <input type="text" class="form-control"
                                    data-field="entreprise"
                                    value="${devisForm.entreprise}"
                                    placeholder="Ex: Cabinet d'Architecture DUPONT" required />
                            </div>

                            <div class="form-group form-group-full">
                                <label class="form-label">Nom du contact *</label>
                                <input type="text" class="form-control"
                                    data-field="nom"
                                    value="${devisForm.nom}"
                                    placeholder="Ex: Jean Dupont" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email professionnel *</label>
                                <input type="email" class="form-control"
                                    data-field="email"
                                    value="${devisForm.email}"
                                    placeholder="contact@entreprise.fr" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Téléphone *</label>
                                <input type="tel" class="form-control"
                                    data-field="telephone"
                                    value="${devisForm.telephone}"
                                    placeholder="01 23 45 67 89" required />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Nombre d'utilisateurs</label>
                                <input type="number" class="form-control"
                                    data-field="nombreUtilisateurs"
                                    value="${devisForm.nombreUtilisateurs}"
                                    placeholder="Ex: 20" min="1" />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Budget mensuel estimé</label>
                                <input type="text" class="form-control"
                                    data-field="budget"
                                    value="${devisForm.budget}"
                                    placeholder="Ex: 500-1000€" />
                            </div>

                            <div class="form-group form-group-full">
                                <label class="form-label">Besoins spécifiques</label>
                                <textarea class="form-control" rows="4"
                                    data-field="besoinsSpecifiques"
                                    placeholder="Décrivez vos besoins particuliers, intégrations souhaitées, volume de projets...">${devisForm.besoinsSpecifiques}</textarea>
                            </div>
                        </div>

                        <!-- Info box -->
                        <div class="info-box info-box-warning">
                            <span class="info-icon">💡</span>
                            <div>
                                <strong>Ce que vous obtiendrez :</strong>
                                <ul>
                                    <li>Devis personnalisé sous 24h</li>
                                    <li>Présentation en visio avec un expert</li>
                                    <li>Configuration sur mesure</li>
                                    <li>Chargé de compte dédié</li>
                                    <li>Formation de votre équipe incluse</li>
                                </ul>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="submit" class="btn btn-warning">Envoyer la demande</button>
                            <button type="button" class="btn btn-secondary" data-action="close-devis">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.querySelector('.plans-page');
        if (!container) return;

        // Choose plan
        container.querySelectorAll('[data-action="choose-plan"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleChoosePlan(btn.dataset.plan);
            });
        });

        // Close payment modal
        container.querySelectorAll('[data-action="close-payment"]').forEach(el => {
            el.addEventListener('click', () => {
                this.setState({ showPaymentModal: false, selectedPlan: null });
            });
        });

        // Close devis modal
        container.querySelectorAll('[data-action="close-devis"]').forEach(el => {
            el.addEventListener('click', () => {
                this.setState({ showDevisModal: false });
            });
        });

        // Payment form
        const paymentForm = container.querySelector('[data-form="payment"]');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePaymentSubmit();
            });

            paymentForm.querySelectorAll('[data-field]').forEach(field => {
                field.addEventListener('input', (e) => {
                    let value = e.target.value;
                    const fieldName = field.dataset.field;

                    if (fieldName === 'cardNumber') {
                        value = this.formatCardNumber(value);
                        e.target.value = value;
                    } else if (fieldName === 'expiryDate') {
                        value = this.formatExpiryDate(value);
                        e.target.value = value;
                    } else if (fieldName === 'cvv') {
                        value = value.replace(/\D/g, '').slice(0, 3);
                        e.target.value = value;
                    } else if (fieldName === 'cardName') {
                        value = value.toUpperCase();
                        e.target.value = value;
                    }

                    this.state.paymentForm[fieldName] = value;
                });
            });
        }

        // Devis form
        const devisForm = container.querySelector('[data-form="devis"]');
        if (devisForm) {
            devisForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDevisSubmit();
            });

            devisForm.querySelectorAll('[data-field]').forEach(field => {
                field.addEventListener('input', (e) => {
                    this.state.devisForm[field.dataset.field] = e.target.value;
                });
            });
        }
    }
}
