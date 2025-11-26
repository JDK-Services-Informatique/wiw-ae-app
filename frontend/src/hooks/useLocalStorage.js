import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer localStorage avec React state
 * @param {string} key - Clé de stockage
 * @param {any} initialValue - Valeur par défaut
 * @returns {[any, Function]} - [valeur, fonction de mise à jour]
 */
export function useLocalStorage(key, initialValue) {
  // Initialisation : récupérer depuis localStorage ou utiliser valeur par défaut
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage [${key}]:`, error);
      return initialValue;
    }
  });

  // Fonction de mise à jour qui synchronise state + localStorage
  const setValue = (value) => {
    try {
      // Accepter fonction comme React setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur écriture localStorage [${key}]:`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook pour synchroniser localStorage entre onglets
 */
export function useLocalStorageSync(key, setValue) {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erreur sync localStorage [${key}]:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, setValue]);
}

/**
 * Utilitaires pour export/import de données
 */
export const storageUtils = {
  // Exporter toutes les données en JSON
  exportAll: () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        data[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  },

  // Importer des données JSON
  importAll: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Erreur import [${key}]:`, error);
      }
    });
  },

  // Télécharger backup JSON
  downloadBackup: () => {
    const data = storageUtils.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiw-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Charger backup depuis fichier
  loadBackup: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          storageUtils.importAll(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  // Effacer toutes les données
  clearAll: () => {
    localStorage.clear();
  }
};
