/**
 * EXEMPLES D'UTILISATION - Hook useLocalStorage
 * 
 * Ce fichier contient des exemples pratiques d'utilisation du hook
 * pour différents cas d'usage dans l'application WIW / AE+ Light
 */

import { useLocalStorage, storageUtils } from '../hooks/useLocalStorage';

// ============================================
// 1️⃣ EXEMPLE SIMPLE : Liste de tâches
// ============================================

function TodoList() {
  const [todos, setTodos] = useLocalStorage('wiw-todos', []);
  const [inputValue, setInputValue] = useState('');
  
  const handleAdd = () => {
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      done: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };
  
  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };
  
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={handleAdd}>Ajouter</button>
      
      {todos.map(todo => (
        <div key={todo.id}>
          <input 
            type="checkbox" 
            checked={todo.done} 
            onChange={() => handleToggle(todo.id)} 
          />
          <span style={{textDecoration: todo.done ? 'line-through' : 'none'}}>
            {todo.text}
          </span>
          <button onClick={() => handleDelete(todo.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 2️⃣ CLIENTS / MOA (Maîtres d'ouvrage)
// ============================================

function ClientsLight() {
  const [clients, setClients] = useLocalStorage('wiw-clients', []);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    type: 'particulier' // particulier, entreprise, collectivite
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newClient = {
      ...formData,
      id: Date.now(),
      dateCreation: new Date().toISOString(),
      projetsActifs: 0
    };
    
    setClients([...clients, newClient]);
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      type: 'particulier'
    });
    
    if (window.showToast) {
      window.showToast(`✅ Client "${newClient.nom}" ajouté`, 'success');
    }
  };
  
  const handleUpdate = (id, updatedData) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, ...updatedData } : c
    ));
  };
  
  const handleDelete = (id) => {
    if (confirm('Supprimer ce client ?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };
  
  // Statistiques
  const stats = {
    total: clients.length,
    particuliers: clients.filter(c => c.type === 'particulier').length,
    entreprises: clients.filter(c => c.type === 'entreprise').length,
    collectivites: clients.filter(c => c.type === 'collectivite').length
  };
  
  return (
    <div>
      <h2>Base Clients - {stats.total} entrées</h2>
      
      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit}>
        <input 
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          placeholder="Nom du client"
          required
        />
        <input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
        />
        <input 
          type="tel"
          value={formData.telephone}
          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
          placeholder="Téléphone"
        />
        <select 
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="particulier">Particulier</option>
          <option value="entreprise">Entreprise</option>
          <option value="collectivite">Collectivité</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>
      
      {/* Liste des clients */}
      <div>
        {clients.map(client => (
          <div key={client.id} style={{border: '1px solid #ddd', padding: '10px', margin: '10px 0'}}>
            <h3>{client.nom}</h3>
            <p>📧 {client.email}</p>
            <p>📞 {client.telephone}</p>
            <p>🏷️ {client.type}</p>
            <button onClick={() => handleDelete(client.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 3️⃣ MAÎTRES D'ŒUVRE (Architectes)
// ============================================

function MaitresOeuvreLight() {
  const [maitresOeuvre, setMaitresOeuvre] = useLocalStorage('wiw-moe', []);
  
  const [formData, setFormData] = useState({
    nom: '',
    cabinet: '',
    email: '',
    telephone: '',
    specialite: '', // architecture, urbanisme, paysage, etc.
    tauxHoraire: 0,
    ville: '',
    siret: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMOE = {
      ...formData,
      id: Date.now(),
      dateCreation: new Date().toISOString(),
      projetsCollaboratifs: 0,
      notes: ''
    };
    
    setMaitresOeuvre([...maitresOeuvre, newMOE]);
    
    // Reset form
    setFormData({
      nom: '',
      cabinet: '',
      email: '',
      telephone: '',
      specialite: '',
      tauxHoraire: 0,
      ville: '',
      siret: ''
    });
    
    if (window.showToast) {
      window.showToast(`✅ MOE "${newMOE.cabinet}" ajouté`, 'success');
    }
  };
  
  const handleSearch = (query) => {
    return maitresOeuvre.filter(moe => 
      moe.nom.toLowerCase().includes(query.toLowerCase()) ||
      moe.cabinet.toLowerCase().includes(query.toLowerCase()) ||
      moe.specialite.toLowerCase().includes(query.toLowerCase()) ||
      moe.ville.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return (
    <div>
      <h2>Base Maîtres d'Œuvre - {maitresOeuvre.length} contacts</h2>
      
      {/* Formulaire similaire à Clients */}
      <form onSubmit={handleSubmit}>
        {/* Champs du formulaire */}
      </form>
      
      {/* Liste et recherche */}
    </div>
  );
}

// ============================================
// 4️⃣ PARAMÈTRES UTILISATEUR
// ============================================

function SettingsWithStorage() {
  const [settings, setSettings] = useLocalStorage('wiw-settings', {
    theme: 'dark',
    language: 'fr',
    notifications: true,
    autoSave: true,
    displayMode: 'grid', // grid ou list
    itemsPerPage: 20
  });
  
  const handleChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    });
    
    if (window.showToast) {
      window.showToast('✅ Paramètres enregistrés', 'success');
    }
  };
  
  return (
    <div>
      <h2>Paramètres</h2>
      
      <label>
        Thème
        <select 
          value={settings.theme}
          onChange={(e) => handleChange('theme', e.target.value)}
        >
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) => handleChange('notifications', e.target.checked)}
        />
        Notifications activées
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={settings.autoSave}
          onChange={(e) => handleChange('autoSave', e.target.checked)}
        />
        Sauvegarde automatique
      </label>
    </div>
  );
}

// ============================================
// 5️⃣ STATISTIQUES GLOBALES
// ============================================

function StatsGlobales() {
  const [clients] = useLocalStorage('wiw-clients', []);
  const [alertes] = useLocalStorage('wiw-alertes', []);
  const [ao] = useLocalStorage('wiw-ao', []);
  const [references] = useLocalStorage('wiw-references', []);
  
  // Calculer les stats
  const stats = {
    clients: {
      total: clients.length,
      nouveaux: clients.filter(c => {
        const dateCreation = new Date(c.dateCreation);
        const unMoisAgo = new Date();
        unMoisAgo.setMonth(unMoisAgo.getMonth() - 1);
        return dateCreation > unMoisAgo;
      }).length
    },
    alertes: {
      total: alertes.length,
      enRetard: alertes.filter(a => {
        const dateRelance = new Date(a.dateRelance);
        return dateRelance < new Date() && a.statut !== 'terminée';
      }).length,
      aujourdhui: alertes.filter(a => {
        const dateRelance = new Date(a.dateRelance);
        const aujourdhui = new Date();
        return dateRelance.toDateString() === aujourdhui.toDateString();
      }).length
    },
    ao: {
      total: ao.length,
      enCours: ao.filter(a => a.statut === 'en-cours').length,
      gagnes: ao.filter(a => a.statut === 'gagne').length
    },
    references: {
      total: references.length
    }
  };
  
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
      <div className="stat-card">
        <h3>👥 Clients</h3>
        <div className="stat-number">{stats.clients.total}</div>
        <div className="stat-detail">+{stats.clients.nouveaux} ce mois</div>
      </div>
      
      <div className="stat-card">
        <h3>🔔 Alertes</h3>
        <div className="stat-number">{stats.alertes.total}</div>
        <div className="stat-detail">
          {stats.alertes.enRetard} en retard | {stats.alertes.aujourdhui} aujourd'hui
        </div>
      </div>
      
      <div className="stat-card">
        <h3>📋 Appels d'offres</h3>
        <div className="stat-number">{stats.ao.total}</div>
        <div className="stat-detail">
          {stats.ao.enCours} en cours | {stats.ao.gagnes} gagnés
        </div>
      </div>
      
      <div className="stat-card">
        <h3>🏗️ Références</h3>
        <div className="stat-number">{stats.references.total}</div>
      </div>
    </div>
  );
}

// ============================================
// 6️⃣ BACKUP AUTOMATIQUE (Bonus)
// ============================================

function AutoBackup() {
  const [settings] = useLocalStorage('wiw-settings', { autoBackupDays: 7 });
  const [lastBackup, setLastBackup] = useLocalStorage('wiw-last-backup', null);
  
  useEffect(() => {
    const checkBackup = () => {
      if (!lastBackup) {
        // Premier backup
        doBackup();
        return;
      }
      
      const lastBackupDate = new Date(lastBackup);
      const daysSinceBackup = (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceBackup >= settings.autoBackupDays) {
        doBackup();
      }
    };
    
    const doBackup = () => {
      try {
        storageUtils.downloadBackup();
        setLastBackup(new Date().toISOString());
        
        if (window.showToast) {
          window.showToast('💾 Backup automatique effectué', 'success');
        }
      } catch (error) {
        console.error('Erreur backup auto:', error);
      }
    };
    
    // Vérifier au montage et toutes les heures
    checkBackup();
    const interval = setInterval(checkBackup, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [lastBackup, settings.autoBackupDays, setLastBackup]);
  
  return (
    <div>
      <p>Dernier backup automatique : {lastBackup ? new Date(lastBackup).toLocaleString('fr-FR') : 'Jamais'}</p>
      <p>Prochain backup dans : {/* calculer */} jours</p>
    </div>
  );
}

// ============================================
// 7️⃣ FILTRES & RECHERCHE AVANCÉS
// ============================================

function AdvancedSearch() {
  const [clients] = useLocalStorage('wiw-clients', []);
  const [ao] = useLocalStorage('wiw-ao', []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // all, clients, ao
    dateFrom: null,
    dateTo: null
  });
  
  const getResults = () => {
    let results = [];
    
    // Recherche dans clients
    if (filters.type === 'all' || filters.type === 'clients') {
      const clientResults = clients
        .filter(c => 
          c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(c => ({ ...c, _type: 'client' }));
      results = [...results, ...clientResults];
    }
    
    // Recherche dans AO
    if (filters.type === 'all' || filters.type === 'ao') {
      const aoResults = ao
        .filter(a => 
          a.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(a => ({ ...a, _type: 'ao' }));
      results = [...results, ...aoResults];
    }
    
    // Filtres dates
    if (filters.dateFrom) {
      results = results.filter(r => 
        new Date(r.dateCreation) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      results = results.filter(r => 
        new Date(r.dateCreation) <= new Date(filters.dateTo)
      );
    }
    
    return results;
  };
  
  return (
    <div>
      <input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      
      <select 
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
      >
        <option value="all">Tout</option>
        <option value="clients">Clients uniquement</option>
        <option value="ao">AO uniquement</option>
      </select>
      
      <div>
        {getResults().map(result => (
          <div key={`${result._type}-${result.id}`}>
            <span className="badge">{result._type}</span>
            <span>{result.nom || result.titre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 8️⃣ EXPORT SÉLECTIF
// ============================================

function SelectiveExport() {
  const [clients] = useLocalStorage('wiw-clients', []);
  const [ao] = useLocalStorage('wiw-ao', []);
  const [alertes] = useLocalStorage('wiw-alertes', []);
  
  const [selectedKeys, setSelectedKeys] = useState(['wiw-clients', 'wiw-ao']);
  
  const handleExport = () => {
    const dataToExport = {};
    
    if (selectedKeys.includes('wiw-clients')) {
      dataToExport['wiw-clients'] = clients;
    }
    
    if (selectedKeys.includes('wiw-ao')) {
      dataToExport['wiw-ao'] = ao;
    }
    
    if (selectedKeys.includes('wiw-alertes')) {
      dataToExport['wiw-alertes'] = alertes;
    }
    
    // Télécharger
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiw-export-selectif-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (window.showToast) {
      window.showToast('✅ Export réussi', 'success');
    }
  };
  
  return (
    <div>
      <h3>Choisir les données à exporter</h3>
      
      <label>
        <input 
          type="checkbox"
          checked={selectedKeys.includes('wiw-clients')}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedKeys([...selectedKeys, 'wiw-clients']);
            } else {
              setSelectedKeys(selectedKeys.filter(k => k !== 'wiw-clients'));
            }
          }}
        />
        Clients ({clients.length})
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={selectedKeys.includes('wiw-ao')}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedKeys([...selectedKeys, 'wiw-ao']);
            } else {
              setSelectedKeys(selectedKeys.filter(k => k !== 'wiw-ao'));
            }
          }}
        />
        Appels d'offres ({ao.length})
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={selectedKeys.includes('wiw-alertes')}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedKeys([...selectedKeys, 'wiw-alertes']);
            } else {
              setSelectedKeys(selectedKeys.filter(k => k !== 'wiw-alertes'));
            }
          }}
        />
        Alertes ({alertes.length})
      </label>
      
      <button onClick={handleExport} disabled={selectedKeys.length === 0}>
        💾 Exporter la sélection
      </button>
    </div>
  );
}

// ============================================
// 9️⃣ HOOKS UTILITAIRES
// ============================================

// Hook pour synchroniser un état avec localStorage
function useAutoSave(key, value, delay = 1000) {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, delay);
    
    return () => clearTimeout(timer);
  }, [key, value, delay]);
}

// Hook pour charger des données avec fallback
function useStorageWithFallback(key, defaultValue, fallbackKey = null) {
  const [data, setData] = useLocalStorage(key, defaultValue);
  
  useEffect(() => {
    if (data.length === 0 && fallbackKey) {
      // Essayer de charger depuis une clé de backup
      const fallbackData = localStorage.getItem(fallbackKey);
      if (fallbackData) {
        try {
          setData(JSON.parse(fallbackData));
        } catch (error) {
          console.error('Erreur chargement fallback:', error);
        }
      }
    }
  }, [data, fallbackKey, setData]);
  
  return [data, setData];
}

// ============================================
// 🔟 MIGRATION DEPUIS BACKEND
// ============================================

async function MigrateFromBackend() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleMigrate = async () => {
    setImporting(true);
    setProgress(0);
    
    try {
      // 1. Récupérer les clients
      const clientsResponse = await fetch('/api/clients');
      const clients = await clientsResponse.json();
      localStorage.setItem('wiw-clients', JSON.stringify(clients));
      setProgress(25);
      
      // 2. Récupérer les AO
      const aoResponse = await fetch('/api/ao');
      const ao = await aoResponse.json();
      localStorage.setItem('wiw-ao', JSON.stringify(ao));
      setProgress(50);
      
      // 3. Récupérer les références
      const referencesResponse = await fetch('/api/references');
      const references = await referencesResponse.json();
      localStorage.setItem('wiw-references', JSON.stringify(references));
      setProgress(75);
      
      // 4. Récupérer les alertes
      const alertesResponse = await fetch('/api/alertes');
      const alertes = await alertesResponse.json();
      localStorage.setItem('wiw-alertes', JSON.stringify(alertes));
      setProgress(100);
      
      if (window.showToast) {
        window.showToast('✅ Migration réussie ! Rechargement...', 'success');
      }
      
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error) {
      console.error('Erreur migration:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la migration', 'error');
      }
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div>
      <h3>Migrer depuis le backend</h3>
      <p>Cette opération va importer toutes vos données depuis le serveur vers le stockage local.</p>
      
      <button onClick={handleMigrate} disabled={importing}>
        {importing ? `Migration en cours... ${progress}%` : 'Démarrer la migration'}
      </button>
      
      {importing && (
        <div style={{width: '100%', height: '20px', background: '#e9ecef', borderRadius: '10px', overflow: 'hidden'}}>
          <div style={{width: `${progress}%`, height: '100%', background: '#2e7d32', transition: 'width 0.3s'}} />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

export {
  TodoList,
  ClientsLight,
  MaitresOeuvreLight,
  SettingsWithStorage,
  StatsGlobales,
  AutoBackup,
  AdvancedSearch,
  SelectiveExport,
  useAutoSave,
  useStorageWithFallback,
  MigrateFromBackend
};
