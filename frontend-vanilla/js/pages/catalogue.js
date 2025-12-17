/**
 * Catalogue d'Articles - WiW AE+
 * Gestion du catalogue d'articles pour les devis
 */

import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { confirm } from '../components/ui/modal.js';
import { router } from '../router.js';

export class CataloguePage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            showForm: false,
            editingId: null,
            searchQuery: '',
            filterCategorie: 'all',
            articles: storage.get('wiw-articles') || [],
            formData: this.getDefaultFormData(),
            showPhotoModal: null
        };

        this.categories = [
            'plomberie', 'electricite', 'menuiserie', 'peinture',
            'carrelage', 'chauffage', 'maconnerie', 'couverture', 'autre'
        ];

        this.unites = ['U', 'ml', 'm²', 'm³', 'kg', 'heure', 'forfait', 'lot'];
    }

    getDefaultFormData() {
        return {
            reference: '',
            designation: '',
            description: '',
            categorie: 'plomberie',
            unite: 'U',
            puHT: 0,
            tva: 20,
            photos: [],
            vignette: '',
            actif: true,
            fournisseur: '',
            delai: ''
        };
    }

    getFilteredArticles() {
        return this.state.articles.filter(article => {
            const matchSearch =
                article.designation.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
                article.reference.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
                (article.description && article.description.toLowerCase().includes(this.state.searchQuery.toLowerCase()));

            const matchCategorie =
                this.state.filterCategorie === 'all' || article.categorie === this.state.filterCategorie;

            return matchSearch && matchCategorie;
        });
    }

    getStats() {
        const articles = this.state.articles;
        return {
            total: articles.length,
            actifs: articles.filter(a => a.actif).length,
            valeurTotale: articles.reduce((sum, a) => sum + (a.actif ? a.puHT : 0), 0)
        };
    }

    formatMontant(value, decimals = 2) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    handleSubmit() {
        const { formData, editingId, articles } = this.state;

        if (!formData.reference || !formData.designation) {
            toast.warning('Veuillez remplir la référence et la désignation');
            return;
        }

        let newArticles;
        if (editingId) {
            newArticles = articles.map(a =>
                a.id === editingId ? { ...formData, id: editingId } : a
            );
            toast.success('Article modifié');
        } else {
            const nouvelArticle = {
                ...formData,
                id: Date.now(),
                dateCreation: new Date().toISOString()
            };
            newArticles = [...articles, nouvelArticle];
            toast.success('Article ajouté au catalogue');
        }

        storage.set('wiw-articles', newArticles);
        this.setState({
            articles: newArticles,
            showForm: false,
            editingId: null,
            formData: this.getDefaultFormData()
        });
    }

    handleEdit(article) {
        this.setState({
            formData: { ...article },
            editingId: article.id,
            showForm: true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async handleDelete(id) {
        const confirmed = await confirm('Supprimer cet article du catalogue ?');
        if (confirmed) {
            const newArticles = this.state.articles.filter(a => a.id !== id);
            storage.set('wiw-articles', newArticles);
            this.setState({ articles: newArticles });
            toast.info('Article supprimé');
        }
    }

    handleDuplicate(article) {
        const copie = {
            ...article,
            id: Date.now(),
            reference: article.reference + '-COPIE',
            designation: article.designation + ' (Copie)',
            dateCreation: new Date().toISOString()
        };
        const newArticles = [...this.state.articles, copie];
        storage.set('wiw-articles', newArticles);
        this.setState({ articles: newArticles });
        toast.success('Article dupliqué');
    }

    handleToggleActif(id) {
        const newArticles = this.state.articles.map(a =>
            a.id === id ? { ...a, actif: !a.actif } : a
        );
        storage.set('wiw-articles', newArticles);
        this.setState({ articles: newArticles });
    }

    handleUtiliserDansDevis(article) {
        storage.set('wiw-devis-article', article);
        router.navigate('/devis');
        toast.info('Article ajouté au devis en cours');
    }

    handleImageUpload(e, isVignette = false) {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                const { formData } = this.state;

                if (isVignette) {
                    this.setState({ formData: { ...formData, vignette: dataUrl } });
                } else {
                    this.setState({
                        formData: { ...formData, photos: [...formData.photos, dataUrl] }
                    });
                }
            };
            reader.readAsDataURL(file);
        });
    }

    handleRemovePhoto(index) {
        const { formData } = this.state;
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        this.setState({ formData: { ...formData, photos: newPhotos } });
    }

    render() {
        const { showForm, editingId, searchQuery, filterCategorie, formData, showPhotoModal } = this.state;
        const stats = this.getStats();
        const articlesFiltrés = this.getFilteredArticles();

        return `
            <div class="catalogue-page">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">Catalogue d'Articles</h1>
                        <p class="page-subtitle">
                            ${stats.total} articles - ${stats.actifs} actifs - ${this.formatMontant(stats.valeurTotale)} HT valeur catalogue
                        </p>
                    </div>
                    <button class="btn ${showForm ? 'btn-secondary' : 'btn-success'}" data-action="toggle-form">
                        ${showForm ? 'Annuler' : '+ Nouvel article'}
                    </button>
                </div>

                <!-- Formulaire -->
                ${showForm ? this.renderForm() : ''}

                <!-- Filtres & Recherche -->
                <div class="filters-bar">
                    <input
                        type="text"
                        class="form-control search-input"
                        placeholder="Rechercher (référence, désignation, description...)"
                        value="${searchQuery}"
                        data-field="searchQuery"
                    />
                    <select class="form-control filter-select" data-field="filterCategorie">
                        <option value="all" ${filterCategorie === 'all' ? 'selected' : ''}>Toutes catégories</option>
                        ${this.categories.map(cat => `
                            <option value="${cat}" ${filterCategorie === cat ? 'selected' : ''}>
                                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <!-- Liste des articles -->
                ${articlesFiltrés.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3>${stats.total === 0 ? 'Aucun article dans le catalogue' : 'Aucun résultat'}</h3>
                        <p>${stats.total === 0
                            ? 'Cliquez sur "Nouvel article" pour commencer'
                            : 'Essayez d\'autres critères de recherche'
                        }</p>
                    </div>
                ` : `
                    <div class="articles-grid">
                        ${articlesFiltrés.map(article => this.renderArticleCard(article)).join('')}
                    </div>
                `}

                <!-- Modal Photos -->
                ${showPhotoModal ? this.renderPhotoModal(showPhotoModal) : ''}
            </div>
        `;
    }

    renderForm() {
        const { formData, editingId } = this.state;
        const prixTTC = formData.puHT * (1 + formData.tva / 100);

        return `
            <form class="card article-form" data-form="article">
                <h2 class="form-title">${editingId ? 'Modifier l\'article' : 'Nouvel article'}</h2>

                <!-- Ligne 1 : Références -->
                <div class="form-grid-3">
                    <div class="form-group">
                        <label class="form-label">Référence *</label>
                        <input type="text" class="form-control" data-field="reference"
                            value="${formData.reference}" placeholder="Ex: PLB-001" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Catégorie *</label>
                        <select class="form-control" data-field="categorie">
                            ${this.categories.map(cat => `
                                <option value="${cat}" ${formData.categorie === cat ? 'selected' : ''}>
                                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Unité *</label>
                        <select class="form-control" data-field="unite">
                            ${this.unites.map(u => `
                                <option value="${u}" ${formData.unite === u ? 'selected' : ''}>${u}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- Désignation -->
                <div class="form-group">
                    <label class="form-label">Désignation *</label>
                    <input type="text" class="form-control" data-field="designation"
                        value="${formData.designation}" placeholder="Ex: Baignoire acrylique 170x70 cm" required />
                </div>

                <!-- Description -->
                <div class="form-group">
                    <label class="form-label">Description détaillée</label>
                    <textarea class="form-control" data-field="description" rows="3"
                        placeholder="Description technique, caractéristiques...">${formData.description}</textarea>
                </div>

                <!-- Prix -->
                <div class="form-grid-3">
                    <div class="form-group">
                        <label class="form-label">Prix unitaire HT (€) *</label>
                        <input type="number" step="0.01" min="0" class="form-control"
                            data-field="puHT" value="${formData.puHT}" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">TVA (%)</label>
                        <select class="form-control" data-field="tva">
                            <option value="0" ${formData.tva === 0 ? 'selected' : ''}>0%</option>
                            <option value="5.5" ${formData.tva === 5.5 ? 'selected' : ''}>5.5%</option>
                            <option value="10" ${formData.tva === 10 ? 'selected' : ''}>10%</option>
                            <option value="20" ${formData.tva === 20 ? 'selected' : ''}>20%</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prix TTC (€)</label>
                        <input type="text" class="form-control" disabled value="${prixTTC.toFixed(2)}" />
                    </div>
                </div>

                <!-- Infos complémentaires -->
                <div class="form-grid-3">
                    <div class="form-group">
                        <label class="form-label">Fournisseur</label>
                        <input type="text" class="form-control" data-field="fournisseur"
                            value="${formData.fournisseur}" placeholder="Ex: Leroy Merlin" />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Délai de livraison</label>
                        <input type="text" class="form-control" data-field="delai"
                            value="${formData.delai}" placeholder="Ex: 48h, 1 semaine" />
                    </div>
                    <div class="form-group" style="display: flex; align-items: flex-end;">
                        <label class="checkbox-label">
                            <input type="checkbox" data-field="actif" ${formData.actif ? 'checked' : ''} />
                            <span>Article actif</span>
                        </label>
                    </div>
                </div>

                <!-- Images -->
                <div class="form-section">
                    <h3 class="form-section-title">Photos & Vignette</h3>

                    <div class="form-group">
                        <label class="form-label">Vignette principale</label>
                        <input type="file" accept="image/*" data-upload="vignette" />
                        ${formData.vignette ? `
                            <div class="image-preview">
                                <img src="${formData.vignette}" alt="Vignette" class="vignette-img" />
                                <button type="button" class="btn-remove" data-action="remove-vignette">×</button>
                            </div>
                        ` : ''}
                    </div>

                    <div class="form-group">
                        <label class="form-label">Photos supplémentaires</label>
                        <input type="file" accept="image/*" multiple data-upload="photos" />
                        ${formData.photos.length > 0 ? `
                            <div class="photos-preview">
                                ${formData.photos.map((photo, index) => `
                                    <div class="photo-item">
                                        <img src="${photo}" alt="Photo ${index + 1}" />
                                        <button type="button" class="btn-remove" data-action="remove-photo" data-index="${index}">×</button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Boutons -->
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" data-action="cancel-form">Annuler</button>
                    <button type="submit" class="btn btn-success">
                        ${editingId ? 'Enregistrer' : 'Ajouter au catalogue'}
                    </button>
                </div>
            </form>
        `;
    }

    renderArticleCard(article) {
        const prixTTC = article.puHT * (1 + article.tva / 100);

        return `
            <div class="article-card ${!article.actif ? 'inactive' : ''}" data-id="${article.id}">
                ${!article.actif ? '<span class="badge badge-danger article-badge">INACTIF</span>' : ''}

                <!-- Image -->
                <div class="article-image" ${article.photos?.length > 0 ? `data-action="show-photos" data-id="${article.id}"` : ''}>
                    ${article.vignette
                        ? `<img src="${article.vignette}" alt="${article.designation}" />`
                        : '<div class="article-placeholder">📦</div>'
                    }
                    ${article.photos?.length > 0 ? `
                        <span class="photos-count">${article.photos.length} photo${article.photos.length > 1 ? 's' : ''}</span>
                    ` : ''}
                </div>

                <!-- Contenu -->
                <div class="article-content">
                    <div class="article-meta">${article.reference} - ${article.categorie}</div>
                    <h3 class="article-title">${article.designation}</h3>
                    ${article.description ? `<p class="article-description">${article.description}</p>` : ''}

                    <div class="article-price-box">
                        <div class="price-row">
                            <span>Prix unitaire HT :</span>
                            <span class="price">${this.formatMontant(article.puHT)}</span>
                        </div>
                        <div class="price-row price-ttc">
                            <span>Prix TTC (TVA ${article.tva}%) :</span>
                            <span class="price-main">${this.formatMontant(prixTTC)}</span>
                        </div>
                        <div class="price-unit">/ ${article.unite}</div>
                    </div>

                    ${article.fournisseur || article.delai ? `
                        <div class="article-info">
                            ${article.fournisseur ? `<div>🏪 ${article.fournisseur}</div>` : ''}
                            ${article.delai ? `<div>⏱️ Délai: ${article.delai}</div>` : ''}
                        </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="article-actions">
                        <button class="btn btn-sm btn-primary" data-action="edit" data-id="${article.id}">Modifier</button>
                        <button class="btn btn-sm ${article.actif ? 'btn-warning' : 'btn-success'}"
                            data-action="toggle-actif" data-id="${article.id}">
                            ${article.actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <button class="btn btn-sm btn-secondary" data-action="duplicate" data-id="${article.id}">Dupliquer</button>
                        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${article.id}">Supprimer</button>
                    </div>

                    <button class="btn btn-block btn-gradient" data-action="use-in-devis" data-id="${article.id}">
                        Utiliser dans un devis
                    </button>
                </div>
            </div>
        `;
    }

    renderPhotoModal(article) {
        return `
            <div class="modal-overlay" data-action="close-photos">
                <div class="photos-modal" onclick="event.stopPropagation()">
                    <div class="photos-gallery">
                        ${article.photos.map((photo, index) => `
                            <img src="${photo}" alt="Photo ${index + 1}" class="gallery-photo" />
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const container = document.querySelector('.catalogue-page');
        if (!container) return;

        // Toggle formulaire
        container.querySelectorAll('[data-action="toggle-form"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setState({
                    showForm: !this.state.showForm,
                    editingId: null,
                    formData: this.getDefaultFormData()
                });
            });
        });

        // Cancel form
        container.querySelectorAll('[data-action="cancel-form"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setState({
                    showForm: false,
                    editingId: null,
                    formData: this.getDefaultFormData()
                });
            });
        });

        // Recherche
        container.querySelectorAll('[data-field="searchQuery"]').forEach(input => {
            input.addEventListener('input', (e) => {
                this.setState({ searchQuery: e.target.value });
            });
        });

        // Filtre catégorie
        container.querySelectorAll('[data-field="filterCategorie"]').forEach(select => {
            select.addEventListener('change', (e) => {
                this.setState({ filterCategorie: e.target.value });
            });
        });

        // Formulaire soumission
        const form = container.querySelector('[data-form="article"]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Champs du formulaire
            form.querySelectorAll('[data-field]').forEach(field => {
                const fieldName = field.dataset.field;
                field.addEventListener('change', (e) => {
                    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                    if (fieldName === 'puHT' || fieldName === 'tva') {
                        value = parseFloat(value) || 0;
                    }
                    this.setState({
                        formData: { ...this.state.formData, [fieldName]: value }
                    });
                });
            });

            // Upload vignette
            form.querySelectorAll('[data-upload="vignette"]').forEach(input => {
                input.addEventListener('change', (e) => this.handleImageUpload(e, true));
            });

            // Upload photos
            form.querySelectorAll('[data-upload="photos"]').forEach(input => {
                input.addEventListener('change', (e) => this.handleImageUpload(e, false));
            });

            // Remove vignette
            form.querySelectorAll('[data-action="remove-vignette"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setState({ formData: { ...this.state.formData, vignette: '' } });
                });
            });

            // Remove photo
            form.querySelectorAll('[data-action="remove-photo"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    this.handleRemovePhoto(index);
                });
            });
        }

        // Actions sur les articles
        container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const article = this.state.articles.find(a => a.id === parseInt(btn.dataset.id));
                if (article) this.handleEdit(article);
            });
        });

        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleDelete(parseInt(btn.dataset.id));
            });
        });

        container.querySelectorAll('[data-action="duplicate"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const article = this.state.articles.find(a => a.id === parseInt(btn.dataset.id));
                if (article) this.handleDuplicate(article);
            });
        });

        container.querySelectorAll('[data-action="toggle-actif"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleToggleActif(parseInt(btn.dataset.id));
            });
        });

        container.querySelectorAll('[data-action="use-in-devis"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const article = this.state.articles.find(a => a.id === parseInt(btn.dataset.id));
                if (article) this.handleUtiliserDansDevis(article);
            });
        });

        // Photos modal
        container.querySelectorAll('[data-action="show-photos"]').forEach(el => {
            el.addEventListener('click', () => {
                const article = this.state.articles.find(a => a.id === parseInt(el.dataset.id));
                if (article && article.photos?.length > 0) {
                    this.setState({ showPhotoModal: article });
                }
            });
        });

        container.querySelectorAll('[data-action="close-photos"]').forEach(el => {
            el.addEventListener('click', () => {
                this.setState({ showPhotoModal: null });
            });
        });
    }
}
