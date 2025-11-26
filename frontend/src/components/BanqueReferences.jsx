import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, FileText, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatNumber';
import ReferencesAPI from '../services/references.api';

/**
 * Composant Banque de Références pour Devis
 * Permet de sélectionner des références réutilisables et de les importer rapidement
 */
export default function BanqueReferences({
  onSelectReference, // Callback quand une référence est sélectionnée
  onClose
}) {
  const [references, setReferences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Charger les références
  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    try {
      setLoading(true);
      const data = await ReferencesAPI.getAll();
      setReferences(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des références:', error);
      setReferences([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les références
  const filteredReferences = references.filter(ref => {
    const matchesSearch = !searchTerm || 
      ref.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || ref.categorie === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Catégories uniques
  const categories = ['all', ...new Set(references.map(r => r.categorie).filter(Boolean))];

  // Sélectionner une référence
  const handleSelect = (reference) => {
    if (onSelectReference) {
      // Convertir la référence en ligne de devis
      const ligne = {
        id: Date.now(),
        designation: reference.designation,
        unite: reference.unite,
        puHT: reference.puHT,
        quantite: 1,
        remise: 0,
        referenceId: reference.id // Garder l'ID de référence pour traçabilité
      };
      onSelectReference(ligne);
    }
    if (onClose) {
      onClose();
    }
  };

  // Supprimer une référence
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette référence ?')) {
      try {
        await ReferencesAPI.delete(id);
        setReferences(references.filter(r => r.id !== id));
        if (window.showToast) {
          window.showToast('✅ Référence supprimée', 'success');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        if (window.showToast) {
          window.showToast('❌ Erreur lors de la suppression', 'error');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-panel rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <FileText className="text-brand" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Banque de Références
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filtres */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex gap-3">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une référence..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes les catégories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {filteredReferences.length} référence(s) trouvée(s)
          </div>
        </div>

        {/* Liste des références */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">
              Chargement des références...
            </div>
          ) : filteredReferences.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Aucune référence trouvée</p>
              <p className="text-sm mt-2">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Essayez de modifier vos filtres'
                  : 'Créez des références dans le module Références pour les réutiliser ici'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReferences.map(reference => (
                <div
                  key={reference.id}
                  onClick={() => handleSelect(reference)}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-brand hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {reference.designation}
                      </h3>
                      {reference.categorie && (
                        <span className="inline-block px-2 py-1 text-xs bg-brand/10 text-brand rounded">
                          {reference.categorie}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(reference.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {reference.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {reference.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Unité:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-white">
                          {reference.unite}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand text-lg">
                        {formatCurrency(reference.puHT)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Prix unitaire HT
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
