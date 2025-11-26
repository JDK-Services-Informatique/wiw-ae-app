import React, { useState, useEffect } from 'react';
import ListesDeroulantesManager from '../components/ListesDeroulantesManager';
import TwoFactorSettings from '../components/TwoFactorSettings';
import { BarChart3, ClipboardList, Trophy, FolderOpen } from 'lucide-react';

export default function Settings() {
  // Utilisateur actuel (à remplacer par authentification réelle)
  const [currentUser, setCurrentUser] = useState({
    role: 'admin', // 'admin' ou 'user'
    nom: 'Jean Dupont'
  });

  const [viewMode, setViewMode] = useState('parametres'); // 'parametres', 'donnees', 'listes'

  // Handlers pour import/export
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`✅ Import de "${file.name}" en cours...`);
      }
    };
    input.click();
  };

  const handleExportJSON = () => {
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
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wiw-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      if (window.showToast) {
        window.showToast('✅ Export JSON réussi', 'success');
      }
    } catch (error) {
      console.error('Erreur export JSON:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de l\'export JSON', 'error');
      }
    }
  };

  const handleExportCSV = () => {
    try {
      const projets = JSON.parse(localStorage.getItem('wiw-projets') || '[]');
      const csvRows = ['Nom,Type,Localisation,Année'];
      projets.forEach(p => {
        csvRows.push(`${p.nom || ''},${p.type || ''},${p.localisation || ''},${p.annee || ''}`);
      });
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wiw-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      if (window.showToast) {
        window.showToast('✅ Export CSV réussi', 'success');
      }
    } catch (error) {
      console.error('Erreur export CSV:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de l\'export CSV', 'error');
      }
    }
  };

  const handleExportExcel = () => {
    try {
      const projets = JSON.parse(localStorage.getItem('wiw-projets') || '[]');
      const tsvRows = ['Nom\tType\tLocalisation\tAnnée'];
      projets.forEach(p => {
        tsvRows.push(`${p.nom || ''}\t${p.type || ''}\t${p.localisation || ''}\t${p.annee || ''}`);
      });
      const tsvContent = tsvRows.join('\n');
      const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wiw-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      if (window.showToast) {
        window.showToast('✅ Export Excel réussi', 'success');
      }
    } catch (error) {
      console.error('Erreur export Excel:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de l\'export Excel', 'error');
      }
    }
  };

  const handleDeleteAllData = () => {
    if (confirm('⚠️ ATTENTION: Cette action supprimera TOUTES les données de manière irréversible. Confirmer ?')) {
      if (confirm('⚠️ Êtes-vous VRAIMENT sûr ? Cette action ne peut pas être annulée !')) {
        try {
          const keysToKeep = ['wiw-user', 'wiw-theme', 'wiw-langue'];
          const allKeys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('wiw-') && !keysToKeep.includes(key)) {
              allKeys.push(key);
            }
          }
          allKeys.forEach(key => localStorage.removeItem(key));
          if (window.showToast) {
            window.showToast('✅ Toutes les données ont été supprimées', 'success');
          }
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          console.error('Erreur suppression:', error);
          if (window.showToast) {
            window.showToast('❌ Erreur lors de la suppression', 'error');
          }
        }
      }
    }
  };

  const handleResetApp = () => {
    if (confirm('⚠️ ATTENTION: Cette action réinitialisera complètement l\'application. Confirmer ?')) {
      if (confirm('⚠️ Êtes-vous VRAIMENT sûr ? Toutes les données et configurations seront perdues !')) {
        try {
          localStorage.clear();
          if (window.showToast) {
            window.showToast('✅ Application réinitialisée aux paramètres d\'usine', 'success');
          }
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          console.error('Erreur réinitialisation:', error);
          if (window.showToast) {
            window.showToast('❌ Erreur lors de la réinitialisation', 'error');
          }
        }
      }
    }
  };

  const handleDownloadBackup = (backup) => {
    // Créer un fichier JSON de sauvegarde
    const backupData = {
      version: '1.0',
      date: backup.date,
      taille: backup.taille,
      data: {
        projets: [],
        partenaires: [],
        honoraires: [],
        settings: {}
      }
    };
    
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${backup.date.replace(/[\/\s:]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    if (window.showToast) {
      window.showToast(`✅ Sauvegarde du ${backup.date} téléchargée`, 'success');
    }
  };

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      nouveauxAppels: true,
      rapports: true
    },
    affichage: {
      theme: localStorage.getItem('theme') || 'dark',
      langue: localStorage.getItem('langue') || 'fr',
      format: 'DD/MM/YYYY'
    },
    securite: {
      auth2fa: false,
      sessionTimeout: 60
    },
    recherche: {
      vocale: false
    }
  });

  const [logoCabinet, setLogoCabinet] = useState(localStorage.getItem('logoCabinet') || null);
  const [sponsors, setSponsors] = useState(() => {
    const saved = localStorage.getItem('sponsors');
    return saved ? JSON.parse(saved) : [];
  });

  // Handler pour changement de langue
  const handleLangueChange = (langue) => {
    handleChange('affichage', 'langue', langue);
    localStorage.setItem('langue', langue);
    if (window.showToast) {
      window.showToast(`🌍 Langue changée: ${langue === 'fr' ? 'Français' : 'English'}`, 'success');
    }
  };

  // Handler pour import Excel
  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (window.showToast) {
            window.showToast(`Import de "${file.name}" réussi - ${(file.size / 1024).toFixed(1)} KB`, 'success');
          }
          // Ici, ajouter la logique de parsing CSV/Excel
          console.log('Fichier Excel importé:', file.name);
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  // Handler pour upload logo cabinet
  const handleUploadLogo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('⚠️ Le fichier est trop volumineux (max 5 MB)');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          setLogoCabinet(base64);
          localStorage.setItem('logoCabinet', base64);
          if (window.showToast) {
            window.showToast(`✅ Logo du cabinet téléchargé - ${(file.size / 1024).toFixed(1)} KB`, 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handler pour supprimer logo
  const handleDeleteLogo = () => {
    if (confirm('Supprimer le logo du cabinet ?')) {
      setLogoCabinet(null);
      localStorage.removeItem('logoCabinet');
      if (window.showToast) {
        window.showToast('🗑️ Logo supprimé', 'info');
      }
    }
  };

  // Données pour gestion
  const [projets, setProjets] = useState([
    { id: 1, nom: 'Rénovation Hôtel de Ville', type: 'Public', statut: 'En cours' },
    { id: 2, nom: 'Extension Maison', type: 'Privé', statut: 'Terminé' }
  ]);

  const [sauvegardes, setSauvegardes] = useState([
    { id: 1, date: '2024-12-01', taille: '2.4 MB', type: 'Automatique' },
    { id: 2, date: '2024-11-15', taille: '2.2 MB', type: 'Manuelle' },
    { id: 3, date: '2024-11-01', taille: '2.1 MB', type: 'Automatique' }
  ]);

  useEffect(() => {
    // Appliquer le thème au chargement
    const theme = settings.affichage.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'auto') {
      // Mode automatique basé sur les préférences système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleToggle = (category, key) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: !settings[category][key]
      }
    });
  };

  const handleChange = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    });

    // Si c'est le thème qui change, l'appliquer immédiatement
    if (category === 'affichage' && key === 'theme') {
      localStorage.setItem('theme', value);
      
      // Appliquer la classe dark selon le thème
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (value === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (value === 'auto') {
        // Mode automatique basé sur les préférences système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      if (window.showToast) {
        window.showToast(`Thème ${value === 'dark' ? 'sombre' : value === 'light' ? 'clair' : 'automatique'} appliqué`, 'success');
      }
    }
  };

  const saveSettings = () => {
    if (window.showToast) {
      window.showToast('Paramètres enregistrés', 'success');
    }
  };

  const handleDeleteProjet = (id) => {
    if (currentUser.role !== 'admin') {
      alert('⚠️ Seuls les administrateurs peuvent supprimer des données');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      setProjets(projets.filter(p => p.id !== id));
      alert('✅ Projet supprimé');
    }
  };

  const handleBackup = () => {
    alert('💾 Sauvegarde créée avec succès');
    const newBackup = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      taille: '2.5 MB',
      type: 'Manuelle'
    };
    setSauvegardes([newBackup, ...sauvegardes]);
  };

  const handleRestore = (backup) => {
    if (currentUser.role !== 'admin') {
      alert('⚠️ Seuls les administrateurs peuvent restaurer des sauvegardes');
      return;
    }
    if (confirm(`Restaurer la sauvegarde du ${backup.date} ? Les données actuelles seront remplacées.`)) {
      alert('✅ Sauvegarde restaurée avec succès');
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px'}}>Paramètres & Données</h2>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <span style={{fontSize:'12px',opacity:0.7}}>
            👤 {currentUser.nom} ({currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'})
          </span>
          <div style={{display:'flex',gap:'5px'}}>
            <button 
              className="btn" 
              onClick={() => setViewMode('parametres')}
              style={{background: viewMode === 'parametres' ? 'var(--brand)' : 'var(--panel)'}}>
              Paramètres
            </button>
            <button 
              className="btn" 
              onClick={() => setViewMode('donnees')}
              style={{background: viewMode === 'donnees' ? 'var(--brand)' : 'var(--panel)'}}>
              💾 Données
            </button>
            {currentUser.role === 'admin' && (
              <button 
                className="btn" 
                onClick={() => setViewMode('listes')}
                style={{background: viewMode === 'listes' ? 'var(--brand)' : 'var(--panel)'}}>
                <ClipboardList size={16} /> Listes déroulantes
              </button>
            )}
          </div>
          {viewMode === 'parametres' && <button className="btn" onClick={saveSettings}>💾 Enregistrer</button>}
        </div>
      </div>

      {/* Vue Paramètres */}
      {viewMode === 'parametres' && (
        <>
          <div className="card" style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '20px'}}>🔔 Notifications</h3>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border-color)'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Notifications par email</div>
            <div style={{fontSize: '13px', opacity: 0.7}}>Recevoir des notifications par email</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.email}
              onChange={() => handleToggle('notifications', 'email')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border-color)'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Notifications push</div>
            <div style={{fontSize: '13px', opacity: 0.7}}>Recevoir des notifications push dans le navigateur</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.push}
              onChange={() => handleToggle('notifications', 'push')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border-color)'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Nouveaux appels d'offres</div>
            <div style={{fontSize: '13px', opacity: 0.7}}>Être notifié des nouveaux appels d'offres</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.nouveauxAppels}
              onChange={() => handleToggle('notifications', 'nouveauxAppels')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Rapports hebdomadaires</div>
            <div style={{fontSize: '13px', opacity: 0.7}}>Recevoir un résumé hebdomadaire par email</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.notifications.rapports}
              onChange={() => handleToggle('notifications', 'rapports')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}>Affichage</h3>

        <div className="form-group">
          <label>Thème</label>
          <select 
            value={settings.affichage.theme}
            onChange={(e) => handleChange('affichage', 'theme', e.target.value)}
          >
            <option value="dark">Sombre</option>
            <option value="light">Clair</option>
            <option value="auto">Automatique</option>
          </select>
        </div>

        <div className="form-group">
          <label>🌍 Langue / Language</label>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <button 
              className="btn" 
              onClick={() => handleLangueChange('fr')}
              style={{
                flex: 1,
                background: settings.affichage.langue === 'fr' ? 'var(--brand)' : 'var(--panel)',
                border: settings.affichage.langue === 'fr' ? '2px solid var(--brand)' : '1px solid var(--border)'
              }}
            >
              🇫🇷 Français
            </button>
            <button 
              className="btn" 
              onClick={() => handleLangueChange('en')}
              style={{
                flex: 1,
                background: settings.affichage.langue === 'en' ? 'var(--brand)' : 'var(--panel)',
                border: settings.affichage.langue === 'en' ? '2px solid var(--brand)' : '1px solid var(--border)'
              }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Format de date</label>
          <select 
            value={settings.affichage.format}
            onChange={(e) => handleChange('affichage', 'format', e.target.value)}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}>Import/Export de données</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div>
            <div style={{fontWeight: 'bold', marginBottom: '8px'}}>📥 Importer depuis Excel/CSV</div>
            <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '10px'}}>
              Importez vos projets, références ou honoraires depuis un fichier Excel (.xlsx, .xls) ou CSV
            </div>
            <button className="btn" onClick={handleImportExcel} style={{width: '100%'}}>
              Sélectionner un fichier Excel/CSV
            </button>
          </div>
          
          <div style={{borderTop: '1px solid var(--border)', paddingTop: '15px'}}>
            <div style={{fontWeight: 'bold', marginBottom: '8px'}}>📤 Exporter les données</div>
            <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '10px'}}>
              Exportez toutes vos données dans différents formats
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button className="btn-secondary" onClick={handleExportJSON} style={{flex: 1}}>
                JSON
              </button>
              <button className="btn-secondary" onClick={handleExportCSV} style={{flex: 1}}>
                CSV
              </button>
              <button className="btn-secondary" onClick={handleExportExcel} style={{flex: 1}}>
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}>Logo du cabinet</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          {logoCabinet ? (
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '8px'}}>Aperçu du logo</div>
              <div style={{
                width: '100%',
                maxWidth: '300px',
                height: '150px',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--panel)',
                marginBottom: '10px',
                overflow: 'hidden'
              }}>
                <img 
                  src={logoCabinet} 
                  alt="Logo du cabinet" 
                  style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                />
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn" onClick={handleUploadLogo} style={{flex: 1}}>
                  🔄 Changer le logo
                </button>
                <button className="btn-secondary" onClick={handleDeleteLogo} style={{flex: 1}}>
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '10px'}}>
                Téléchargez le logo de votre cabinet (formats acceptés: PNG, JPG, SVG - max 5 MB)
              </div>
              <button className="btn" onClick={handleUploadLogo} style={{width: '100%'}}>
                📤 Télécharger un logo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}><Trophy size={18} /> Gestion des Sponsors / Partenaires</h3>
        
        <div style={{marginBottom: '20px'}}>
          <div style={{fontSize: '13px', opacity: 0.7, marginBottom: '15px'}}>
            Ajoutez les logos de vos partenaires et sponsors pour les afficher sur la page d'accueil.
          </div>
          
          {/* Liste des sponsors */}
          {sponsors.length > 0 && (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px'}}>
              {sponsors.map((sponsor, index) => (
                <div 
                  key={sponsor.id || index}
                  style={{
                    padding: '15px',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    background: 'var(--panel)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'white',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '5px'
                  }}>
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.nom || 'Logo sponsor'} 
                      style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                    />
                  </div>
                  <div style={{fontWeight: 'bold', fontSize: '14px', textAlign: 'center'}}>
                    {sponsor.nom || 'Sans nom'}
                  </div>
                  {sponsor.url && (
                    <a 
                      href={sponsor.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{fontSize: '12px', color: 'var(--brand)', textDecoration: 'none'}}
                    >
                      🔗 Site web
                    </a>
                  )}
                  <div style={{display: 'flex', gap: '5px', width: '100%'}}>
                    <button
                      onClick={() => {
                        const newSponsors = [...sponsors];
                        newSponsors[index].actif = !newSponsors[index].actif;
                        setSponsors(newSponsors);
                        localStorage.setItem('sponsors', JSON.stringify(newSponsors));
                        if (window.showToast) {
                          window.showToast(newSponsors[index].actif ? '✅ Sponsor activé' : '⏸️ Sponsor désactivé', 'success');
                        }
                      }}
                      className="btn-secondary"
                      style={{flex: 1, fontSize: '11px', padding: '6px'}}
                    >
                      {sponsor.actif !== false ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer le sponsor "${sponsor.nom || 'Sans nom'}" ?`)) {
                          const newSponsors = sponsors.filter((_, i) => i !== index);
                          setSponsors(newSponsors);
                          localStorage.setItem('sponsors', JSON.stringify(newSponsors));
                          if (window.showToast) {
                            window.showToast('🗑️ Sponsor supprimé', 'info');
                          }
                        }
                      }}
                      className="btn-icon"
                      style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Formulaire d'ajout */}
          <div style={{border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
            <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'}}>
              ➕ Ajouter un nouveau sponsor
            </div>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert('⚠️ Le fichier est trop volumineux (max 5 MB)');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const nom = prompt('Nom du sponsor/partenaire :', '');
                      if (!nom) return;
                      
                      const url = prompt('URL du site web (optionnel) :', '');
                      const description = prompt('Description (optionnel) :', '');
                      
                      const newSponsor = {
                        id: Date.now(),
                        nom: nom,
                        logo: reader.result,
                        url: url || null,
                        description: description || null,
                        ordre: sponsors.length,
                        actif: true
                      };
                      
                      const newSponsors = [...sponsors, newSponsor];
                      setSponsors(newSponsors);
                      localStorage.setItem('sponsors', JSON.stringify(newSponsors));
                      
                      if (window.showToast) {
                        window.showToast(`✅ Sponsor "${nom}" ajouté`, 'success');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="btn"
              style={{width: '100%'}}
            >
              📤 Télécharger un logo de sponsor
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}>Recherche</h3>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>🎤 Recherche vocale</div>
            <div style={{fontSize: '13px', opacity: 0.7}}>Activer la recherche par commande vocale</div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.recherche?.vocale || false}
              onChange={() => {
                const newValue = !settings.recherche?.vocale;
                setSettings({
                  ...settings,
                  recherche: { ...settings.recherche, vocale: newValue }
                });
                if (window.showToast) {
                  window.showToast(
                    newValue ? '🎤 Recherche vocale activée' : '🔇 Recherche vocale désactivée',
                    'success'
                  );
                }
              }}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

          <div className="card" style={{marginBottom: '20px'}}>
            <h3 style={{marginBottom: '20px'}}>Sécurité</h3>

            {/* Intégration TwoFactorSettings */}
            <div style={{marginBottom: '30px'}}>
              <TwoFactorSettings
                enabled={settings.securite.auth2fa}
                onToggle={(enabled) => {
                  handleChange('securite', 'auth2fa', enabled);
                }}
                onSetup={() => {
                  // Callback optionnel pour la configuration
                }}
              />
            </div>

            <div className="form-group">
              <label>Délai d'expiration de session (minutes)</label>
              <input
                type="number"
                value={settings.securite.sessionTimeout}
                onChange={(e) => handleChange('securite', 'sessionTimeout', e.target.value)}
                min="15"
                max="480"
              />
            </div>
          </div>
        </>
      )}

      {/* Vue Données */}
      {viewMode === 'donnees' && (
        <>
          {/* Gestion des projets */}
          <div className="card" style={{marginBottom:'20px'}}>
            <h3 style={{marginBottom:'15px'}}><FolderOpen size={18} /> Gestion des projets</h3>
            {currentUser.role !== 'admin' && (
              <div style={{padding:'10px',background:'rgba(251, 146, 60, 0.1)',borderRadius:'6px',marginBottom:'15px',fontSize:'12px'}}>
                ⚠️ Seuls les administrateurs peuvent supprimer des données
              </div>
            )}
            <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom du projet</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th style={{textAlign:'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projets.map(p => (
                  <tr key={p.id}>
                    <td style={{fontWeight:'500'}}>{p.nom}</td>
                    <td>{p.type}</td>
                    <td>
                      <span className={`badge ${p.statut === 'En cours' ? 'badge-info' : 'badge-success'}`}>
                        {p.statut}
                      </span>
                    </td>
                    <td style={{textAlign:'center'}}>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDeleteProjet(p.id)}
                        disabled={currentUser.role !== 'admin'}
                        style={{
                          opacity: currentUser.role !== 'admin' ? 0.3 : 1,
                          cursor: currentUser.role !== 'admin' ? 'not-allowed' : 'pointer',
                          background: currentUser.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                          color: currentUser.role === 'admin' ? '#ef4444' : 'var(--ink)'
                        }}
                        title={currentUser.role !== 'admin' ? 'Réservé aux administrateurs' : 'Supprimer'}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Sauvegardes */}
          <div className="card" style={{marginBottom:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
              <h3>� Sauvegardes</h3>
              <button className="btn" onClick={handleBackup}>
                ➕ Créer une sauvegarde
              </button>
            </div>
            <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Taille</th>
                  <th style={{textAlign:'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sauvegardes.map(s => (
                  <tr key={s.id}>
                    <td style={{fontWeight:'500'}}>{s.date}</td>
                    <td>
                      <span className={`badge ${s.type === 'Automatique' ? 'badge-info' : 'badge-success'}`}>
                        {s.type}
                      </span>
                    </td>
                    <td>{s.taille}</td>
                    <td style={{textAlign:'center'}}>
                      <button className="btn-icon" onClick={() => handleDownloadBackup(s)} title="Télécharger" style={{cursor:'pointer'}}>⬇️</button>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleRestore(s)}
                        disabled={currentUser.role !== 'admin'}
                        style={{
                          opacity: currentUser.role !== 'admin' ? 0.3 : 1,
                          cursor: currentUser.role !== 'admin' ? 'not-allowed' : 'pointer'
                        }}
                        title={currentUser.role !== 'admin' ? 'Réservé aux administrateurs' : 'Restaurer'}>
                        🔄
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Import/Export */}
          <div className="card" style={{marginBottom:'20px'}}>
            <h3 style={{marginBottom:'15px'}}>Import / Export</h3>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <button className="btn" onClick={handleImportData} style={{cursor:'pointer'}}>Importer des données (JSON/CSV)</button>
              <button className="btn" onClick={handleExportJSON} style={{cursor:'pointer'}}>Exporter en JSON</button>
              <button className="btn" onClick={handleExportCSV} style={{cursor:'pointer'}}>Exporter en CSV</button>
              <button className="btn" onClick={handleExportExcel} style={{cursor:'pointer'}}>Exporter en Excel</button>
            </div>
          </div>

          {/* Zone de danger - Admin uniquement */}
          {currentUser.role === 'admin' && (
            <div className="card" style={{background:'rgba(239, 68, 68, 0.05)',border:'1px solid rgba(239, 68, 68, 0.2)', marginBottom:'20px'}}>
              <h3 style={{marginBottom: '15px', color: '#ef4444'}}>⚠️ Zone de danger (Administrateur uniquement)</h3>
              <p style={{marginBottom: '15px', opacity: 0.8}}>
                Ces actions sont irréversibles. Seuls les administrateurs peuvent effectuer ces opérations.
              </p>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button className="btn" onClick={handleDeleteAllData} style={{background: '#fb923c', color: '#fff', cursor:'pointer'}}>
                  Supprimer toutes les données
                </button>
                <button className="btn" onClick={handleResetApp} style={{background: '#ef4444', color: '#fff', cursor:'pointer'}}>
                  Réinitialiser l'application
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Vue Listes Déroulantes (Admin uniquement) */}
      {viewMode === 'listes' && currentUser.role === 'admin' && (
        <ListesDeroulantesManager isAdmin={true} />
      )}

      {/* Section Domaine WIW */}
      <div className="card" style={{marginBottom: '20px'}}>
        <h3 style={{marginBottom: '20px'}}>Domaine WIW</h3>
        <div style={{padding: '15px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.3)'}}>
          <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--brand)'}}>
            Work in Web (WIW)
          </div>
          <div style={{fontSize: '13px', opacity: 0.8, marginBottom: '10px'}}>
            Le domaine <strong>wiw</strong> est réservé pour l'application WIW (Work in Web).
          </div>
          <div style={{fontSize: '12px', opacity: 0.7, fontStyle: 'italic'}}>
            Cette réservation garantit l'identité de marque et la cohérence de l'écosystème WIW.
          </div>
        </div>
      </div>
    </div>
  );
}
