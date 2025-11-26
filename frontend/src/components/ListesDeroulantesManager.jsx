import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical, CheckCircle } from 'lucide-react';
import ListesDeroulantesAPI from '../services/listesDeroulantes.api';
import logger from '../utils/logger';

/**
 * Composant de gestion des listes déroulantes (Admin uniquement)
 * Permet de créer, modifier, supprimer et réorganiser les listes
 */
export default function ListesDeroulantesManager({ isAdmin = false }) {
  const [listes, setListes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    label: '',
    description: '',
    type: 'simple',
    valeurs: [],
    ordre: 0,
    actif: true
  });
  const [newValeur, setNewValeur] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadListes();
    }
  }, [isAdmin]);

  const loadListes = async () => {
    try {
      setLoading(true);
      const data = await ListesDeroulantesAPI.getAll();
      setListes(data || []);
    } catch (error) {
      logger.error('Erreur chargement listes:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors du chargement des listes', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (liste) => {
    setFormData({
      nom: liste.nom,
      label: liste.label,
      description: liste.description || '',
      type: liste.type || 'simple',
      valeurs: [...liste.valeurs],
      ordre: liste.ordre || 0,
      actif: liste.actif !== undefined ? liste.actif : true
    });
    setEditingId(liste.id);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      nom: '',
      label: '',
      description: '',
      type: 'simple',
      valeurs: [],
      ordre: listes.length,
      actif: true
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.nom || !formData.label) {
        if (window.showToast) {
          window.showToast('⚠️ Nom et label sont obligatoires', 'warning');
        }
        return;
      }

      if (formData.valeurs.length === 0) {
        if (window.showToast) {
          window.showToast('⚠️ Ajoutez au moins une valeur', 'warning');
        }
        return;
      }

      if (editingId) {
        await ListesDeroulantesAPI.update(editingId, formData);
        if (window.showToast) {
          window.showToast('✅ Liste modifiée', 'success');
        }
      } else {
        await ListesDeroulantesAPI.create(formData);
        if (window.showToast) {
          window.showToast('✅ Liste créée', 'success');
        }
      }

      setShowForm(false);
      loadListes();
    } catch (error) {
      logger.error('Erreur sauvegarde liste:', error);
      if (window.showToast) {
        window.showToast(`❌ ${error.response?.data?.message || 'Erreur lors de la sauvegarde'}`, 'error');
      }
    }
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Supprimer la liste "${nom}" ?`)) {
      return;
    }

    try {
      await ListesDeroulantesAPI.delete(id);
      if (window.showToast) {
        window.showToast('✅ Liste supprimée', 'success');
      }
      loadListes();
    } catch (error) {
      logger.error('Erreur suppression liste:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la suppression', 'error');
      }
    }
  };

  const handleAddValeur = () => {
    if (newValeur.trim()) {
      setFormData({
        ...formData,
        valeurs: [...formData.valeurs, newValeur.trim()]
      });
      setNewValeur('');
    }
  };

  const handleRemoveValeur = (index) => {
    setFormData({
      ...formData,
      valeurs: formData.valeurs.filter((_, i) => i !== index)
    });
  };

  const handleMoveValeur = (index, direction) => {
    const newValeurs = [...formData.valeurs];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newValeurs.length) {
      [newValeurs[index], newValeurs[newIndex]] = [newValeurs[newIndex], newValeurs[index]];
      setFormData({ ...formData, valeurs: newValeurs });
    }
  };

  const handleInitialize = async () => {
    if (!confirm('Initialiser les listes par défaut ? Les listes existantes ne seront pas modifiées.')) {
      return;
    }

    try {
      await ListesDeroulantesAPI.initialize();
      if (window.showToast) {
        window.showToast('✅ Listes initialisées', 'success');
      }
      loadListes();
    } catch (error) {
      logger.error('Erreur initialisation:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de l\'initialisation', 'error');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-300">
          ⚠️ Accès réservé aux administrateurs
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        <p className="mt-4 text-slate-500">Chargement des listes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestion des Listes Déroulantes
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Créez et gérez les listes déroulantes utilisées dans l'application
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInitialize}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            Initialiser par défaut
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nouvelle Liste</span>
          </button>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? 'Modifier la liste' : 'Nouvelle liste'}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nom technique *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  disabled={!!editingId}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-900"
                  placeholder="domaines"
                />
                <p className="text-xs text-slate-500 mt-1">Identifiant unique (non modifiable après création)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Label affiché *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Domaines"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={2}
                placeholder="Description de la liste..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="simple">Simple</option>
                  <option value="hierarchique">Hiérarchique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ordre
                </label>
                <input
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                    className="w-5 h-5 text-brand rounded"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Actif</span>
                </label>
              </div>
            </div>

            {/* Gestion des valeurs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Valeurs *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newValeur}
                  onChange={(e) => setNewValeur(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddValeur()}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Nouvelle valeur..."
                />
                <button
                  onClick={handleAddValeur}
                  className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Liste des valeurs */}
              <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                {formData.valeurs.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Aucune valeur. Ajoutez-en au moins une.
                  </p>
                ) : (
                  formData.valeurs.map((valeur, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <GripVertical className="text-slate-400 cursor-move" size={18} />
                      <span className="flex-1 text-slate-900 dark:text-white">{valeur}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMoveValeur(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          title="Déplacer vers le haut"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveValeur(index, 1)}
                          disabled={index === formData.valeurs.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          title="Déplacer vers le bas"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveValeur(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                <span>{editingId ? 'Modifier' : 'Créer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des listes */}
      <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Nom / Label
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Valeurs
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {listes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                  Aucune liste déroulante. Créez-en une ou initialisez les listes par défaut.
                </td>
              </tr>
            ) : (
              listes.map((liste) => (
                <tr key={liste.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {liste.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {liste.nom}
                    </div>
                    {liste.description && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {liste.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                      {liste.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {liste.valeurs?.length || 0} valeur(s)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {liste.actif ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                        <CheckCircle size={12} />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(liste)}
                        className="p-2 text-slate-400 hover:text-brand transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(liste.id, liste.label)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

