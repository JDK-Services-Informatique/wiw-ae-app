import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Calendar({ onNavigate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendrier'); // calendrier, planning, alertes
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useLocalStorage('wiw-calendar-events', [
    { id: 1, date: 15, month: 11, year: 2024, title: 'Réunion client ABC', type: 'reunion', priorite: 'normale', echeance: '2024-12-15' },
    { id: 2, date: 20, month: 11, year: 2024, title: 'Rendu AO Hôpital', type: 'ao', priorite: 'haute', echeance: '2024-12-20' },
    { id: 3, date: 22, month: 11, year: 2024, title: 'Deadline projet XYZ', type: 'deadline', priorite: 'critique', echeance: '2024-12-22' },
    { id: 4, date: 28, month: 11, year: 2024, title: 'Signature contrat', type: 'contrat', priorite: 'normale', echeance: '2024-12-28' },
    { id: 5, date: 5, month: 0, year: 2025, title: 'Visite chantier', type: 'visite', priorite: 'normale', echeance: '2025-01-05' },
    { id: 6, date: 15, month: 0, year: 2025, title: 'Rendu plans APD', type: 'deadline', priorite: 'haute', echeance: '2025-01-15' }
  ]);

  // Fonction pour naviguer depuis un événement
  const handleEventClick = (event) => {
    if (!onNavigate) return;
    
    switch(event.type) {
      case 'ao':
        onNavigate('tenders');
        break;
      case 'deadline':
        onNavigate('references');
        break;
      case 'contrat':
        onNavigate('missions-conseil');
        break;
      case 'visite':
        onNavigate('references');
        break;
      default:
        break;
    }
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    setEditingEvent({...event});
  };

  const handleDeleteEvent = (event, e) => {
    e.stopPropagation();
    if (confirm(`Supprimer l'événement "${event.title}" ?`)) {
      setEvents(events.filter(e => e.id !== event.id));
      if (window.showToast) {
        window.showToast('✅ Événement supprimé', 'success');
      }
    }
  };

  const handleSaveEvent = () => {
    if (!editingEvent.title.trim()) {
      if (window.showToast) {
        window.showToast('⚠️ Le titre est obligatoire', 'warning');
      }
      return;
    }
    if (editingEvent.id) {
      // Modification
      setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
      if (window.showToast) {
        window.showToast('✅ Événement modifié avec succès', 'success');
      }
    } else {
      // Nouvel événement
      const newEvent = {
        ...editingEvent,
        id: Date.now(),
        date: new Date(editingEvent.echeance).getDate(),
        month: new Date(editingEvent.echeance).getMonth(),
        year: new Date(editingEvent.echeance).getFullYear()
      };
      setEvents([...events, newEvent]);
      if (window.showToast) {
        window.showToast('✅ Événement ajouté avec succès', 'success');
      }
    }
    setEditingEvent(null);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getAlertes = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events.filter(e => {
      const eventDate = new Date(e.year, e.month, e.date);
      return eventDate >= today && eventDate <= nextWeek;
    }).sort((a, b) => {
      const dateA = new Date(a.year, a.month, a.date);
      const dateB = new Date(b.year, b.month, b.date);
      return dateA - dateB;
    });
  };

  const alertes = getAlertes();

  const getEventForDate = (date) => {
    return events.find(event => event.date === date);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px'}}>Calendrier & Planning</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button className={`btn ${viewMode === 'calendrier' ? '' : 'btn-secondary'}`} onClick={() => setViewMode('calendrier')}>Calendrier</button>
          <button className={`btn ${viewMode === 'planning' ? '' : 'btn-secondary'}`} onClick={() => setViewMode('planning')}>
            Planning {alertes.length > 0 && <span style={{marginLeft: '6px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '11px'}}>{alertes.length}</span>}
          </button>
          <button className="btn-primary" onClick={() => setEditingEvent({ title: '', type: 'reunion', priorite: 'normale', echeance: new Date().toISOString().split('T')[0] })}>+ Nouvel événement</button>
        </div>
      </div>

      {/* Modal Édition Événement */}
      {editingEvent && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(124, 58, 237, 0.1)'}}>
          <h3 style={{marginBottom: '20px'}}>✏️ Modifier l'événement</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Titre *</label>
              <input 
                type="text" 
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Type</label>
              <select 
                value={editingEvent.type}
                onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                <option value="reunion">Réunion</option>
                <option value="ao">Appel d'offres</option>
                <option value="deadline">Deadline</option>
                <option value="contrat">Contrat</option>
                <option value="visite">Visite</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Priorité</label>
              <select 
                value={editingEvent.priorite}
                onChange={(e) => setEditingEvent({...editingEvent, priorite: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              >
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="critique">Critique</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: 500}}>Date de l'événement</label>
              <input 
                type="date" 
                value={editingEvent.echeance}
                onChange={(e) => setEditingEvent({...editingEvent, echeance: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px'}}
              />
            </div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn-primary" onClick={handleSaveEvent}>💾 Enregistrer</button>
            <button className="btn-secondary" onClick={() => setEditingEvent(null)}>❌ Annuler</button>
          </div>
        </div>
      )}

      {/* Alertes imminentes dans vue calendrier */}
      {alertes.length > 0 && viewMode === 'calendrier' && (
        <div className="card" style={{marginBottom: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
          <h3 style={{color: '#ef4444', marginBottom: '12px'}}>Alertes à venir (7 prochains jours)</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {alertes.map(alerte => {
              const dateEvent = new Date(alerte.echeance);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              dateEvent.setHours(0, 0, 0, 0);
              const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={alerte.id} 
                  onClick={() => handleEventClick(alerte)}
                  style={{
                    padding: '10px', 
                    background: 'rgba(0,0,0,0.2)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{fontWeight: 'bold'}}>{alerte.title}</div>
                    <div style={{fontSize: '12px', opacity: 0.7}}>
                      {dateEvent.toLocaleDateString('fr-FR')} • {joursRestants === 0 ? 'Aujourd\'hui' : `Dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                    </div>
                  </div>
                  <span className={`badge ${alerte.priorite === 'critique' ? 'badge-error' : alerte.priorite === 'haute' ? 'badge-warning' : 'badge-info'}`}>
                    {alerte.priorite}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'calendrier' && (
        <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h3 style={{fontSize: '20px'}}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="btn-secondary" onClick={() => navigateMonth(-1)}>‹ Précédent</button>
            <button className="btn-secondary" onClick={() => navigateMonth(1)}>Suivant ›</button>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px'}}>
          {dayNames.map(day => (
            <div key={day} style={{textAlign: 'center', padding: '10px', fontWeight: 'bold', fontSize: '14px', opacity: 0.7}}>
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} style={{padding: '8px', borderRadius: '8px'}}></div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1;
            const event = getEventForDate(date);
            const isToday = date === new Date().getDate() &&
                           currentDate.getMonth() === new Date().getMonth() &&
                           currentDate.getFullYear() === new Date().getFullYear();
            
            // Calculer le jour de la semaine (0 = Dimanche)
            const dayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), date).getDay();
            const isSunday = dayOfWeek === 0;

            return (
              <div
                key={date}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: isSunday ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  background: isSunday 
                    ? 'rgba(100, 100, 100, 0.15)' 
                    : isToday 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : 'rgba(255,255,255,0.05)',
                  border: isToday ? '2px solid #22c55e' : 'none',
                  minHeight: '60px',
                  opacity: isSunday ? 0.5 : 1
                }}
              >
                <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '4px'}}>{date}</div>
                {event && (
                  <div style={{
                    fontSize: '10px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    background: event.type === 'reunion' ? 'rgba(168, 85, 247, 0.6)' :
                               event.type === 'deadline' ? 'rgba(245, 158, 11, 0.6)' :
                               'rgba(239, 68, 68, 0.6)'
                  }}>
                    {event.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Vue Planning avec alertes intégrées */}
      {viewMode === 'planning' && (
        <div>
          {/* Alertes prioritaires en haut du planning */}
          {alertes.length > 0 && (
            <div className="card" style={{marginBottom: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
              <h3 style={{marginBottom: '15px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>⚠️</span> Alertes prioritaires (7 prochains jours)
              </h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px'}}>
                {alertes.map(alerte => {
                  const dateEvent = new Date(alerte.echeance);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  dateEvent.setHours(0, 0, 0, 0);
                  const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={alerte.id} 
                      onClick={() => handleEventClick(alerte)}
                      style={{
                        padding: '12px',
                        background: joursRestants === 0 ? 'rgba(245, 158, 11, 0.15)' : joursRestants <= 3 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '6px',
                        border: `1px solid ${joursRestants === 0 ? 'rgba(245, 158, 11, 0.4)' : joursRestants <= 3 ? 'rgba(251, 146, 60, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px'}}>
                        <div style={{fontWeight: 'bold', fontSize: '14px'}}>{alerte.title}</div>
                        <span className={`badge ${alerte.priorite === 'critique' ? 'badge-error' : alerte.priorite === 'haute' ? 'badge-warning' : 'badge-info'}`} style={{fontSize: '10px'}}>
                          {alerte.priorite}
                        </span>
                      </div>
                      <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '6px'}}>
                        📅 {dateEvent.toLocaleDateString('fr-FR')} • {alerte.type}
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: joursRestants === 0 ? '#f59e0b' : joursRestants <= 3 ? '#fb923c' : '#ef4444',
                          color: 'white'
                        }}>
                          {joursRestants === 0 ? 'AUJOURD\'HUI' : `Dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                        </span>
                        <button 
                          className="btn-secondary" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(alerte, e);
                          }}
                          style={{padding: '4px 8px', fontSize: '11px', cursor: 'pointer'}}
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Planning complet de tous les événements */}
          <div className="card">
            <h3 style={{marginBottom: '15px'}}>Planning des événements</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Événement</th>
                    <th>Type</th>
                    <th>Priorité</th>
                    <th>Délai</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.sort((a, b) => new Date(a.echeance) - new Date(b.echeance)).map(event => {
                    const dateEvent = new Date(event.echeance);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    dateEvent.setHours(0, 0, 0, 0);
                    const joursRestants = Math.ceil((dateEvent - today) / (1000 * 60 * 60 * 24));
                    const estEnRetard = joursRestants < 0;
                    const estAujourdhui = joursRestants === 0;
                    const estUrgent = joursRestants >= 0 && joursRestants <= 3;
                    const estAlerte = alertes.some(a => a.id === event.id);
                    
                    return (
                      <tr 
                        key={event.id}
                        style={{
                          background: estEnRetard ? 'rgba(239, 68, 68, 0.1)' : estAujourdhui ? 'rgba(245, 158, 11, 0.1)' : estUrgent ? 'rgba(251, 146, 60, 0.05)' : estAlerte ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                          borderLeft: estAlerte ? '3px solid #ef4444' : 'none'
                        }}
                      >
                        <td style={{fontWeight: estUrgent || estAujourdhui || estEnRetard ? 'bold' : 'normal'}}>
                          {dateEvent.toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                            {estAlerte && <span style={{color: '#ef4444'}}>⚠️</span>}
                            {event.title}
                          </div>
                        </td>
                        <td><span className="badge badge-info">{event.type}</span></td>
                        <td>
                          <span className={`badge ${event.priorite === 'critique' ? 'badge-error' : event.priorite === 'haute' ? 'badge-warning' : 'badge-info'}`}>
                            {event.priorite}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: estEnRetard ? '#ef4444' : estAujourdhui ? '#f59e0b' : estUrgent ? '#fb923c' : '#e9ecef',
                            color: (estEnRetard || estAujourdhui || estUrgent) ? 'white' : '#666'
                          }}>
                            {estEnRetard ? `${Math.abs(joursRestants)}j retard` : estAujourdhui ? 'AUJOURD\'HUI' : estUrgent ? `Dans ${joursRestants}j` : `${joursRestants}j`}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Modifier" onClick={(e) => handleEditEvent(event, e)} style={{cursor: 'pointer'}}>✏️</button>
                          <button className="btn-icon" title="Supprimer" onClick={(e) => handleDeleteEvent(event, e)} style={{cursor: 'pointer'}}>🗑️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'calendrier' && (
        <div className="card">
          <h3 style={{marginBottom: '16px', fontSize: '18px'}}>Légende</h3>
          <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.6)'}}></div>
              <span style={{fontSize: '14px'}}>Réunions</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.6)'}}></div>
              <span style={{fontSize: '14px'}}>Appels d'offres</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <div style={{width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.6)'}}></div>
              <span style={{fontSize: '14px'}}>Deadlines</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}