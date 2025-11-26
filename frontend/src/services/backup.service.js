/**
 * Service de backup/restore complet des données
 * Permet de sauvegarder et restaurer toutes les données de l'application
 */

const BACKUP_PREFIX = 'wiw-backup-';
const BACKUP_METADATA_KEY = 'wiw-backup-metadata';

/**
 * Liste des clés localStorage à sauvegarder
 */
const DATA_KEYS = [
  'wiw-projets',
  'wiw-tenders',
  'wiw-devis',
  'wiw-team-members',
  'wiw-bets',
  'wiw-missions-conseil',
  'wiw-references',
  'wiw-catalogue-articles',
  'wiw-templates',
  'wiw-company',
  'wiw-settings'
];

/**
 * Créer un backup de toutes les données
 * @param {string} name - Nom du backup (optionnel)
 * @returns {Promise<Object>} Objet contenant les données sauvegardées et les métadonnées
 */
export async function createBackup(name = null) {
  try {
    const backupData = {};
    const timestamp = new Date().toISOString();
    const backupName = name || `Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;

    // Récupérer toutes les données
    DATA_KEYS.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          backupData[key] = JSON.parse(data);
        } catch (e) {
          console.warn(`Erreur lors de la lecture de ${key}:`, e);
          backupData[key] = data; // Garder comme string si JSON invalide
        }
      }
    });

    // Créer l'objet de backup
    const backup = {
      version: '1.0',
      name: backupName,
      timestamp,
      data: backupData,
      keys: DATA_KEYS.filter(key => backupData.hasOwnProperty(key))
    };

    // Sauvegarder dans localStorage avec un ID unique
    const backupId = `${BACKUP_PREFIX}${Date.now()}`;
    localStorage.setItem(backupId, JSON.stringify(backup));

    // Mettre à jour les métadonnées des backups
    const metadata = getBackupMetadata();
    metadata.push({
      id: backupId,
      name: backupName,
      timestamp,
      size: JSON.stringify(backup).length,
      keysCount: backup.keys.length
    });
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(metadata));

    if (window.showToast) {
      window.showToast(`✅ Backup créé : ${backupName}`, 'success');
    }

    return backup;
  } catch (error) {
    console.error('Erreur lors de la création du backup:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la création du backup', 'error');
    }
    throw error;
  }
}

/**
 * Restaurer un backup
 * @param {string} backupId - ID du backup à restaurer
 * @param {boolean} merge - Si true, fusionne avec les données existantes (défaut: false)
 * @returns {Promise<Object>} Objet contenant les résultats de la restauration
 */
export async function restoreBackup(backupId, merge = false) {
  try {
    const backupStr = localStorage.getItem(backupId);
    if (!backupStr) {
      throw new Error(`Backup ${backupId} introuvable`);
    }

    const backup = JSON.parse(backupStr);

    if (!backup.data || !backup.keys) {
      throw new Error('Format de backup invalide');
    }

    const restored = [];
    const errors = [];

    // Restaurer chaque clé
    backup.keys.forEach(key => {
      try {
        if (merge && localStorage.getItem(key)) {
          // Fusionner les données
          const existing = JSON.parse(localStorage.getItem(key));
          const newData = backup.data[key];
          
          if (Array.isArray(existing) && Array.isArray(newData)) {
            // Fusionner les tableaux (éviter les doublons par ID)
            const merged = [...existing];
            newData.forEach(item => {
              const existingIndex = merged.findIndex(e => e.id === item.id);
              if (existingIndex >= 0) {
                merged[existingIndex] = item; // Remplacer
              } else {
                merged.push(item); // Ajouter
              }
            });
            localStorage.setItem(key, JSON.stringify(merged));
          } else {
            // Remplacer complètement
            localStorage.setItem(key, JSON.stringify(newData));
          }
        } else {
          // Remplacer complètement
          localStorage.setItem(key, JSON.stringify(backup.data[key]));
        }
        restored.push(key);
      } catch (error) {
        console.error(`Erreur lors de la restauration de ${key}:`, error);
        errors.push({ key, error: error.message });
      }
    });

    if (window.showToast) {
      if (errors.length === 0) {
        window.showToast(`✅ Backup restauré : ${restored.length} clés restaurées`, 'success');
      } else {
        window.showToast(`⚠️ Backup partiellement restauré : ${restored.length} réussies, ${errors.length} erreurs`, 'warning');
      }
    }

    return {
      success: errors.length === 0,
      restored,
      errors,
      backupName: backup.name,
      timestamp: backup.timestamp
    };
  } catch (error) {
    console.error('Erreur lors de la restauration du backup:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la restauration du backup', 'error');
    }
    throw error;
  }
}

/**
 * Lister tous les backups disponibles
 * @returns {Array} Liste des métadonnées des backups
 */
export function listBackups() {
  try {
    const metadata = getBackupMetadata();
    return metadata.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des backups:', error);
    return [];
  }
}

/**
 * Supprimer un backup
 * @param {string} backupId - ID du backup à supprimer
 * @returns {Promise<boolean>} True si la suppression a réussi
 */
export async function deleteBackup(backupId) {
  try {
    localStorage.removeItem(backupId);
    
    // Mettre à jour les métadonnées
    const metadata = getBackupMetadata();
    const updatedMetadata = metadata.filter(m => m.id !== backupId);
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(updatedMetadata));

    if (window.showToast) {
      window.showToast('✅ Backup supprimé', 'success');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du backup:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de la suppression du backup', 'error');
    }
    throw error;
  }
}

/**
 * Exporter un backup en fichier JSON
 * @param {string} backupId - ID du backup à exporter
 * @param {string} fileName - Nom du fichier (optionnel)
 * @returns {Promise<void>}
 */
export async function exportBackupToFile(backupId, fileName = null) {
  try {
    const backupStr = localStorage.getItem(backupId);
    if (!backupStr) {
      throw new Error(`Backup ${backupId} introuvable`);
    }

    const backup = JSON.parse(backupStr);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `${backup.name || 'backup'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.showToast) {
      window.showToast('✅ Backup exporté avec succès', 'success');
    }
  } catch (error) {
    console.error('Erreur lors de l\'export du backup:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de l\'export du backup', 'error');
    }
    throw error;
  }
}

