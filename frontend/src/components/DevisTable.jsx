import React, { useState } from 'react';
import { Plus, FolderPlus, Trash2, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatNumber, formatHours } from '../utils/formatNumber';

export default function DevisTable({ 
  lignes = [], 
  chapitres = [],
  onLignesChange, 
  onChapitresChange,
  tauxHoraire = 0,
  onTauxHoraireChange,
  onSommeHeuresChange // Callback pour transmettre la somme des heures
}) {
  const [editingChapitre, setEditingChapitre] = useState(null);

  const ajouterLigne = (chapitreId = null) => {
    const nouvelleLigne = {
      id: Date.now(),
      chapitreId,
      designation: '',
      unite: 'h',
      puHT: 0,
      quantite: 1,
      remise: 0,
      ordre: lignes.length
    };
    onLignesChange([...lignes, nouvelleLigne]);
  };

  const ajouterChapitre = () => {
    const nouveauChapitre = {
      id: Date.now(),
      titre: 'Nouveau chapitre',
      ordre: chapitres.length,
      replie: false
    };
    onChapitresChange([...chapitres, nouveauChapitre]);
  };

  const modifierLigne = (id, champ, valeur) => {
    onLignesChange(lignes.map(l => l.id === id ? { ...l, [champ]: valeur } : l));
  };

  const modifierChapitre = (id, champ, valeur) => {
    onChapitresChange(chapitres.map(c => c.id === id ? { ...c, [champ]: valeur } : c));
  };

  const supprimerLigne = (id) => onLignesChange(lignes.filter(l => l.id !== id));
  
  const supprimerChapitre = (id) => {
    if (window.confirm('Supprimer ce chapitre et toutes ses lignes ?')) {
      onChapitresChange(chapitres.filter(c => c.id !== id));
      onLignesChange(lignes.filter(l => l.chapitreId !== id));
    }
  };

  const calculerMontantLigne = (ligne) => ligne.puHT * ligne.quantite * (1 - ligne.remise / 100);
  
  const calculerSousTotalChapitre = (chapitreId) => 
    lignes.filter(l => l.chapitreId === chapitreId).reduce((acc, l) => acc + calculerMontantLigne(l), 0);

  const calculerTotalHT = () => lignes.reduce((acc, l) => acc + calculerMontantLigne(l), 0);
  
  const calculerSommeHeures = () => {
    const somme = lignes.filter(l => l.unite === 'h').reduce((acc, l) => acc + parseFloat(l.quantite || 0), 0);
    // Notifier le parent de la somme des heures
    if (onSommeHeuresChange) {
      onSommeHeuresChange(somme);
    }
    return somme;
  };

  const lignesSansChapitre = lignes.filter(l => !l.chapitreId);
  
  const unites = ['h', 'u', 'j', 'm²', 'ml', 'kg', 'l', 'ff'];

  // --- Composants UI Internes ---
  const TableHeader = () => (
    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-medium">
      <tr>
        <th className="px-4 py-3 text-left w-5/12 rounded-l-lg">Désignation</th>
        <th className="px-2 py-3 text-center w-24">Unité</th>
        <th className="px-2 py-3 text-right w-32">P.U. HT</th>
        <th className="px-2 py-3 text-center w-20">Qté</th>
        <th className="px-2 py-3 text-right w-24">Remise %</th>
        <th className="px-4 py-3 text-right w-32">Total HT</th>
        <th className="px-2 py-3 text-center w-12 rounded-r-lg"></th>
      </tr>
    </thead>
  );

  const LigneRow = ({ ligne }) => (
    <motion.tr 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
    >
      <td className="px-4 py-2">
        <input
          type="text"
          value={ligne.designation}
          onChange={(e) => modifierLigne(ligne.id, 'designation', e.target.value)}
          placeholder="Description de la prestation..."
          className="w-full bg-transparent border-0 border-b border-transparent focus:border-brand focus:ring-0 px-0 py-1 text-sm transition-all placeholder:text-slate-300"
        />
      </td>
      <td className="px-2 py-2">
        <select
          value={ligne.unite}
          onChange={(e) => modifierLigne(ligne.id, 'unite', e.target.value)}
          className="w-full bg-slate-100 dark:bg-slate-800 rounded-md text-center text-sm py-1 border-transparent focus:border-brand focus:ring-brand"
        >
          {unites.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          value={ligne.puHT}
          onChange={(e) => modifierLigne(ligne.id, 'puHT', parseFloat(e.target.value) || 0)}
          className="w-full text-right bg-transparent border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          value={ligne.quantite}
          onChange={(e) => modifierLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
          className="w-full text-center bg-transparent border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          value={ligne.remise}
          onChange={(e) => modifierLigne(ligne.id, 'remise', parseFloat(e.target.value) || 0)}
          className={`w-full text-right bg-transparent border rounded-md px-2 py-1 text-sm focus:border-brand focus:ring-1 focus:ring-brand ${ligne.remise > 0 ? 'text-orange-500 border-orange-200' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
        />
      </td>
      <td className="px-4 py-2 text-right font-medium text-slate-700 dark:text-slate-200">
        {formatCurrency(calculerMontantLigne(ligne))}
      </td>
      <td className="px-2 py-2 text-center">
        <button
          onClick={() => supprimerLigne(ligne.id)}
          className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </motion.tr>
  );

  return (
    <div className="space-y-6 bg-white dark:bg-dark-panel p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border">
      
      {/* En-tête et Actions Globales */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-brand/10 rounded-lg text-brand">
            <FileText size={24} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Taux Horaire</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tauxHoraire}
                onChange={(e) => onTauxHoraireChange(parseFloat(e.target.value) || 0)}
                className="w-24 font-bold text-lg bg-transparent border-b-2 border-slate-300 focus:border-brand outline-none text-brand px-1"
              />
              <span className="text-sm text-slate-400 font-medium">€ HT / h</span>
            </div>
          </div>
        </div>

          <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase">Heures Totales</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-200">{formatHours(calculerSommeHeures())}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase">Total Général HT</div>
            <div className="text-2xl font-bold text-brand">{formatCurrency(calculerTotalHT())}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => ajouterLigne(null)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 dark:shadow-none text-sm font-medium"
        >
          <Plus size={16} /> Ajouter une ligne
        </button>
        <button
          onClick={ajouterChapitre}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-panel border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium"
        >
          <FolderPlus size={16} /> Nouveau Chapitre
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <TableHeader />
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            
            {/* Lignes Orphelines */}
            <AnimatePresence>
              {lignesSansChapitre.map((ligne) => (
                <LigneRow key={ligne.id} ligne={ligne} />
              ))}
            </AnimatePresence>

            {/* Chapitres */}
            {chapitres.map((chapitre) => (
              <React.Fragment key={chapitre.id}>
                <tr className="bg-brand/5 dark:bg-brand/10 border-y border-brand/10">
                  <td colSpan="5" className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => modifierChapitre(chapitre.id, 'replie', !chapitre.replie)}
                        className="p-1 hover:bg-brand/10 rounded text-brand transition-colors"
                      >
                        {chapitre.replie ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                      </button>
                      
                      {editingChapitre === chapitre.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={chapitre.titre}
                          onChange={(e) => modifierChapitre(chapitre.id, 'titre', e.target.value)}
                          onBlur={() => setEditingChapitre(null)}
                          className="font-bold text-brand bg-transparent border-b border-brand outline-none px-1"
                        />
                      ) : (
                        <span
                          onClick={() => setEditingChapitre(chapitre.id)}
                          className="font-bold text-brand cursor-pointer hover:underline decoration-brand/30 underline-offset-4"
                        >
                          {chapitre.titre}
                        </span>
                      )}

                      <button
                        onClick={() => ajouterLigne(chapitre.id)}
                        className="ml-4 text-xs bg-white dark:bg-dark-panel border border-brand/20 text-brand px-2 py-1 rounded hover:bg-brand hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> Ligne
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand">
                    {formatCurrency(calculerSousTotalChapitre(chapitre.id))}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={() => supprimerChapitre(chapitre.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>

                {/* Lignes du Chapitre */}
                <AnimatePresence>
                  {!chapitre.replie && lignes
                    .filter(l => l.chapitreId === chapitre.id)
                    .map((ligne) => (
                      <LigneRow key={ligne.id} ligne={ligne} />
                    ))}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {lignes.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg mt-4 border border-dashed border-slate-200 dark:border-slate-700">
            <p>Aucune ligne de devis pour le moment.</p>
            <p className="text-sm">Commencez par ajouter une ligne ou un chapitre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
