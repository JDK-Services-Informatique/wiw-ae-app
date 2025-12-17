// MediaLibrary Page - Médiathèque globale
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class MediaLibraryPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            viewMode: 'grille', // 'grille' ou 'liste'
            filterType: 'tous', // 'tous', 'images', 'videos', 'documents'
            selectedTags: [],
            searchQuery: '',
            selectedMedia: null,
            filterDomaine: 'tous',
            filterTypeArchi: 'tous',
            filterReference: 'tous',
            mediaLibrary: storage.get('wiw-media-library') || this.getDefaultMedia()
        };
        this.allTags = [
            'Résidentiel', 'Commercial', 'Public', 'Enseignement',
            'Façade', 'Intérieur', 'Plans', 'Maquette', '3D', 'BIM',
            'Chantier', 'Rénovation', 'Neuf', 'Urbanisme',
            'Vidéo', 'Visite virtuelle', 'VR', 'Lyon', 'Paris', 'Design', 'Restaurant'
        ];
    }

    getDefaultMedia() {
        return [
            {
                id: 1,
                nom: 'Facade_Residence_Oliviers.jpg',
                type: 'image',
                taille: '3.2 MB',
                date: '2024-11-20',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzM0OThkYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RmHDp2FkZSBSw6lzaWRlbmNlPC90ZXh0Pjwvc3ZnPg==',
                tags: ['Résidentiel', 'Façade', 'Rénovation', 'Lyon'],
                utiliseDans: ['Références', 'AO #1'],
                dimensions: '4000x3000px',
                description: 'Façade principale de la résidence Les Oliviers après rénovation'
            },
            {
                id: 2,
                nom: 'Plan_Masse_Campus.pdf',
                type: 'document',
                taille: '1.8 MB',
                date: '2024-11-15',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VjZjBmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNlNzRjM2MiPvCfk4Q8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzM0NDk1ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UExBTiBNQVNTRTwvdGV4dD48L3N2Zz4=',
                tags: ['Enseignement', 'Plans', 'Campus', 'Urbanisme'],
                utiliseDans: ['AO #3', 'Références'],
                description: 'Plan de masse du campus universitaire - concours'
            },
            {
                id: 3,
                nom: 'Video_Chantier_Hotel_Ville.mp4',
                type: 'video',
                taille: '45.6 MB',
                date: '2024-11-10',
                duree: '2:34',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJjM2U1MCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiLz48cG9seWdvbiBwb2ludHM9IjE5MCwxMzAgMjIwLDE1MCAxOTAsMTcwIiBmaWxsPSIjMmMzZTUwIi8+PHRleHQgeD0iNTAlIiB5PSI4NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjI6MzQ8L3RleHQ+PC9zdmc+',
                tags: ['Chantier', 'Vidéo', 'Public', 'Rénovation'],
                utiliseDans: ['Références'],
                dimensions: '1920x1080px',
                description: "Time-lapse du chantier de rénovation de l'hôtel de ville"
            },
            {
                id: 4,
                nom: 'Interieur_Restaurant.jpg',
                type: 'image',
                taille: '2.9 MB',
                date: '2024-11-05',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0OWFjMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW50w6lyaWV1ciBSZXN0YXVyYW50PC90ZXh0Pjwvc3ZnPg==',
                tags: ['Commercial', 'Intérieur', 'Restaurant', 'Design'],
                utiliseDans: ['Références', 'AO #2'],
                dimensions: '3840x2160px',
                description: 'Aménagement intérieur du restaurant gastronomique'
            },
            {
                id: 5,
                nom: 'Maquette_3D_Immeuble.jpg',
                type: 'image',
                taille: '5.1 MB',
                date: '2024-10-28',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOWI1OWI2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNhNWE0MDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNncmFkKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWFxdWV0dGUgM0Q8L3RleHQ+PC9zdmc+',
                tags: ['3D', 'Maquette', 'Résidentiel', 'BIM'],
                utiliseDans: ['AO #1'],
                dimensions: '4096x2160px',
                description: "Rendu 3D de l'immeuble de logements - phase concours"
            },
            {
                id: 6,
                nom: 'Visite_Virtuelle_Showroom.mp4',
                type: 'video',
                taille: '67.3 MB',
                date: '2024-10-20',
                duree: '3:45',
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhYmM5YyIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48cG9seWdvbiBwb2ludHM9IjE5MCwxMzAgMjIwLDE1MCAxOTAsMTcwIiBmaWxsPSIjMWFiYzljIi8+PHRleHQgeD0iNTAlIiB5PSI4NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjM6NDU8L3RleHQ+PC9zdmc+',
                tags: ['Vidéo', 'Visite virtuelle', 'Commercial', 'VR'],
                utiliseDans: [],
                dimensions: '1920x1080px',
                description: 'Visite virtuelle 360° du showroom commercial'
            }
        ];
    }

    getFilteredMedia() {
        let filtered = this.state.mediaLibrary;
        const { filterType, selectedTags, searchQuery, filterDomaine, filterTypeArchi, filterReference } = this.state;

        // Filter by type
        if (filterType !== 'tous') {
            if (filterType === 'images') filtered = filtered.filter(m => m.type === 'image');
            if (filterType === 'videos') filtered = filtered.filter(m => m.type === 'video');
            if (filterType === 'documents') filtered = filtered.filter(m => m.type === 'document');
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter(m =>
                selectedTags.every(tag => m.tags.includes(tag))
            );
        }

        // Filter by domain
        if (filterDomaine !== 'tous') {
            filtered = filtered.filter(m => m.tags.includes(filterDomaine));
        }

        // Filter by architectural type
        if (filterTypeArchi !== 'tous') {
            filtered = filtered.filter(m => m.tags.includes(filterTypeArchi));
        }

        // Filter by reference
        if (filterReference !== 'tous') {
            filtered = filtered.filter(m => m.utiliseDans.includes(filterReference));
        }

        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(m =>
                m.nom.toLowerCase().includes(query) ||
                m.description.toLowerCase().includes(query) ||
                m.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }

    getTypeIcon(type) {
        if (type === 'image') return '🖼️';
        if (type === 'video') return '🎬';
        return '📄';
    }

    getTypeBadgeHtml(type) {
        const colors = {
            image: '#3498db',
            video: '#9b59b6',
            document: '#e74c3c'
        };
        const labels = {
            image: 'Image',
            video: 'Vidéo',
            document: 'Document'
        };
        return `
            <span style="
                background: ${colors[type] || '#95a5a6'};
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;">
                ${this.getTypeIcon(type)} ${labels[type] || type}
            </span>
        `;
    }

    toggleViewMode() {
        this.setState({ viewMode: this.state.viewMode === 'grille' ? 'liste' : 'grille' });
    }

    setFilterType(type) {
        this.setState({ filterType: type });
    }

    toggleTag(tag) {
        const { selectedTags } = this.state;
        if (selectedTags.includes(tag)) {
            this.setState({ selectedTags: selectedTags.filter(t => t !== tag) });
        } else {
            this.setState({ selectedTags: [...selectedTags, tag] });
        }
    }

    clearTags() {
        this.setState({ selectedTags: [] });
    }

    setSearchQuery(query) {
        this.setState({ searchQuery: query });
    }

    selectMedia(media) {
        this.setState({ selectedMedia: media });
    }

    closeModal() {
        this.setState({ selectedMedia: null });
    }

    async deleteMedia(id) {
        const media = this.state.mediaLibrary.find(m => m.id === id);
        const confirmed = await showConfirm(`Supprimer "${media?.nom}" de la médiathèque ?`);
        if (confirmed) {
            const newLibrary = this.state.mediaLibrary.filter(m => m.id !== id);
            storage.set('wiw-media-library', newLibrary);
            this.setState({ mediaLibrary: newLibrary, selectedMedia: null });
            showToast('Média supprimé', 'info');
        }
    }

    uploadMedia() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*,.pdf,.doc,.docx';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.size > 100 * 1024 * 1024) {
                    showToast(`${file.name} est trop volumineux (max 100 MB)`, 'warning');
                    return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                    const newMedia = {
                        id: Date.now() + Math.random(),
                        nom: file.name,
                        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
                        taille: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                        date: new Date().toISOString().split('T')[0],
                        url: reader.result,
                        tags: [],
                        utiliseDans: [],
                        description: ''
                    };

                    const newLibrary = [newMedia, ...this.state.mediaLibrary];
                    storage.set('wiw-media-library', newLibrary);
                    this.setState({ mediaLibrary: newLibrary });
                    showToast(`${file.name} ajouté à la médiathèque`, 'success');
                };
                reader.readAsDataURL(file);
            });
        };
        input.click();
    }

    resetFilters() {
        this.setState({
            searchQuery: '',
            filterType: 'tous',
            selectedTags: [],
            filterDomaine: 'tous',
            filterTypeArchi: 'tous',
            filterReference: 'tous'
        });
    }

    render() {
        const { viewMode, filterType, selectedTags, searchQuery, selectedMedia, mediaLibrary } = this.state;
        const filtered = this.getFilteredMedia();
        const hasFilters = searchQuery || filterType !== 'tous' || selectedTags.length > 0;

        return `
            <div class="page-media-library">
                <div class="page-header">
                    <h2>Médiathèque globale</h2>
                    <div class="header-actions">
                        <button class="btn" data-action="toggle-view">${viewMode === 'grille' ? 'Liste' : 'Grille'}</button>
                        <button class="btn btn-primary" data-action="upload">📤 Ajouter des médias</button>
                    </div>
                </div>

                ${this.renderStats()}
                ${this.renderFilters(filtered.length, hasFilters)}
                ${viewMode === 'grille' ? this.renderGridView(filtered) : this.renderListView(filtered)}
                ${filtered.length === 0 ? this.renderEmptyState() : ''}
                ${selectedMedia ? this.renderModal(selectedMedia) : ''}
            </div>
        `;
    }

    renderStats() {
        const { mediaLibrary } = this.state;
        return `
            <div class="stats-grid" style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div class="card stat-card" style="flex: 1; padding: 15px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: var(--brand);">${mediaLibrary.length}</div>
                    <div style="font-size: 13px; opacity: 0.7;">Médias au total</div>
                </div>
                <div class="card stat-card" style="flex: 1; padding: 15px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #3498db;">${mediaLibrary.filter(m => m.type === 'image').length}</div>
                    <div style="font-size: 13px; opacity: 0.7;">Images</div>
                </div>
                <div class="card stat-card" style="flex: 1; padding: 15px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #9b59b6;">${mediaLibrary.filter(m => m.type === 'video').length}</div>
                    <div style="font-size: 13px; opacity: 0.7;">Vidéos</div>
                </div>
                <div class="card stat-card" style="flex: 1; padding: 15px; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #e74c3c;">${mediaLibrary.filter(m => m.type === 'document').length}</div>
                    <div style="font-size: 13px; opacity: 0.7;">Documents</div>
                </div>
            </div>
        `;
    }

    renderFilters(count, hasFilters) {
        const { filterType, selectedTags, searchQuery } = this.state;
        return `
            <div class="card" style="margin-bottom: 20px; padding: 20px;">
                <h3 style="margin-bottom: 15px;">🔍 Filtres et recherche</h3>

                <div style="margin-bottom: 15px;">
                    <input type="text" class="form-input" id="search-input"
                           placeholder="Rechercher par nom, description ou tag..."
                           value="${searchQuery}"
                           style="width: 100%;">
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">Type de média</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${['tous', 'images', 'videos', 'documents'].map(type => `
                            <button class="btn ${filterType === type ? '' : 'btn-secondary'}" data-filter-type="${type}">
                                ${type === 'tous' ? 'Tous' : type === 'images' ? '🖼️ Images' : type === 'videos' ? '🎬 Vidéos' : '📄 Documents'}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">
                        Tags ${selectedTags.length > 0 ? `(${selectedTags.length} sélectionnés)` : ''}
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        ${this.allTags.map(tag => `
                            <button class="tag-btn" data-tag="${tag}" style="
                                background: ${selectedTags.includes(tag) ? '#2ecc71' : 'var(--panel)'};
                                color: ${selectedTags.includes(tag) ? 'white' : 'var(--ink)'};
                                border: ${selectedTags.includes(tag) ? '2px solid #27ae60' : '1px solid var(--border)'};
                                padding: 5px 12px;
                                border-radius: 15px;
                                font-size: 12px;
                                cursor: pointer;">
                                ${selectedTags.includes(tag) ? '✓ ' : ''}${tag}
                            </button>
                        `).join('')}
                    </div>
                </div>

                ${hasFilters ? `
                    <div style="margin-top: 15px; padding: 10px; background: rgba(52,152,219,0.1); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 13px;"><strong>${count}</strong> média${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}</span>
                        <button class="btn btn-secondary" data-action="reset-filters" style="font-size: 12px;">Réinitialiser</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderGridView(media) {
        return `
            <div class="media-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${media.map(m => `
                    <div class="card media-card" data-media-id="${m.id}" style="padding: 0; overflow: hidden; cursor: pointer; transition: transform 0.2s;">
                        <div style="width: 100%; height: 200px; background: var(--panel); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                            ${m.type === 'video' ? `
                                <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                                    ${m.duree || '0:00'}
                                </div>
                            ` : ''}
                            <img src="${m.url}" alt="${m.nom}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 15px;">
                            <div style="margin-bottom: 8px;">${this.getTypeBadgeHtml(m.type)}</div>
                            <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${m.nom}
                            </div>
                            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">
                                ${m.taille} • ${m.date}
                            </div>
                            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
                                ${m.tags.slice(0, 3).map(tag => `
                                    <span style="background: rgba(52,152,219,0.2); color: var(--brand); padding: 3px 8px; border-radius: 10px; font-size: 11px;">
                                        ${tag}
                                    </span>
                                `).join('')}
                                ${m.tags.length > 3 ? `<span style="font-size: 11px; opacity: 0.6;">+${m.tags.length - 3}</span>` : ''}
                            </div>
                            ${m.utiliseDans.length > 0 ? `
                                <div style="font-size: 11px; opacity: 0.7; margin-bottom: 10px;">
                                    📌 Utilisé dans: ${m.utiliseDans.join(', ')}
                                </div>
                            ` : ''}
                            <div style="display: flex; gap: 5px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border);">
                                <button class="btn btn-secondary" data-view-media="${m.id}" style="flex: 1; padding: 6px; font-size: 12px;">👁️ Détails</button>
                                <button class="btn btn-secondary" data-delete-media="${m.id}" style="padding: 6px; font-size: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderListView(media) {
        return `
            <div class="card">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 50px;"></th>
                                <th>Nom</th>
                                <th style="width: 120px;">Type</th>
                                <th style="width: 100px;">Taille</th>
                                <th style="width: 120px;">Date</th>
                                <th>Tags</th>
                                <th style="width: 150px;">Utilisé dans</th>
                                <th style="width: 100px; text-align: center;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${media.map(m => `
                                <tr>
                                    <td style="padding: 12px;">
                                        <div style="width: 40px; height: 40px; border-radius: 4px; overflow: hidden;">
                                            <img src="${m.url}" alt="${m.nom}" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                    </td>
                                    <td style="font-weight: bold; font-size: 13px;">${m.nom}</td>
                                    <td>${this.getTypeBadgeHtml(m.type)}</td>
                                    <td style="font-size: 13px;">${m.taille}</td>
                                    <td style="font-size: 13px;">${m.date}</td>
                                    <td>
                                        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                                            ${m.tags.slice(0, 2).map(tag => `
                                                <span style="background: rgba(52,152,219,0.2); color: var(--brand); padding: 3px 8px; border-radius: 10px; font-size: 11px;">${tag}</span>
                                            `).join('')}
                                            ${m.tags.length > 2 ? `<span style="font-size: 11px;">+${m.tags.length - 2}</span>` : ''}
                                        </div>
                                    </td>
                                    <td style="font-size: 12px; opacity: 0.7;">${m.utiliseDans.length > 0 ? m.utiliseDans.join(', ') : '-'}</td>
                                    <td style="text-align: center;">
                                        <div style="display: flex; gap: 5px; justify-content: center;">
                                            <button class="btn btn-secondary" data-view-media="${m.id}" style="padding: 6px 12px; font-size: 13px;">👁️</button>
                                            <button class="btn btn-secondary" data-delete-media="${m.id}" style="padding: 6px 12px; font-size: 13px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="card" style="padding: 60px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Aucun média trouvé</div>
                <div style="font-size: 14px; opacity: 0.7; margin-bottom: 20px;">Aucun média ne correspond à vos critères de recherche</div>
                <button class="btn" data-action="reset-filters">Réinitialiser les filtres</button>
            </div>
        `;
    }

    renderModal(media) {
        return `
            <div class="modal-overlay" data-close-modal>
                <div class="modal-content card" style="max-width: 900px; max-height: 90vh; overflow: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                        <div>
                            <h3 style="margin-bottom: 10px;">${media.nom}</h3>
                            ${this.getTypeBadgeHtml(media.type)}
                        </div>
                        <button class="btn btn-secondary" data-close-modal>✕</button>
                    </div>

                    <div style="width: 100%; max-height: 400px; background: var(--panel); border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        ${media.type === 'video' ? `
                            <div style="position: relative; width: 100%;">
                                <img src="${media.url}" alt="${media.nom}" style="width: 100%; height: auto;">
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 64px; opacity: 0.8;">▶️</div>
                            </div>
                        ` : `
                            <img src="${media.url}" alt="${media.nom}" style="width: 100%; height: auto;">
                        `}
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Taille</div>
                            <div style="font-weight: bold;">${media.taille}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Date d'ajout</div>
                            <div style="font-weight: bold;">${media.date}</div>
                        </div>
                        ${media.dimensions ? `
                            <div>
                                <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Dimensions</div>
                                <div style="font-weight: bold;">${media.dimensions}</div>
                            </div>
                        ` : ''}
                        ${media.duree ? `
                            <div>
                                <div style="font-size: 12px; opacity: 0.7; margin-bottom: 5px;">Durée</div>
                                <div style="font-weight: bold;">${media.duree}</div>
                            </div>
                        ` : ''}
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">Description</div>
                        <p style="background: var(--panel); padding: 10px; border-radius: 6px; font-size: 13px;">
                            ${media.description || 'Aucune description'}
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">Tags</div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${media.tags.map(tag => `
                                <span style="background: rgba(52,152,219,0.2); color: var(--brand); padding: 5px 10px; border-radius: 12px; font-size: 12px;">
                                    ${tag}
                                </span>
                            `).join('')}
                            ${media.tags.length === 0 ? '<span style="opacity: 0.5; font-size: 13px;">Aucun tag</span>' : ''}
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">
                            Utilisé dans (${media.utiliseDans.length})
                        </div>
                        ${media.utiliseDans.length > 0 ? `
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                ${media.utiliseDans.map(usage => `
                                    <span style="background: rgba(46,204,113,0.2); color: #27ae60; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                        📌 ${usage}
                                    </span>
                                `).join('')}
                            </div>
                        ` : `
                            <div style="font-size: 13px; opacity: 0.7;">Ce média n'est utilisé dans aucun module</div>
                        `}
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-secondary" data-delete-media="${media.id}">🗑️ Supprimer</button>
                        <button class="btn btn-primary" data-download-media="${media.id}">📥 Télécharger</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Toggle view mode
        document.querySelector('[data-action="toggle-view"]')?.addEventListener('click', () => this.toggleViewMode());

        // Upload
        document.querySelector('[data-action="upload"]')?.addEventListener('click', () => this.uploadMedia());

        // Search input
        document.getElementById('search-input')?.addEventListener('input', (e) => this.setSearchQuery(e.target.value));

        // Filter type buttons
        document.querySelectorAll('[data-filter-type]').forEach(btn => {
            btn.addEventListener('click', () => this.setFilterType(btn.dataset.filterType));
        });

        // Tag buttons
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleTag(btn.dataset.tag));
        });

        // Reset filters
        document.querySelectorAll('[data-action="reset-filters"]').forEach(btn => {
            btn.addEventListener('click', () => this.resetFilters());
        });

        // Media cards
        document.querySelectorAll('.media-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-view-media]') || e.target.closest('[data-delete-media]')) return;
                const mediaId = parseInt(card.dataset.mediaId);
                const media = this.state.mediaLibrary.find(m => m.id === mediaId);
                if (media) this.selectMedia(media);
            });
        });

        // View media buttons
        document.querySelectorAll('[data-view-media]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mediaId = parseInt(btn.dataset.viewMedia);
                const media = this.state.mediaLibrary.find(m => m.id === mediaId);
                if (media) this.selectMedia(media);
            });
        });

        // Delete media buttons
        document.querySelectorAll('[data-delete-media]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMedia(parseInt(btn.dataset.deleteMedia));
            });
        });

        // Download media
        document.querySelectorAll('[data-download-media]').forEach(btn => {
            btn.addEventListener('click', () => {
                const media = this.state.selectedMedia;
                if (media) {
                    const link = document.createElement('a');
                    link.href = media.url;
                    link.download = media.nom;
                    link.click();
                    showToast('Téléchargement en cours...', 'info');
                }
            });
        });

        // Close modal
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || e.target.hasAttribute('data-close-modal')) {
                    this.closeModal();
                }
            });
        });

        // Hover effects for grid cards
        document.querySelectorAll('.media-card').forEach(card => {
            card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
            card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
        });
    }
}