/**
 * Importer un backup depuis un fichier JSON
 * @param {File} file - Fichier JSON à importer
 * @returns {Promise<Object>} Objet contenant les résultats de l'import
 */
export async function importBackupFromFile(file) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          if (!backup.data || !backup.keys) {
            throw new Error('Format de backup invalide');
          }

          // Sauvegarder le backup importé
          const backupId = `${BACKUP_PREFIX}${Date.now()}`;
          localStorage.setItem(backupId, JSON.stringify(backup));

          // Mettre à jour les métadonnées
          const metadata = getBackupMetadata();
          metadata.push({
            id: backupId,
            name: backup.name || `Import_${new Date().toISOString().split('T')[0]}`,
            timestamp: backup.timestamp || new Date().toISOString(),
            size: JSON.stringify(backup).length,
            keysCount: backup.keys.length
          });
          localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(metadata));

          if (window.showToast) {
            window.showToast('✅ Backup importé avec succès', 'success');
          }

          resolve({
            success: true,
            backupId,
            backup
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Erreur lors de l\'import du backup:', error);
    if (window.showToast) {
      window.showToast('❌ Erreur lors de l\'import du backup', 'error');
    }
    throw error;
  }
}

/**
 * Obtenir les métadonnées des backups
 * @returns {Array} Liste des métadonnées
 */
function getBackupMetadata() {
  try {
    const metadataStr = localStorage.getItem(BACKUP_METADATA_KEY);
    return metadataStr ? JSON.parse(metadataStr) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des métadonnées:', error);
    return [];
  }
}

/**
 * Nettoyer les anciens backups (garder seulement les N plus récents)
 * @param {number} keepCount - Nombre de backups à garder (défaut: 10)
 * @returns {Promise<number>} Nombre de backups supprimés
 */
export async function cleanupOldBackups(keepCount = 10) {
  try {
    const metadata = getBackupMetadata();
    const sorted = metadata.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (sorted.length <= keepCount) {
      return 0;
    }

    const toDelete = sorted.slice(keepCount);
    let deletedCount = 0;

    toDelete.forEach(backup => {
      try {
        localStorage.removeItem(backup.id);
        deletedCount++;
      } catch (error) {
        console.error(`Erreur lors de la suppression de ${backup.id}:`, error);
      }
    });

    // Mettre à jour les métadonnées
    const updatedMetadata = sorted.slice(0, keepCount);
    localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify(updatedMetadata));

    if (window.showToast) {
      window.showToast(`✅ ${deletedCount} ancien(s) backup(s) supprimé(s)`, 'success');
    }

    return deletedCount;
  } catch (error) {
    console.error('Erreur lors du nettoyage des backups:', error);
    throw error;
  }
}

export default {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup,
  exportBackupToFile,
  importBackupFromFile,
  cleanupOldBackups
};

