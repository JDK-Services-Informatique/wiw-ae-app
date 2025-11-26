import React, { useState } from 'react';
import { defaultClients } from '../data/defaultData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePlan } from '../context/PlanContext';
import { LimitReached } from '../components/PlanRestriction';
import VoiceInputButton from '../components/VoiceInputButton';
import { Building2 } from 'lucide-react';

export default function Company() {
  const { canAdd, getPlanInfo } = usePlan();
  const planInfo = getPlanInfo();
  
  const [viewMode, setViewMode] = useState('liste'); // 'liste', 'projets'
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Liste des clients / maîtres d'ouvrage
  const [clients, setClients] = useLocalStorage('wiw-clients', defaultClients);
  
  // Ancien code pour référence (à supprimer après vérification)
  /* const [clients, setClients] = useState([
    {
      id: 1,
      nom: 'Ville de Lyon',
      type: 'Public',
      contact: {
        responsable: 'M. Jean Dupont',
        fonction: 'Directeur Patrimoine',
        telephone: '04 72 10 30 30',
        portable: '06 12 34 56 78',
        email: 'j.dupont@lyon.fr',
        adresse: '1 place de la Comédie',
        codePostal: '69001',
        ville: 'Lyon'
      },
      informationsLegales: {
        siret: '12345678901234',
        tva: 'FR12345678901',
        formeJuridique: 'Collectivité territoriale',
        capital: null
      },
      projets: [
        { id: 1, nom: 'Résidence Les Oliviers', statut: 'En cours', montant: 3500000 },
        { id: 2, nom: 'École Primaire Victor Hugo', statut: 'Terminé', montant: 8500000 }
      ],
      historique: [
        { date: '2023-05-15', projet: 'Résidence Les Oliviers', type: 'Mission complète' },
        { date: '2022-09-20', projet: 'École Primaire Victor Hugo', type: 'Mission complète' }
      ],
      notes: 'Client prioritaire, relation de confiance établie depuis 2020'
    },
    {
      id: 2,
      nom: 'SCI Immobilière Rivoli',
      type: 'Privé',
      contact: {
        responsable: 'M. Marc Dubois',
        fonction: 'Gérant',
        telephone: '01 45 67 89 01',
        portable: '06 23 45 67 89',
        email: 'm.dubois@sci-rivoli.fr',
        adresse: '25 avenue de Rivoli',
        codePostal: '75001',
        ville: 'Paris'
      },
      informationsLegales: {
        siret: '98765432109876',
        tva: 'FR98765432109',
        formeJuridique: 'SCI',
        capital: 500000
      },
      projets: [
        { id: 3, nom: 'Centre Commercial Rivoli', statut: 'En cours', montant: 12000000 }
      ],
      historique: [
        { date: '2024-01-10', projet: 'Centre Commercial Rivoli', type: 'Mission complète' }
      ],
      notes: 'Client récurrent, projets de grande envergure'
    },
    {
      id: 3,
      nom: 'Promoteur Urbanova',
      type: 'Privé',
      contact: {
        responsable: 'M. Bernard',
        fonction: 'PDG',
        telephone: '01 23 45 67 89',
        portable: '06 34 56 78 90',
        email: 'contact@urbanova.fr',
        adresse: '10 rue de la Promotion',
        codePostal: '75008',
        ville: 'Paris'
      },
      informationsLegales: {
        siret: '11223344556677',
        tva: 'FR11223344556',
        formeJuridique: 'SARL',
        capital: 2000000
      },
      projets: [
        { id: 4, nom: 'Immeuble Bureaux Centre-Ville', statut: 'Contrat signé', montant: 8500000 }
      ],
      historique: [
        { date: '2024-07-20', projet: 'Immeuble Bureaux Centre-Ville', type: 'Mission complète' }
      ],
      notes: 'Contrat signé, démarrage janvier 2025'
    }
  ]); */

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const matchSearch = !searchQuery.trim() || 
      client.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact?.responsable?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const handleNewClient = () => {
    if (!canAdd('Client', clients.length)) {
      if (window.showToast) {
        window.showToast(`⚠️ Limite atteinte: ${planInfo.maxClients || 'illimité'} clients max pour le plan ${planInfo.nom}`, 'warning');
      }
      return;
    }

    setEditingClient({
      nom: '',
      type: 'Privé',
      contact: {
        responsable: '',
        fonction: '',
        telephone: '',
        portable: '',
        email: '',
        adresse: '',
        codePostal: '',
        ville: ''
      },
      informationsLegales: {
        siret: '',
        tva: '',
        formeJuridique: '',
        capital: null
      },
      projets: [],
      historique: [],
      notes: ''
    });
  };

  const handleEditClient = (client) => {
    setEditingClient({...client});
  };

  const handleSaveClient = () => {
    if (!editingClient.nom.trim()) {
      if (window.showToast) {
        window.showToast('⚠️ Le nom est obligatoire', 'warning');
      }
      return;
    }

    if (editingClient.id) {
      // Modification
      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
      if (window.showToast) {
        window.showToast('✅ Client modifié avec succès', 'success');
      }
    } else {
      // Nouveau client
      const newClient = {
        ...editingClient,
        id: Date.now(),
        projets: [],
        historique: []
      };
      setClients([...clients, newClient]);
      if (window.showToast) {
        window.showToast('✅ Client ajouté avec succès', 'success');
      }
    }
    setEditingClient(null);
  };

  const handleDeleteClient = (id) => {
    if (confirm('Supprimer ce client ? Cette action est irréversible.')) {
      setClients(clients.filter(c => c.id !== id));
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
      if (window.showToast) {
        window.showToast('🗑️ Client supprimé', 'info');
      }
    }
  };

  const isAtLimit = planInfo.maxClients !== null && clients.length >= planInfo.maxClients;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
        <div>
          <h2 style={{fontSize: '24px', marginBottom: '5px'}}>Clients & Maîtres d'Ouvrage</h2>
          {planInfo.maxClients !== null && (
            <div style={{fontSize: '13px', opacity: 0.7}}>
              {clients.length} / {planInfo.maxClients} clients utilisés
              {isAtLimit && (
                <span style={{marginLeft: '8px', color: '#f59e0b', fontWeight: 600}}>⚠️ Limite atteinte</span>
              )}
            </div>
          )}
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            className={`btn ${viewMode === 'liste' ? '' : 'btn-secondary'}`}
            onClick={() => setViewMode('liste')}
          >
            Liste clients
          </button>
          <button 
            className={`btn ${viewMode === 'projets' ? '' : 'btn-secondary'}`}
            onClick={() => setViewMode('projets')}
          >
            Projets
          </button>
          <button 
            className="btn" 
            onClick={handleNewClient}
            style={{
              cursor: isAtLimit ? 'not-allowed' : 'pointer',
              opacity: isAtLimit ? 0.6 : 1
            }}
            disabled={isAtLimit}
          >
            + Nouveau client
          </button>
        </div>
      </div>

      {/* Afficher l'alerte si limite atteinte */}
      {isAtLimit && (
        <LimitReached 
          resource="clients" 
          current={clients.length} 
          max={planInfo.maxClients}
          requiredPlan="PREMIUM"
        />
      )}

      {/* Barre de recherche */}
      <div style={{marginBottom: '20px'}}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, responsable, email, type..."
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '12px',
            border: '2px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'var(--panel)',
            color: 'var(--ink)'
          }}
        />
      </div>

      {/* Formulaire d'édition */}
      {editingClient && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
          <h3 style={{marginBottom: '20px', fontSize: '18px'}}>
            {editingClient.id ? 'Modifier le client' : 'Nouveau client'}
          </h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px'}}>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Nom / Raison sociale *</label>
              <div style={{display: 'flex', gap: '8px', alignItems: 'stretch'}}>
                <input
                  type="text"
                  value={editingClient.nom}
                  onChange={(e) => setEditingClient({...editingClient, nom: e.target.value})}
                  style={{flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Ex: Ville de Lyon, SCI..."
                />
                <VoiceInputButton
                  onTranscript={(transcript) => setEditingClient({...editingClient, nom: transcript.trim()})}
                />
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Type *</label>
              <select
                value={editingClient.type}
                onChange={(e) => setEditingClient({...editingClient, type: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                <option value="Privé">Privé</option>
                <option value="Public">Public</option>
                <option value="Mixte">Mixte</option>
              </select>
            </div>
          </div>

          {/* Informations de contact */}
          <div style={{marginTop: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
            <h4 style={{margin: '0 0 15px 0', fontSize: '16px'}}>Contact</h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Responsable</label>
                <input
                  type="text"
                  value={editingClient.contact.responsable}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, responsable: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Ex: M. Jean Dupont"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Fonction</label>
                <input
                  type="text"
                  value={editingClient.contact.fonction}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, fonction: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Ex: Directeur Patrimoine"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone fixe</label>
                <input
                  type="tel"
                  value={editingClient.contact.telephone}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, telephone: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Téléphone portable</label>
                <input
                  type="tel"
                  value={editingClient.contact.portable}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, portable: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Email</label>
                <input
                  type="email"
                  value={editingClient.contact.email}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, email: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="contact@example.fr"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Adresse</label>
                <input
                  type="text"
                  value={editingClient.contact.adresse}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, adresse: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="1 rue de la République"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Code postal</label>
                <input
                  type="text"
                  value={editingClient.contact.codePostal}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, codePostal: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="69001"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Ville</label>
                <input
                  type="text"
                  value={editingClient.contact.ville}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    contact: {...editingClient.contact, ville: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="Lyon"
                />
              </div>
            </div>
          </div>

          {/* Informations légales */}
          <div style={{marginTop: '20px', padding: '15px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
            <h4 style={{margin: '0 0 15px 0', fontSize: '16px'}}>Informations légales</h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>SIRET</label>
                <input
                  type="text"
                  value={editingClient.informationsLegales.siret}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    informationsLegales: {...editingClient.informationsLegales, siret: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="12345678901234"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>N° TVA</label>
                <input
                  type="text"
                  value={editingClient.informationsLegales.tva}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    informationsLegales: {...editingClient.informationsLegales, tva: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="FR12345678901"
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Forme juridique</label>
                <input
                  type="text"
                  value={editingClient.informationsLegales.formeJuridique}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    informationsLegales: {...editingClient.informationsLegales, formeJuridique: e.target.value}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="SARL, SCI, Collectivité..."
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Capital social (€)</label>
                <input
                  type="number"
                  value={editingClient.informationsLegales.capital || ''}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    informationsLegales: {...editingClient.informationsLegales, capital: parseFloat(e.target.value) || null}
                  })}
                  style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
                  placeholder="2000000"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{marginTop: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Notes</label>
            <textarea
              value={editingClient.notes}
              onChange={(e) => setEditingClient({...editingClient, notes: e.target.value})}
              style={{width: '100%', minHeight: '100px', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              placeholder="Notes sur ce client..."
            />
          </div>

          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button className="btn-primary" onClick={handleSaveClient}>Enregistrer</button>
            <button className="btn-secondary" onClick={() => setEditingClient(null)}>Annuler</button>
          </div>
        </div>
      )}

      {/* Vue Liste */}
      {viewMode === 'liste' && (
        <div className="card" style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h3>Liste des clients</h3>
          </div>
          
          <div style={{display: 'grid', gap: '15px'}}>
            {filteredClients.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', opacity: 0.5}}>
                <div style={{fontSize: '48px', marginBottom: '10px'}}><Building2 size={48} /></div>
                <div>Aucun client trouvé</div>
              </div>
            ) : (
              filteredClients.map(client => (
                <div 
                  key={client.id} 
                  className="card" 
                  onClick={() => setSelectedClient(client)}
                  style={{
                    padding: '0',
                    background: selectedClient?.id === client.id ? 'rgba(124, 58, 237, 0.1)' : 'var(--panel)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}
                >
                  {/* Bouton Modifier en tête de carte */}
                  <div style={{
                    padding: '15px 20px 10px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      className="btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClient(client);
                      }}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ✏️ Modifier
                    </button>
                  </div>
                  
                  <div style={{padding: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                          <h4 style={{fontSize: '18px', margin: 0}}>{client.nom}</h4>
                          <span className="badge badge-info">{client.type}</span>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px', fontSize: '14px', opacity: 0.8, marginBottom: '15px'}}>
                          <div>Responsable:</div><div>{client.contact.responsable}</div>
                          {client.contact.telephone && (
                            <>
                              <div>Tél:</div><div>{client.contact.telephone}</div>
                            </>
                          )}
                          {client.contact.portable && (
                            <>
                              <div>Portable:</div><div>{client.contact.portable}</div>
                            </>
                          )}
                          <div>Email:</div><div>{client.contact.email}</div>
                          <div>Adresse:</div><div>{client.contact.adresse}, {client.contact.codePostal} {client.contact.ville}</div>
                        </div>
                        {client.projets && client.projets.length > 0 && (
                          <div style={{marginBottom: '10px'}}>
                            <strong style={{fontSize: '12px'}}>Projets:</strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                              {client.projets.map((projet, idx) => (
                                <span key={idx} className="badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                                  {projet.nom} ({projet.statut})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {client.notes && (
                          <div style={{fontSize: '12px', opacity: 0.7, fontStyle: 'italic', marginTop: '10px'}}>
                            {client.notes}
                          </div>
                        )}
                      </div>
                      <div style={{display: 'flex', gap: '5px'}}>
                        <button
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id);
                          }}
                          style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'}}
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Vue Détails Client */}
      {selectedClient && viewMode === 'liste' && (
        <div className="card" style={{marginTop: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{margin: 0}}>{selectedClient.nom}</h3>
            <button className="btn-secondary" onClick={() => setSelectedClient(null)}>Fermer</button>
          </div>

          <div style={{display: 'grid', gap: '20px'}}>
            {/* Informations de contact */}
            <div>
              <h4 style={{marginBottom: '15px', fontSize: '16px'}}>Contact</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Responsable</div>
                  <div style={{fontWeight: 'bold'}}>{selectedClient.contact.responsable}</div>
                </div>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Fonction</div>
                  <div style={{fontWeight: 'bold'}}>{selectedClient.contact.fonction}</div>
                </div>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Téléphone</div>
                  <div>{selectedClient.contact.telephone}</div>
                </div>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Portable</div>
                  <div>{selectedClient.contact.portable}</div>
                </div>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Email</div>
                  <div>
                    <a href={`mailto:${selectedClient.contact.email}`} style={{color: 'var(--brand)'}}>
                      {selectedClient.contact.email}
                    </a>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Adresse</div>
                  <div>{selectedClient.contact.adresse}, {selectedClient.contact.codePostal} {selectedClient.contact.ville}</div>
                </div>
              </div>
            </div>

            {/* Informations légales */}
            {selectedClient.informationsLegales && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '16px'}}>Informations légales</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                  {selectedClient.informationsLegales.siret && (
                    <div>
                      <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>SIRET</div>
                      <div style={{fontWeight: 'bold'}}>{selectedClient.informationsLegales.siret}</div>
                    </div>
                  )}
                  {selectedClient.informationsLegales.tva && (
                    <div>
                      <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>N° TVA</div>
                      <div style={{fontWeight: 'bold'}}>{selectedClient.informationsLegales.tva}</div>
                    </div>
                  )}
                  {selectedClient.informationsLegales.formeJuridique && (
                    <div>
                      <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Forme juridique</div>
                      <div style={{fontWeight: 'bold'}}>{selectedClient.informationsLegales.formeJuridique}</div>
                    </div>
                  )}
                  {selectedClient.informationsLegales.capital && (
                    <div>
                      <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '5px'}}>Capital social</div>
                      <div style={{fontWeight: 'bold'}}>{selectedClient.informationsLegales.capital.toLocaleString('fr-FR')} €</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Projets associés */}
            {selectedClient.projets && selectedClient.projets.length > 0 && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '16px'}}>Projets associés ({selectedClient.projets.length})</h4>
                <div style={{display: 'grid', gap: '10px'}}>
                  {selectedClient.projets.map((projet, idx) => (
                    <div key={idx} style={{
                      padding: '12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{projet.nom}</div>
                      <div style={{fontSize: '13px', opacity: 0.8}}>
                        Statut: {projet.statut} | Montant: {projet.montant.toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historique */}
            {selectedClient.historique && selectedClient.historique.length > 0 && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '16px'}}>Historique des collaborations</h4>
                <div style={{display: 'grid', gap: '10px'}}>
                  {selectedClient.historique.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '12px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <div style={{fontWeight: 'bold', marginBottom: '5px'}}>{item.projet}</div>
                      <div style={{fontSize: '13px', opacity: 0.8}}>
                        {new Date(item.date).toLocaleDateString('fr-FR')} - {item.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedClient.notes && (
              <div>
                <h4 style={{marginBottom: '15px', fontSize: '16px'}}>Notes</h4>
                <div style={{
                  padding: '15px',
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  fontStyle: 'italic',
                  fontSize: '14px'
                }}>
                  {selectedClient.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vue Projets */}
      {viewMode === 'projets' && (
        <div className="card">
          <h3 style={{marginBottom: '20px'}}>Projets par client</h3>
          <div style={{display: 'grid', gap: '20px'}}>
            {clients.map(client => (
              client.projets && client.projets.length > 0 && (
                <div key={client.id} style={{
                  padding: '15px',
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <h4 style={{marginBottom: '10px'}}>{client.nom}</h4>
                  <div style={{display: 'grid', gap: '10px'}}>
                    {client.projets.map((projet, idx) => (
                      <div key={idx} style={{
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '6px'
                      }}>
                        <div style={{fontWeight: 'bold'}}>{projet.nom}</div>
                        <div style={{fontSize: '13px', opacity: 0.7}}>
                          Statut: {projet.statut} | Montant: {projet.montant.toLocaleString('fr-FR')} €
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
