import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function MediaLibrary() {
  const [viewMode, setViewMode] = useState('grille'); // 'grille' ou 'liste'
  const [filterType, setFilterType] = useState('tous'); // 'tous', 'images', 'videos', 'documents'
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  
  // Nouveaux filtres Architecture
  const [filterDomaine, setFilterDomaine] = useState('tous');
  const [filterTypeArchi, setFilterTypeArchi] = useState('tous');
  const [filterReference, setFilterReference] = useState('tous');

  // Médiathèque centralisée avec tags
  const [mediaLibrary, setMediaLibrary] = useState([
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
      description: 'Time-lapse du chantier de rénovation de l\'hôtel de ville'
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
      description: 'Rendu 3D de l\'immeuble de logements - phase concours'
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
  ]);

  // Tags disponibles
  const allTags = [
    'Résidentiel', 'Commercial', 'Public', 'Enseignement',
    'Façade', 'Intérieur', 'Plans', 'Maquette', '3D', 'BIM',
    'Chantier', 'Rénovation', 'Neuf', 'Urbanisme',
    'Vidéo', 'Visite virtuelle', 'VR', 'Lyon', 'Paris', 'Design', 'Restaurant'
  ];

  // Filtrage des médias
  const getFilteredMedia = () => {
    let filtered = mediaLibrary;

    // Filtre par type
    if (filterType !== 'tous') {
      if (filterType === 'images') filtered = filtered.filter(m => m.type === 'image');
      if (filterType === 'videos') filtered = filtered.filter(m => m.type === 'video');
      if (filterType === 'documents') filtered = filtered.filter(m => m.type === 'document');
    }

    // Filtre par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(m => 
        selectedTags.every(tag => m.tags.includes(tag))
      );
    }
    
    // Filtre par domaine architecture
    if (filterDomaine !== 'tous') {
      filtered = filtered.filter(m => m.tags.includes(filterDomaine));
    }
    
    // Filtre par type architectural
    if (filterTypeArchi !== 'tous') {
      filtered = filtered.filter(m => m.tags.includes(filterTypeArchi));
    }
    
    // Filtre par référence
    if (filterReference !== 'tous') {
      filtered = filtered.filter(m => m.utiliseDans.includes(filterReference));
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.nom.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredMedia = getFilteredMedia();

  // Handlers
  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleUploadMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,.pdf,.doc,.docx';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (file.size > 100 * 1024 * 1024) {
          alert(`⚠️ ${file.name} est trop volumineux (max 100 MB)`);
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

          if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
              newMedia.dimensions = `${img.width}x${img.height}px`;
              setMediaLibrary([newMedia, ...mediaLibrary]);
            };
            img.src = reader.result;
          } else if (file.type.startsWith('video/')) {
            newMedia.duree = '0:00';
            setMediaLibrary([newMedia, ...mediaLibrary]);
          } else {
            setMediaLibrary([newMedia, ...mediaLibrary]);
          }

          if (window.showToast) {
            window.showToast(`✅ ${file.name} ajouté à la médiathèque`, 'success');
          }
        };
        reader.readAsDataURL(file);
      });
      setShowUpload(false);
    };
    input.click();
  };

  const handleDeleteMedia = (id) => {
    const media = mediaLibrary.find(m => m.id === id);
    if (confirm(`Supprimer "${media.nom}" de la médiathèque ?`)) {
      setMediaLibrary(mediaLibrary.filter(m => m.id !== id));
      setSelectedMedia(null);
      if (window.showToast) {
        window.showToast('🗑️ Média supprimé', 'info');
      }
    }
  };

  const handleAddTag = (mediaId, newTag) => {
    if (!newTag.trim()) return;
    setMediaLibrary(mediaLibrary.map(m => {
      if (m.id === mediaId) {
        if (!m.tags.includes(newTag)) {
          return { ...m, tags: [...m.tags, newTag] };
        }
      }
      return m;
    }));
    if (window.showToast) {
      window.showToast(`🏷️ Tag "${newTag}" ajouté`, 'success');
    }
  };

  const handleRemoveTag = (mediaId, tag) => {
    setMediaLibrary(mediaLibrary.map(m => {
      if (m.id === mediaId) {
        return { ...m, tags: m.tags.filter(t => t !== tag) };
      }
      return m;
    }));
  };

  const handleUpdateDescription = (mediaId, description) => {
    setMediaLibrary(mediaLibrary.map(m => {
      if (m.id === mediaId) {
        return { ...m, description };
      }
      return m;
    }));
  };

  const getTypeIcon = (type) => {
    if (type === 'image') return '🖼️';
    if (type === 'video') return '🎬';
    return '📄';
  };

  const getTypeBadge = (type) => {
    const colors = {
      image: '#3498db',
      video: '#9b59b6',
      document: '#e74c3c'
    };
    return (
      <span style={{
        background: colors[type] || '#95a5a6',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        {getTypeIcon(type)} {type === 'image' ? 'Image' : type === 'video' ? 'Vidéo' : 'Document'}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px'}}>Médiathèque globale</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            className="btn" 
            onClick={() => setViewMode(viewMode === 'grille' ? 'liste' : 'grille')}
            style={{padding: '8px 16px'}}
          >
            {viewMode === 'grille' ? 'Liste' : 'Grille'}
          </button>
          <button className="btn" onClick={handleUploadMedia} style={{padding: '8px 16px'}}>
            Ajouter des médias
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
        <div className="card" style={{flex: 1, padding: '15px', textAlign: 'center'}}>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: 'var(--brand)'}}>
            {mediaLibrary.length}
          </div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Médias au total</div>
        </div>
        <div className="card" style={{flex: 1, padding: '15px', textAlign: 'center'}}>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#3498db'}}>
            {mediaLibrary.filter(m => m.type === 'image').length}
          </div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Images</div>
        </div>
        <div className="card" style={{flex: 1, padding: '15px', textAlign: 'center'}}>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#9b59b6'}}>
            {mediaLibrary.filter(m => m.type === 'video').length}
          </div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Vidéos</div>
        </div>
        <div className="card" style={{flex: 1, padding: '15px', textAlign: 'center'}}>
          <div style={{fontSize: '28px', fontWeight: 'bold', color: '#e74c3c'}}>
            {mediaLibrary.filter(m => m.type === 'document').length}
          </div>
          <div style={{fontSize: '13px', opacity: 0.7}}>Documents</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card" style={{marginBottom: '20px', padding: '20px'}}>
          <h3 style={{marginBottom: '15px'}}>Filtres et recherche</h3>

        {/* Barre de recherche */}
        <div style={{marginBottom: '15px'}}>
          <input
            type="text"
            placeholder="Rechercher par nom, description ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Filtres par type */}
        <div style={{marginBottom: '15px'}}>
          <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>Type de média</div>
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
            {['tous', 'images', 'videos', 'documents'].map(type => (
              <button
                key={type}
                className="btn-secondary"
                onClick={() => setFilterType(type)}
                style={{
                  background: filterType === type ? 'var(--brand)' : 'var(--panel)',
                  color: filterType === type ? 'white' : 'var(--ink)',
                  border: filterType === type ? '2px solid var(--brand)' : '1px solid var(--border)',
                  padding: '6px 14px',
                  fontSize: '13px'
                }}
              >
                {type === 'tous' ? 'Tous' : type === 'images' ? 'Images' : type === 'videos' ? 'Vidéos' : 'Documents'}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres par tags */}
        <div>
          <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>
            Tags {selectedTags.length > 0 && `(${selectedTags.length} sélectionnés)`}
          </div>
          <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                style={{
                  background: selectedTags.includes(tag) ? '#2ecc71' : 'var(--panel)',
                  color: selectedTags.includes(tag) ? 'white' : 'var(--ink)',
                  border: selectedTags.includes(tag) ? '2px solid #27ae60' : '1px solid var(--border)',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Filtres Architecture spécifiques */}
        <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)'}}>
          <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--brand)'}}>
            Filtres Architecture
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
            {/* Filtre Domaine */}
            <div>
              <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>Domaine</label>
              <select 
                value={filterDomaine}
                onChange={(e) => setFilterDomaine(e.target.value)}
                style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px'}}
              >
                <option value="tous">Tous les domaines</option>
                <option value="Résidentiel">Résidentiel</option>
                <option value="Commercial">Commercial</option>
                <option value="Public">Public</option>
                <option value="Enseignement">Enseignement</option>
              </select>
            </div>
            
            {/* Filtre Type architectural */}
            <div>
              <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>Type</label>
              <select 
                value={filterTypeArchi}
                onChange={(e) => setFilterTypeArchi(e.target.value)}
                style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px'}}
              >
                <option value="tous">Tous les types</option>
                <option value="Neuf">Neuf</option>
                <option value="Rénovation">Rénovation</option>
                <option value="Façade">Façade</option>
                <option value="Intérieur">Intérieur</option>
                <option value="Plans">Plans</option>
                <option value="3D">3D / Maquette</option>
              </select>
            </div>
            
            {/* Filtre Référence */}
            <div>
              <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>Utilisé dans</label>
              <select 
                value={filterReference}
                onChange={(e) => setFilterReference(e.target.value)}
                style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px'}}
              >
                <option value="tous">Toutes références</option>
                <option value="Références">Références</option>
                <option value="AO #1">AO #1</option>
                <option value="AO #2">AO #2</option>
                <option value="AO #3">AO #3</option>
              </select>
            </div>
          </div>
        </div>

        {(searchQuery || filterType !== 'tous' || selectedTags.length > 0 || filterDomaine !== 'tous' || filterTypeArchi !== 'tous' || filterReference !== 'tous') && (
          <div style={{marginTop: '15px', padding: '10px', background: 'rgba(52,152,219,0.1)', borderRadius: '6px'}}>
            <div style={{fontSize: '13px'}}>
              <strong>{filteredMedia.length}</strong> média{filteredMedia.length > 1 ? 's' : ''} trouvé{filteredMedia.length > 1 ? 's' : ''}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  style={{
                    marginLeft: '10px',
                    background: 'transparent',
                    color: 'var(--brand)',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '12px'
                  }}
                >
                  Réinitialiser les tags
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Affichage Grille */}
      {viewMode === 'grille' && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
          {filteredMedia.map(media => (
            <div
              key={media.id}
              className="card"
              style={{padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s'}}
              onClick={() => setSelectedMedia(media)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Vignette */}
              <div style={{
                width: '100%',
                height: '200px',
                background: 'var(--panel)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {media.type === 'video' && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {media.duree}
                  </div>
                )}
                <img
                  src={media.url}
                  alt={media.nom}
                  style={{width: '100%', height: '100%', objectFit: 'cover'}}
                />
              </div>

              {/* Infos */}
              <div style={{padding: '15px'}}>
                <div style={{marginBottom: '8px'}}>
                  {getTypeBadge(media.type)}
                </div>
                <div style={{fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {media.nom}
                </div>
                <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '10px'}}>
                  {media.taille} • {media.date}
                </div>
                
                {/* Tags */}
                <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px'}}>
                  {media.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(52,152,219,0.2)',
                        color: 'var(--brand)',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '11px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {media.tags.length > 3 && (
                    <span style={{fontSize: '11px', opacity: 0.6}}>+{media.tags.length - 3}</span>
                  )}
                </div>

                {/* Utilisé dans */}
                {media.utiliseDans.length > 0 && (
                  <div style={{fontSize: '11px', opacity: 0.7, marginBottom: '10px'}}>
                    📌 Utilisé dans: {media.utiliseDans.join(', ')}
                  </div>
                )}

                {/* Actions */}
                <div style={{display: 'flex', gap: '5px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)'}}>
                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(media);
                    }}
                    style={{flex: 1, padding: '6px', fontSize: '12px'}}
                    title="Voir détails"
                  >
                    👁️ Détails
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia(media);
                    }}
                    style={{flex: 1, padding: '6px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}
                    title="Modifier"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMedia(media.id);
                    }}
                    style={{padding: '6px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Affichage Liste */}
      {viewMode === 'liste' && (
        <div className="card">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid var(--border)'}}>
                <th style={{padding: '12px', textAlign: 'left', width: '50px'}}></th>
                <th style={{padding: '12px', textAlign: 'left'}}>Nom</th>
                <th style={{padding: '12px', textAlign: 'left', width: '120px'}}>Type</th>
                <th style={{padding: '12px', textAlign: 'left', width: '100px'}}>Taille</th>
                <th style={{padding: '12px', textAlign: 'left', width: '120px'}}>Date</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Tags</th>
                <th style={{padding: '12px', textAlign: 'left', width: '150px'}}>Utilisé dans</th>
                <th style={{padding: '12px', textAlign: 'center', width: '80px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map(media => (
                <tr key={media.id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '12px'}}>
                    <div style={{width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden'}}>
                      <img src={media.url} alt={media.nom} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                  </td>
                  <td style={{padding: '12px', fontWeight: 'bold', fontSize: '13px'}}>{media.nom}</td>
                  <td style={{padding: '12px'}}>{getTypeBadge(media.type)}</td>
                  <td style={{padding: '12px', fontSize: '13px'}}>{media.taille}</td>
                  <td style={{padding: '12px', fontSize: '13px'}}>{media.date}</td>
                  <td style={{padding: '12px'}}>
                    <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                      {media.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          style={{
                            background: 'rgba(52,152,219,0.2)',
                            color: 'var(--brand)',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '11px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {media.tags.length > 2 && <span style={{fontSize: '11px'}}>+{media.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td style={{padding: '12px', fontSize: '12px', opacity: 0.7}}>
                    {media.utiliseDans.length > 0 ? media.utiliseDans.join(', ') : '-'}
                  </td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
                    <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                      <button
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMedia(media);
                        }}
                        style={{padding: '6px 12px', fontSize: '13px'}}
                        title="Voir détails"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMedia(media);
                        }}
                        style={{padding: '6px 12px', fontSize: '13px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(media.id);
                        }}
                        style={{padding: '6px 12px', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="card" style={{padding: '60px', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '20px'}}><Search size={48} /></div>
          <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '10px'}}>
            Aucun média trouvé
          </div>
          <div style={{fontSize: '14px', opacity: 0.7, marginBottom: '20px'}}>
            Aucun média ne correspond à vos critères de recherche
          </div>
          <button className="btn" onClick={() => {
            setSearchQuery('');
            setFilterType('tous');
            setSelectedTags([]);
          }}>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Modal détails */}
      {selectedMedia && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '30px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
              <div>
                <h3 style={{marginBottom: '10px'}}>{selectedMedia.nom}</h3>
                {getTypeBadge(selectedMedia.type)}
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <button
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Fonctionnalité de modification à implémenter
                    if (window.showToast) {
                      window.showToast('Fonctionnalité de modification en cours de développement', 'info');
                    }
                  }}
                  style={{padding: '6px 12px', fontSize: '13px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => setSelectedMedia(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    opacity: 0.7
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Aperçu */}
            <div style={{
              width: '100%',
              maxHeight: '400px',
              background: 'var(--panel)',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {selectedMedia.type === 'video' ? (
                <div style={{position: 'relative', width: '100%'}}>
                  <img src={selectedMedia.url} alt={selectedMedia.nom} style={{width: '100%', height: 'auto'}} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '64px',
                    opacity: 0.8
                  }}>
                    ▶️
                  </div>
                </div>
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.nom} style={{width: '100%', height: 'auto'}} />
              )}
            </div>

            {/* Informations */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
              <div>
                <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Taille</div>
                <div style={{fontWeight: 'bold'}}>{selectedMedia.taille}</div>
              </div>
              <div>
                <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Date d'ajout</div>
                <div style={{fontWeight: 'bold'}}>{selectedMedia.date}</div>
              </div>
              {selectedMedia.dimensions && (
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Dimensions</div>
                  <div style={{fontWeight: 'bold'}}>{selectedMedia.dimensions}</div>
                </div>
              )}
              {selectedMedia.duree && (
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Durée</div>
                  <div style={{fontWeight: 'bold'}}>{selectedMedia.duree}</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{marginBottom: '20px'}}>
              <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>Description</div>
              <textarea
                value={selectedMedia.description}
                onChange={(e) => handleUpdateDescription(selectedMedia.id, e.target.value)}
                placeholder="Ajouter une description..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Tags */}
            <div style={{marginBottom: '20px'}}>
              <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>Tags</div>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px'}}>
                {selectedMedia.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(52,152,219,0.2)',
                      color: 'var(--brand)',
                      padding: '5px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(selectedMedia.id, tag)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--brand)',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                {allTags
                  .filter(tag => !selectedMedia.tags.includes(tag))
                  .map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(selectedMedia.id, tag)}
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--border)',
                        padding: '5px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      + {tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* Utilisé dans */}
            <div style={{marginBottom: '20px'}}>
              <div style={{fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'}}>
                Utilisé dans ({selectedMedia.utiliseDans.length})
              </div>
              {selectedMedia.utiliseDans.length > 0 ? (
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {selectedMedia.utiliseDans.map((usage, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(46,204,113,0.2)',
                        color: '#27ae60',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      📌 {usage}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{fontSize: '13px', opacity: 0.7}}>
                  Ce média n'est utilisé dans aucun module pour le moment
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
              <button
                className="btn-secondary"
                onClick={() => handleDeleteMedia(selectedMedia.id)}
                style={{padding: '8px 16px'}}
              >
                🗑️ Supprimer
              </button>
              <button
                className="btn"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedMedia.url;
                  link.download = selectedMedia.nom;
                  link.click();
                  if (window.showToast) {
                    window.showToast('📥 Téléchargement en cours...', 'info');
                  }
                }}
                style={{padding: '8px 16px'}}
              >
                📥 Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
