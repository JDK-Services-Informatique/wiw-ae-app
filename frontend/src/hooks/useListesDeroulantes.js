import { useState, useEffect } from 'react';
import ListesDeroulantesAPI from '../services/listesDeroulantes.api';
import logger from '../utils/logger';

/**
 * Hook pour charger et utiliser les listes déroulantes depuis l'API
 * Cache les listes pour éviter les appels répétés
 */
export function useListesDeroulantes() {
  const [listes, setListes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadListes();
  }, []);

  const loadListes = async () => {
    try {
      setLoading(true);
      const data = await ListesDeroulantesAPI.getAll();
      
      // Transformer en objet pour accès rapide par nom
      const listesMap = {};
      data.forEach(liste => {
        listesMap[liste.nom] = liste.valeurs || [];
      });
      
      setListes(listesMap);
      setError(null);
    } catch (err) {
      logger.error('Erreur chargement listes déroulantes:', err);
      setError(err);
      // Utiliser les valeurs par défaut en cas d'erreur
      setListes({
        domaines: ['Logements', 'Équipements publics', 'Commerce', 'Bureaux', 'Industrie', 'Santé', 'Autre'],
        types: ['Neuf', 'Réhabilitation', 'Extension', 'Rénovation', 'Autre'],
        metiers: ['Architecte DPLG', 'BET Structure', 'BET Fluides', 'BET Thermique', 'Économiste TCE', 'Bureau de contrôle', 'Autre'],
        statuts_ao: ['Nouveau', 'En cours', 'Gagné', 'Perdu', 'Archivé'],
        types_mission: ['Base', 'Complémentaire', 'Optionnelle'],
        phases: ['CONCEPTION', 'RÉALISATION'],
        tranches: ['FERME', 'CONDITIONNELLE', 'OPTIONNELLE']
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer une liste par son nom
   */
  const getListe = (nom) => {
    return listes[nom] || [];
  };

  /**
   * Récupérer toutes les listes
   */
  const getAllListes = () => {
    return listes;
  };

  return {
    listes,
    loading,
    error,
    getListe,
    getAllListes,
    reload: loadListes
  };
}

