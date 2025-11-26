import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Package, Search, ClipboardList, FileText } from 'lucide-react';
import { formatMontant } from '../utils/formatNumber';

export default function CatalogueArticles({ onNavigate }) {
  const [articles, setArticles] = useLocalStorage('wiw-articles', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('all');

  // Fonction pour utiliser un article dans un devis
  const handleUtiliserDansDevis = (article) => {
    if (onNavigate) {
      localStorage.setItem('wiw-devis-article', JSON.stringify(article));
      onNavigate('devis');
    }
  };
  
  const [formData, setFormData] = useState({
    reference: '',
    designation: '',
    description: '',
    categorie: 'plomberie',
    unite: 'U',
    puHT: 0,
    tva: 20,
    photos: [], // URLs des photos
    vignette: '', // URL principale
    actif: true,
    fournisseur: '',
    delai: ''
  });

  const categories = [
    'plomberie', 'electricite', 'menuiserie', 'peinture', 
    'carrelage', 'chauffage', 'maconnerie', 'couverture', 'autre'
  ];

  const unites = ['U', 'ml', 'm²', 'm³', 'kg', 'heure', 'forfait', 'lot'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setArticles(articles.map(a => 
        a.id === editingId ? { ...formData, id: editingId } : a
      ));
      if (window.showToast) {
        window.showToast('✅ Article modifié', 'success');
      }
    } else {
      const nouvelArticle = {
        ...formData,
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      setArticles([...articles, nouvelArticle]);
      if (window.showToast) {
        window.showToast('✅ Article ajouté au catalogue', 'success');
      }
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
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
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (article) => {
    setFormData(article);
    setEditingId(article.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer cet article du catalogue ?')) {
      setArticles(articles.filter(a => a.id !== id));
      if (window.showToast) {
        window.showToast('🗑️ Article supprimé', 'info');
      }
    }
  };

  const handleDuplicate = (article) => {
    const copie = {
      ...article,
      id: Date.now(),
      reference: article.reference + '-COPIE',
      designation: article.designation + ' (Copie)',
      dateCreation: new Date().toISOString()
    };
    setArticles([...articles, copie]);
    if (window.showToast) {
      window.showToast('✅ Article dupliqué', 'success');
    }
  };

  const handleToggleActif = (id) => {
    setArticles(articles.map(a => 
      a.id === id ? { ...a, actif: !a.actif } : a
    ));
  };

  const handleImageUpload = (e, isVignette = false) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        
        if (isVignette) {
          setFormData({ ...formData, vignette: dataUrl });
        } else {
          setFormData({ 
            ...formData, 
            photos: [...formData.photos, dataUrl]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const getFilteredArticles = () => {
    return articles.filter(article => {
      const matchSearch = 
        article.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategorie = 
        filterCategorie === 'all' || article.categorie === filterCategorie;
      
      return matchSearch && matchCategorie;
    });
  };

  const articlesFiltrés = getFilteredArticles();
  const articlesActifs = articles.filter(a => a.actif).length;
  const valeurTotale = articles.reduce((sum, a) => sum + (a.actif ? a.puHT : 0), 0);

  return (
    <div style={{padding: '20px', maxWidth: '1600px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
        <div>
          <h1 style={{fontSize: '28px', fontWeight: '600', marginBottom: '5px'}}>
            <Package size={16} /> Catalogue d'Articles
          </h1>
          <p style={{opacity: 0.7, margin: 0}}>
            {articles.length} articles • {articlesActifs} actifs • {valeurTotale.toFixed(2)} € HT valeur catalogue
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            background: showForm ? '#6c757d' : '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showForm ? '✖ Annuler' : '+ Nouvel article'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginBottom: '30px'
        }}>
          <h2 style={{marginBottom: '25px', fontSize: '22px', color: '#2e7d32'}}>
            {editingId ? '✏️ Modifier l\'article' : '➕ Nouvel article'}
          </h2>
          
          {/* Ligne 1 : Références */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Référence *
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                required
                placeholder="Ex: PLB-001"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2e7d32'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Catégorie *
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Unité *
              </label>
              <select
                value={formData.unite}
                onChange={(e) => setFormData({...formData, unite: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                {unites.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ligne 2 : Désignation */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
              Désignation *
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              required
              placeholder="Ex: Baignoire acrylique 170x70 cm"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Ligne 3 : Description */}
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
              Description détaillée
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Description technique, caractéristiques, conseils de pose..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Ligne 4 : Prix */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Prix unitaire HT (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.puHT}
                onChange={(e) => setFormData({...formData, puHT: parseFloat(e.target.value) || 0})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                TVA (%)
              </label>
              <select
                value={formData.tva}
                onChange={(e) => setFormData({...formData, tva: parseFloat(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value={0}>0%</option>
                <option value={5.5}>5.5%</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
              </select>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Prix TTC (€)
              </label>
              <input
                type="text"
                value={(formData.puHT * (1 + formData.tva / 100)).toFixed(2)}
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#f5f5f5',
                  color: '#666'
                }}
              />
            </div>
          </div>

          {/* Ligne 5 : Infos complémentaires */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Fournisseur
              </label>
              <input
                type="text"
                value={formData.fournisseur}
                onChange={(e) => setFormData({...formData, fournisseur: e.target.value})}
                placeholder="Ex: Leroy Merlin"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Délai de livraison
              </label>
              <input
                type="text"
                value={formData.delai}
                onChange={(e) => setFormData({...formData, delai: e.target.value})}
                placeholder="Ex: 48h, 1 semaine"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{display: 'flex', alignItems: 'flex-end'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none'}}>
                <input
                  type="checkbox"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                  style={{width: '20px', height: '20px', cursor: 'pointer'}}
                />
                <span style={{fontWeight: '600', fontSize: '14px'}}>Article actif</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
            <h3 style={{marginBottom: '15px', fontSize: '16px'}}>📸 Photos & Vignette</h3>
            
            {/* Vignette principale */}
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Vignette principale (affichée en priorité)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                style={{marginBottom: '10px'}}
              />
              
              {formData.vignette && (
                <div style={{position: 'relative', display: 'inline-block'}}>
                  <img 
                    src={formData.vignette} 
                    alt="Vignette" 
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '3px solid #2e7d32'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, vignette: ''})}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Photos additionnelles */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>
                Photos supplémentaires
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, false)}
                style={{marginBottom: '10px'}}
              />
              
              {formData.photos.length > 0 && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px'}}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} style={{position: 'relative'}}>
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '2px solid #ddd'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          lineHeight: '1'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end'}}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '12px 24px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {editingId ? '💾 Enregistrer' : '✓ Ajouter au catalogue'}
            </button>
          </div>
        </form>
      )}

      {/* Filtres & Recherche */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher (référence, désignation, description...)"
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        
        <select
          value={filterCategorie}
          onChange={(e) => setFilterCategorie(e.target.value)}
          style={{
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">Toutes catégories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des articles */}
      {articlesFiltrés.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#999'
        }}>
          <div style={{fontSize: '64px', marginBottom: '20px'}}><Package size={64} /></div>
          <h3 style={{fontSize: '20px', marginBottom: '10px'}}>
            {articles.length === 0 ? 'Aucun article dans le catalogue' : 'Aucun résultat'}
          </h3>
          <p style={{fontSize: '14px', opacity: 0.8}}>
            {articles.length === 0 
              ? 'Cliquez sur "Nouvel article" pour commencer'
              : 'Essayez d\'autres critères de recherche'
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {articlesFiltrés.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleActif={handleToggleActif}
              onUtiliserDansDevis={handleUtiliserDansDevis}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, onEdit, onDelete, onDuplicate, onToggleActif, onUtiliserDansDevis }) {
  const [showPhotos, setShowPhotos] = useState(false);
  const prixTTC = article.puHT * (1 + article.tva / 100);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      opacity: article.actif ? 1 : 0.6,
      position: 'relative'
    }}>
      {/* Badge actif/inactif */}
      {!article.actif && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#dc3545',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 10
        }}>
          INACTIF
        </div>
      )}

      {/* Image */}
      <div
        onClick={() => article.photos.length > 0 && setShowPhotos(!showPhotos)}
        style={{
          height: '200px',
          background: article.vignette 
            ? `url(${article.vignette}) center/cover`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: article.photos.length > 0 ? 'pointer' : 'default',
          position: 'relative'
        }}
      >
        {!article.vignette && (
          <span style={{fontSize: '64px'}}><Package size={64} /></span>
        )}
        {article.photos.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            📸 {article.photos.length} photo{article.photos.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{padding: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
          <div style={{flex: 1}}>
            <div style={{
              fontSize: '11px',
              color: '#666',
              marginBottom: '5px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {article.reference} • {article.categorie}
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              lineHeight: '1.3'
            }}>
              {article.designation}
            </h3>
          </div>
        </div>

        {article.description && (
          <p style={{
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '15px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {article.description}
          </p>
        )}

        {/* Prix */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
            <span style={{fontSize: '13px', color: '#666'}}>Prix unitaire HT :</span>
            <span style={{fontSize: '15px', fontWeight: '600'}}>{formatMontant(article.puHT, 2)}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontSize: '13px', color: '#666'}}>Prix TTC (TVA {article.tva}%) :</span>
            <span style={{fontSize: '17px', fontWeight: '700', color: '#2e7d32'}}>
              {formatMontant(prixTTC, 2)}
            </span>
          </div>
          <div style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>
            / {article.unite}
          </div>
        </div>

        {/* Infos complémentaires */}
        {(article.fournisseur || article.delai) && (
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '15px',
            paddingTop: '10px',
            borderTop: '1px solid #e0e0e0'
          }}>
            {article.fournisseur && <div>🏪 {article.fournisseur}</div>}
            {article.delai && <div>⏱️ Délai: {article.delai}</div>}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          <button
            onClick={() => onEdit(article)}
            style={{
              padding: '10px',
              background: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#0b5ed7'}
            onMouseOut={(e) => e.target.style.background = '#0d6efd'}
          >
            ✏️ Modifier
          </button>
          
          <button
            onClick={() => onToggleActif(article.id)}
            style={{
              padding: '10px',
              background: article.actif ? '#ffc107' : '#28a745',
              color: article.actif ? '#000' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {article.actif ? '⏸️ Désactiver' : '✅ Activer'}
          </button>
          
          <button
            onClick={() => onDuplicate(article)}
            style={{
              padding: '10px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <ClipboardList size={16} /> Dupliquer
          </button>
          
          <button
            onClick={() => onDelete(article.id)}
            style={{
              padding: '10px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            🗑️ Supprimer
          </button>
        </div>

        {/* Bouton Utiliser dans devis */}
        {onUtiliserDansDevis && (
          <button
            onClick={() => onUtiliserDansDevis(article)}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <FileText size={16} /> Utiliser dans un devis
          </button>
        )}
      </div>

      {/* Modal photos */}
      {showPhotos && article.photos.length > 0 && (
        <div
          onClick={() => setShowPhotos(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            {article.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
