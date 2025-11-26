import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Alertes() {
  const [alertes, setAlertes] = useLocalStorage('wiw-alertes', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateRelance: '',
    contact: '',
    telephone: '',
    email: '',
    priorite: 'normale',
    statut: 'en-attente'
  });

  const priorites = ['basse', 'normale', 'haute', 'urgente'];
  const statuts = ['en-attente', 'en-cours', 'terminée'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Modifier alerte existante
      setAlertes(alertes.map(a => 
        a.id === editingId ? { ...formData, id: editingId } : a
      ));
    } else {
      // Nouvelle alerte
      const nouvelleAlerte = {
        ...formData,
        id: Date.now(),
        dateCreation: new Date().toISOString()
      };
      setAlertes([...alertes, nouvelleAlerte]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateRelance: '',
      contact: '',
      telephone: '',
      email: '',
      priorite: 'normale',
      statut: 'en-attente'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (alerte) => {
    setFormData(alerte);
    setEditingId(alerte.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer cette alerte ?')) {
      setAlertes(alertes.filter(a => a.id !== id));
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case 'basse': return '#6c757d';
      case 'normale': return '#0d6efd';
      case 'haute': return '#fd7e14';
      case 'urgente': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en-attente': return '#ffc107';
      case 'en-cours': return '#0dcaf0';
      case 'terminée': return '#198754';
      default: return '#6c757d';
    }
  };

  const alertesTriees = [...alertes].sort((a, b) => {
    // Tri par date de relance puis priorité
    const dateA = new Date(a.dateRelance);
    const dateB = new Date(b.dateRelance);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }
    const prioriteOrder = { urgente: 0, haute: 1, normale: 2, basse: 3 };
    return prioriteOrder[a.priorite] - prioriteOrder[b.priorite];
  });

  const alertesEnCours = alertesTriees.filter(a => a.statut !== 'terminée');
  const alertesTerminees = alertesTriees.filter(a => a.statut === 'terminée');

  return (
    <div style={{padding: '20px', maxWidth: '1400px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 style={{fontSize: '28px', fontWeight: '600'}}>🔔 Alertes & Relances</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: showForm ? '#6c757d' : '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {showForm ? '✖ Annuler' : '+ Nouvelle alerte'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{marginBottom: '20px', fontSize: '20px'}}>
            {editingId ? '✏️ Modifier l\'alerte' : '➕ Nouvelle alerte'}
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Titre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                required
                placeholder="Ex: Relance devis projet X"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Date de relance *
              </label>
              <input
                type="date"
                value={formData.dateRelance}
                onChange={(e) => setFormData({...formData, dateRelance: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Priorité
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {priorites.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({...formData, statut: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {statuts.map(s => (
                  <option key={s} value={s}>
                    {s === 'en-attente' ? 'En attente' : s === 'en-cours' ? 'En cours' : 'Terminée'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{marginTop: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Notes, contexte, détails..."
              rows="3"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <h3 style={{marginTop: '20px', marginBottom: '15px', fontSize: '16px'}}>👤 Contact</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Nom du contact
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="Ex: M. Dupont"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                placeholder="06 12 34 56 78"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contact@exemple.fr"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {editingId ? '💾 Enregistrer' : '✓ Ajouter'}
            </button>
          </div>
        </form>
      )}

      {/* Statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#0d6efd'}}>
            {alertes.length}
          </div>
          <div style={{color: '#666', marginTop: '5px'}}>Total alertes</div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#ffc107'}}>
            {alertesEnCours.length}
          </div>
          <div style={{color: '#666', marginTop: '5px'}}>En cours</div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '32px', fontWeight: 'bold', color: '#198754'}}>
            {alertesTerminees.length}
          </div>
          <div style={{color: '#666', marginTop: '5px'}}>Terminées</div>
        </div>
      </div>

      {/* Liste alertes en cours */}
      {alertesEnCours.length > 0 && (
        <>
          <h2 style={{fontSize: '22px', marginBottom: '20px', fontWeight: '600'}}>
            📌 Alertes en cours ({alertesEnCours.length})
          </h2>
          <div style={{display: 'grid', gap: '15px', marginBottom: '40px'}}>
            {alertesEnCours.map(alerte => (
              <AlerteCard 
                key={alerte.id}
                alerte={alerte}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getPrioriteColor={getPrioriteColor}
                getStatutColor={getStatutColor}
              />
            ))}
          </div>
        </>
      )}

      {/* Liste alertes terminées */}
      {alertesTerminees.length > 0 && (
        <>
          <h2 style={{fontSize: '22px', marginBottom: '20px', fontWeight: '600', opacity: 0.7}}>
            ✅ Alertes terminées ({alertesTerminees.length})
          </h2>
          <div style={{display: 'grid', gap: '15px', opacity: 0.8}}>
            {alertesTerminees.map(alerte => (
              <AlerteCard 
                key={alerte.id}
                alerte={alerte}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getPrioriteColor={getPrioriteColor}
                getStatutColor={getStatutColor}
              />
            ))}
          </div>
        </>
      )}

      {alertes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
          fontSize: '18px'
        }}>
          <div style={{fontSize: '64px', marginBottom: '20px'}}>🔔</div>
          Aucune alerte. Cliquez sur "Nouvelle alerte" pour commencer.
        </div>
      )}
    </div>
  );
}

function AlerteCard({ alerte, onEdit, onDelete, getPrioriteColor, getStatutColor }) {
  const dateRelance = new Date(alerte.dateRelance);
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  dateRelance.setHours(0, 0, 0, 0);
  
  const joursRestants = Math.ceil((dateRelance - aujourdhui) / (1000 * 60 * 60 * 24));
  const estEnRetard = joursRestants < 0;
  const estAujourdhui = joursRestants === 0;

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${getPrioriteColor(alerte.priorite)}`
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
        <div style={{flex: 1}}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>
            {alerte.titre}
          </h3>
          
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px'}}>
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              background: getPrioriteColor(alerte.priorite),
              color: 'white'
            }}>
              {alerte.priorite.toUpperCase()}
            </span>
            
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              background: getStatutColor(alerte.statut),
              color: 'white'
            }}>
              {alerte.statut === 'en-attente' ? 'EN ATTENTE' : alerte.statut === 'en-cours' ? 'EN COURS' : 'TERMINÉE'}
            </span>

            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              background: estEnRetard ? '#dc3545' : estAujourdhui ? '#fd7e14' : '#e9ecef',
              color: estEnRetard || estAujourdhui ? 'white' : '#666'
            }}>
              📅 {new Date(alerte.dateRelance).toLocaleDateString('fr-FR')}
              {estEnRetard && ` (${Math.abs(joursRestants)}j retard)`}
              {estAujourdhui && ' (AUJOURD\'HUI)'}
              {!estEnRetard && !estAujourdhui && joursRestants > 0 && ` (dans ${joursRestants}j)`}
            </span>
          </div>

          {alerte.description && (
            <p style={{color: '#666', fontSize: '14px', marginTop: '10px', lineHeight: '1.5'}}>
              {alerte.description}
            </p>
          )}

          {(alerte.contact || alerte.telephone || alerte.email) && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <div style={{fontWeight: '600', marginBottom: '5px'}}>👤 Contact:</div>
              {alerte.contact && <div>• {alerte.contact}</div>}
              {alerte.telephone && (
                <div>
                  • <a href={`tel:${alerte.telephone}`} style={{color: '#0d6efd', textDecoration: 'none'}}>
                    {alerte.telephone}
                  </a>
                </div>
              )}
              {alerte.email && (
                <div>
                  • <a href={`mailto:${alerte.email}`} style={{color: '#0d6efd', textDecoration: 'none'}}>
                    {alerte.email}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{display: 'flex', gap: '8px', marginLeft: '15px'}}>
          <button
            onClick={() => onEdit(alerte)}
            style={{
              padding: '8px 12px',
              background: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ✏️ Modifier
          </button>
          <button
            onClick={() => onDelete(alerte.id)}
            style={{
              padding: '8px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
