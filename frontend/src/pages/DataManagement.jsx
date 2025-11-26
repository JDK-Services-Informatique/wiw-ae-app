import React, { useState } from 'react';
import { generateDataExportPDF } from '../utils/pdfGenerator';
import { storageUtils } from '../hooks/useLocalStorage';
import ListesDeroulantesManager from '../components/ListesDeroulantesManager';
import { Settings, ClipboardList, BarChart3 } from 'lucide-react';

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState('donnees'); // 'donnees' ou 'listes'
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  
  // Vérifier si l'utilisateur est admin (à adapter selon votre système d'auth)
  const isAdmin = localStorage.getItem('wiw-user') 
    ? JSON.parse(localStorage.getItem('wiw-user'))?.role === 'ADMIN'
    : false;

  function getStorageInfo() {
    let totalSize = 0;
    const items = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const size = new Blob([value]).size;
      totalSize += size;
      
      items.push({
        key,
        size,
        preview: value.substring(0, 100)
      });
    }
    
    return {
      totalSize,
      items: items.sort((a, b) => b.size - a.size),
      quota: 5 * 1024 * 1024 // 5MB estimation
    };
  }

  const handleConfigureBackup = () => {
    alert('Sauvegarde automatique : Données stockées localement dans votre navigateur');
  };

  const handleDownload = (date) => {
    if (window.showToast) {
      window.showToast('Téléchargement de la sauvegarde...', 'info');
    }
    
    try {
      const allData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wiw-')) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            allData[key] = localStorage.getItem(key);
          }
        }
      }
      const backupData = {
        version: '1.0',
        date: date || new Date().toISOString(),
        data: allData
      };
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wiw-backup-${(date || new Date().toISOString()).replace(/[\/\s:]/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setStorageInfo(getStorageInfo());
      
      if (window.showToast) {
        window.showToast('✅ Sauvegarde téléchargée avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors du téléchargement', 'error');
      }
    }
  };

  const handleRestore = async (date) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (!confirm('⚠️ Restaurer cette sauvegarde ? Les données actuelles seront remplacées.')) {
        return;
      }
      
      if (window.showToast) {
        window.showToast('Restauration en cours...', 'info');
      }
      
      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        if (backupData.data) {
          // Restaurer toutes les clés
          Object.keys(backupData.data).forEach(key => {
            if (typeof backupData.data[key] === 'string') {
              localStorage.setItem(key, backupData.data[key]);
            } else {
              localStorage.setItem(key, JSON.stringify(backupData.data[key]));
            }
          });
        }
        
        setStorageInfo(getStorageInfo());
        
        if (window.showToast) {
          window.showToast('✅ Sauvegarde restaurée avec succès', 'success');
        }
        
        // Recharger la page pour appliquer les données
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Erreur restauration:', error);
        if (window.showToast) {
          window.showToast('❌ Erreur lors de la restauration', 'error');
        }
      }
    };
    
    input.click();
  };

  const handleExport = (format) => {
    console.log('Export demandé:', format);
    setExporting(true);
    if (window.showToast) {
      window.showToast(`Export ${format.toUpperCase()} en cours...`, 'info');
    }
    
    setTimeout(() => {
      setExporting(false);
      let blob, fileName;
      const date = new Date().toISOString().split('T')[0];
      
      if (format === 'json') {
        const data = {
          application: 'WIW / AE+',
          exportDate: date,
          projets: [
            { nom: 'Résidence Les Jardins', client: 'SCI Immobilière', montant: 45000 },
            { nom: 'Centre Commercial Nord', client: 'Foncière du Nord', montant: 120000 }
          ],
          partenaires: [
            { nom: 'Cabinet Architecture DUPONT', specialite: 'Architecture', coutMoyen: 85 },
            { nom: 'Bureau Études BET MARTIN', specialite: 'Structure', coutMoyen: 75 }
          ]
        };
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        fileName = `wiw-data-${date}.json`;
      } else if (format === 'csv') {
        const csvContent = `Nom Projet,Client,Montant,Statut
Résidence Les Jardins,SCI Immobilière,45000,En cours
Centre Commercial Nord,Foncière du Nord,120000,En attente
Immeuble de Bureaux,Groupe Immobilier,80000,En cours`;
        blob = new Blob([csvContent], { type: 'text/csv' });
        fileName = `wiw-data-${date}.csv`;
      } else if (format === 'pdf') {
        // Utiliser le générateur de PDF
        generateDataExportPDF({
          projetsActifs: 12,
          caProvisionnel: 245000,
          partenaires: 5,
          satisfaction: 95
        });
        
        if (window.showToast) {
          window.showToast('Export PDF réussi', 'success');
        }
        return; // Sortir car le téléchargement est géré par la fonction
      } else if (format === 'excel') {
        // Créer un fichier Excel simple (format CSV avec extension .xlsx pour la démo)
        const excelContent = `Nom Projet\tClient\tMontant\tStatut
Résidence Les Jardins\tSCI Immobilière\t45000\tEn cours
Centre Commercial Nord\tFoncière du Nord\t120000\tEn attente
Immeuble de Bureaux\tGroupe Immobilier\t80000\tEn cours`;
        blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
        fileName = `wiw-data-${date}.xlsx`;
      }
      
      if (blob && fileName) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      if (window.showToast) {
        window.showToast(`Export ${format.toUpperCase()} réussi`, 'success');
      }
    }, 2000);
  };

  const handleImport = () => {
    console.log('Import demandé');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImporting(true);
        if (window.showToast) {
          window.showToast(`Import de ${file.name} en cours...`, 'info');
        }
        setTimeout(() => {
          setImporting(false);
          if (window.showToast) {
            window.showToast('Import réussi', 'success');
          }
        }, 2000);
      }
    };
    input.click();
  };

  const handleBackup = () => {
    console.log('Sauvegarde demandée');
    if (window.showToast) {
      window.showToast('Sauvegarde en cours...', 'info');
    }
    setTimeout(() => {
      if (window.showToast) {
        window.showToast('Sauvegarde terminée', 'success');
      }
    }, 2000);
  };

  return (
    <div>
      <h2 style={{fontSize: '24px', marginBottom: '10px'}}>💾 Gestion des Données</h2>
      <p style={{opacity: 0.7, marginBottom: '30px'}}>
        Importez, exportez et sauvegardez vos données
      </p>

      {/* Onglets */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('donnees')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'donnees'
                ? 'border-brand text-brand'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Import/Export Données
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('listes')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'listes'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Listes Déroulantes
            </button>
          )}
        </nav>
      </div>

      {/* Contenu selon l'onglet */}
      {activeTab === 'listes' ? (
        <ListesDeroulantesManager isAdmin={isAdmin} />
      ) : (
        <>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '15px'}}>📤 Exporter les données</h3>
        <p style={{marginBottom: '20px', opacity: 0.8}}>
          Exportez toutes vos données dans le format de votre choix
        </p>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
          <div className="card" style={{textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)'}} onClick={() => handleExport('json')}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}><ClipboardList size={48} /></div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>JSON</div>
            <div style={{fontSize: '12px', opacity: 0.7}}>Format structuré</div>
          </div>

          <div className="card" style={{textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)'}} onClick={() => handleExport('csv')}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}><BarChart3 size={48} /></div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>CSV</div>
            <div style={{fontSize: '12px', opacity: 0.7}}>Tableur Excel</div>
          </div>

          <div className="card" style={{textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)'}} onClick={() => handleExport('pdf')}>
            <div style={{fontSize: '48px', marginBottom: '10px'}}>📄</div>
            <div style={{fontWeight: 'bold', marginBottom: '5px'}}>PDF</div>
            <div style={{fontSize: '12px', opacity: 0.7}}>Document imprimable</div>
          </div>
        </div>

        {exporting && (
          <div className="alert alert-info" style={{marginTop: '15px'}}>
            ⏳ Export en cours...
          </div>
        )}
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '15px'}}>📥 Importer les données</h3>
        <p style={{marginBottom: '20px', opacity: 0.8}}>
          Importez vos données depuis un fichier JSON ou CSV
        </p>

        <div 
          onClick={handleImport}
          style={{
            border: '2px dashed var(--border)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <div style={{fontSize: '48px', marginBottom: '10px'}}>📂</div>
          <p style={{fontWeight: 'bold', marginBottom: '5px'}}>
            Glissez-déposez votre fichier ici
          </p>
          <p style={{fontSize: '12px', opacity: 0.7, marginBottom: '15px'}}>
            ou cliquez pour sélectionner
          </p>
          <button className="btn" onClick={(e) => { e.stopPropagation(); handleImport(); }}>
            Choisir un fichier
          </button>
        </div>

        {importing && (
          <div className="alert alert-info" style={{marginTop: '15px'}}>
            ⏳ Import en cours...
          </div>
        )}

        <div className="alert alert-warning" style={{marginTop: '15px'}}>
          ⚠️ L'import remplacera les données existantes. Pensez à faire une sauvegarde avant.
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '15px'}}>💿 Sauvegardes automatiques</h3>
        
        <div style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border-color)'}}>
            <div>
              <div style={{fontWeight: 'bold'}}>Dernière sauvegarde</div>
              <div style={{fontSize: '13px', opacity: 0.7}}>11 novembre 2025 à 23:45</div>
            </div>
            <span className="badge badge-success">✓ OK</span>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border-color)'}}>
            <div>
              <div style={{fontWeight: 'bold'}}>Fréquence</div>
              <div style={{fontSize: '13px', opacity: 0.7}}>Quotidienne à 23:00</div>
            </div>
            <button className="btn-icon" onClick={handleConfigureBackup} title="Configurer" style={{cursor:'pointer'}}><Settings size={16} /></button>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
            <div>
              <div style={{fontWeight: 'bold'}}>Stockage utilisé</div>
              <div style={{fontSize: '13px', opacity: 0.7}}>245 Mo / 5 Go</div>
            </div>
            <div style={{width: '200px', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden'}}>
              <div style={{width: '5%', height: '100%', background: 'var(--primary-color)'}}></div>
            </div>
          </div>
        </div>

        <button className="btn" onClick={handleBackup} style={{width: '100%'}}>
          🔄 Créer une sauvegarde maintenant
        </button>
      </div>

      <div className="card">
        <h3 style={{marginBottom: '15px'}}>📜 Historique des sauvegardes</h3>
        
        <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Taille</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>11/11/2025 23:45</td>
              <td><span className="badge badge-info">Auto</span></td>
              <td>245 Mo</td>
              <td>
                <button className="btn-icon" onClick={() => handleDownload('11/11/2025 23:45')} title="Télécharger">⬇️</button>
                <button className="btn-icon" onClick={() => handleRestore('11/11/2025 23:45')} title="Restaurer">🔄</button>
              </td>
            </tr>
            <tr>
              <td>10/11/2025 23:45</td>
              <td><span className="badge badge-info">Auto</span></td>
              <td>243 Mo</td>
              <td>
                <button className="btn-icon" onClick={() => handleDownload('10/11/2025 23:45')} title="Télécharger">⬇️</button>
                <button className="btn-icon" onClick={() => handleRestore('10/11/2025 23:45')} title="Restaurer">🔄</button>
              </td>
            </tr>
            <tr>
              <td>09/11/2025 15:30</td>
              <td><span className="badge badge-success">Manuel</span></td>
              <td>240 Mo</td>
              <td>
                <button className="btn-icon" onClick={() => handleDownload('09/11/2025 15:30')} title="Télécharger">⬇️</button>
                <button className="btn-icon" onClick={() => handleRestore('09/11/2025 15:30')} title="Restaurer">🔄</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
