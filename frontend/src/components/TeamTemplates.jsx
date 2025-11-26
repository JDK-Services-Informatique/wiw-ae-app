import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Users, Briefcase, Clock, Euro } from 'lucide-react';
import TeamTemplateAPI from '../services/teamTemplate.api.js';
import logger from '../utils/logger';

/**
 * Composant pour gérer les templates d'équipe
 * Permet de créer, modifier, supprimer et appliquer des templates d'équipe
 */
export default function TeamTemplates({
  onApplyTemplate,
  className = ''
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    domaine: '',
    typeProjet: '',
    membres: [],
    competencesRequises: [],
    budgetEstime: '',
    dureeEstimee: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await TeamTemplateAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      logger.error('Erreur chargement templates:', err);
      if (window.showToast) {
        window.showToast('Erreur lors du chargement des templates', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      domaine: '',
      typeProjet: '',
      membres: [],
      competencesRequises: [],
      budgetEstime: '',
      dureeEstimee: ''
    });
    setEditingTemplate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTemplate) {
        await TeamTemplateAPI.updateTemplate(editingTemplate.id, formData);
        if (window.showToast) {
          window.showToast('Template mis à jour avec succès', 'success');
        }
      } else {
        await TeamTemplateAPI.createTemplate(formData);
        if (window.showToast) {
          window.showToast('Template créé avec succès', 'success');
        }
      }

      resetForm();
      setShowForm(false);
      await loadTemplates();
    } catch (err) {
      logger.error('Erreur sauvegarde template:', err);
      if (window.showToast) {
        window.showToast('Erreur lors de la sauvegarde du template', 'error');
      }
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      nom: template.nom,
      description: template.description || '',
      domaine: template.domaine,
      typeProjet: template.typeProjet,
      membres: template.membres || [],
      competencesRequises: template.competencesRequises || [],
      budgetEstime: template.budgetEstime || '',
      dureeEstimee: template.dureeEstimee || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    try {
      await TeamTemplateAPI.deleteTemplate(templateId);
      if (window.showToast) {
        window.showToast('Template supprimé avec succès', 'success');
      }
      await loadTemplates();
    } catch (err) {
      logger.error('Erreur suppression template:', err);
      if (window.showToast) {
        window.showToast('Erreur lors de la suppression du template', 'error');
      }
    }
  };

  const handleApply = async (template) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
    }
  };

  const addMembre = () => {
    setFormData(prev => ({
      ...prev,
      membres: [...prev.membres, {
        role: '',
        nombre: 1,
        coutHoraire: '',
        heuresEstimees: ''
      }]
    }));
  };

  const updateMembre = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      membres: prev.membres.map((membre, i) =>
        i === index ? { ...membre, [field]: value } : membre
      )
    }));
  };

  const removeMembre = (index) => {
    setFormData(prev => ({
      ...prev,
      membres: prev.membres.filter((_, i) => i !== index)
    }));
  };

  const addCompetence = () => {
    setFormData(prev => ({
      ...prev,
      competencesRequises: [...prev.competencesRequises, '']
    }));
  };

  const updateCompetence = (index, value) => {
    setFormData(prev => ({
      ...prev,
      competencesRequises: prev.competencesRequises.map((comp, i) =>
        i === index ? value : comp
      )
    }));
  };

  const removeCompetence = (index) => {
    setFormData(prev => ({
      ...prev,
      competencesRequises: prev.competencesRequises.filter((_, i) => i !== index)
    }));
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Templates d'Équipe
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Créez et gérez des configurations d'équipe réutilisables
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn flex items-center gap-2"
        >
          <Plus size={16} />
          Nouveau Template
        </button>
      </div>

      {/* Liste des templates */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {template.nom}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase size={14} />
                    <span>{template.domaine}</span>
                    <span>•</span>
                    <span>{template.typeProjet}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {template.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {template.description}
                </p>
              )}

              {/* Informations clés */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {template.membres?.length || 0} membres
                  </span>
                </div>

                {template.budgetEstime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Euro size={14} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(template.budgetEstime)}
                    </span>
                  </div>
                )}

                {template.dureeEstimee && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {template.dureeEstimee}
                    </span>
                  </div>
                )}
              </div>

              {/* Compétences */}
              {template.competencesRequises && template.competencesRequises.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compétences requises:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.competencesRequises.map((competence, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      >
                        {competence}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleApply(template)}
                  className="btn-secondary flex items-center gap-1 text-xs px-3 py-1"
                >
                  <Copy size={12} />
                  Appliquer
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Aucun template d'équipe
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Créez votre premier template pour réutiliser des configurations d'équipe
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="btn"
              >
                Créer un template
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingTemplate ? 'Modifier le template' : 'Nouveau template d\'équipe'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du template *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Domaine *
                  </label>
                  <select
                    value={formData.domaine}
                    onChange={(e) => setFormData(prev => ({ ...prev, domaine: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Sélectionner un domaine</option>
                    <option value="Logements">Logements</option>
                    <option value="Équipements publics">Équipements publics</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Bureaux">Bureaux</option>
                    <option value="Industrie">Industrie</option>
                    <option value="Santé">Santé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de projet *
                  </label>
                  <select
                    value={formData.typeProjet}
                    onChange={(e) => setFormData(prev => ({ ...prev, typeProjet: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Neuf">Neuf</option>
                    <option value="Rénovation">Rénovation</option>
                    <option value="Réhabilitation">Réhabilitation</option>
                    <option value="Extension">Extension</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget estimé (€)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetEstime}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetEstime: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: 150000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                  placeholder="Description du template..."
                />
              </div>

              {/* Membres de l'équipe */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Membres de l'équipe
                  </label>
                  <button
                    type="button"
                    onClick={addMembre}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    + Ajouter un membre
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.membres.map((membre, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <input
                        type="text"
                        placeholder="Rôle (ex: Architecte)"
                        value={membre.role}
                        onChange={(e) => updateMembre(index, 'role', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      />
                      <input
                        type="number"
                        placeholder="Nombre"
                        value={membre.nombre}
                        onChange={(e) => updateMembre(index, 'nombre', parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                        min="1"
                      />
                      <input
                        type="number"
                        placeholder="€/h"
                        value={membre.coutHoraire}
                        onChange={(e) => updateMembre(index, 'coutHoraire', parseFloat(e.target.value))}
                        className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={() => removeMembre(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compétences requises */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compétences requises
                  </label>
                  <button
                    type="button"
                    onClick={addCompetence}
                    className="btn-secondary text-xs px-2 py-1"
                  >
                    + Ajouter une compétence
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.competencesRequises.map((competence, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ex: APD, PRO, DET..."
                        value={competence}
                        onChange={(e) => updateCompetence(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeCompetence(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" className="btn">
                  {editingTemplate ? 'Mettre à jour' : 'Créer le template'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}