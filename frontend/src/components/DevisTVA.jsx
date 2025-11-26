import React from 'react';
import { formatCurrency } from '../utils/formatNumber';

// Composant Calcul TVA multi-taux avec rabais
// Supporte plusieurs taux de TVA et rabais/remise globale
export default function DevisTVA({ 
  totalHT = 0, 
  lignesTVA = [], // [{ taux: 20, montantHT: 1000 }]
  rabais = 0,
  rabaisType = 'pourcentage', // 'pourcentage' ou 'montant'
  onRabaisChange,
  onRabaisTypeChange
}) {
  // Taux TVA disponibles en France
  const tauxTVA = [
    { value: 20, label: '20% (Taux normal)' },
    { value: 10, label: '10% (Taux intermédiaire)' },
    { value: 5.5, label: '5,5% (Taux réduit)' },
    { value: 2.1, label: '2,1% (Taux super-réduit)' },
    { value: 0, label: '0% (Exonéré)' }
  ];

  // Calculer montant du rabais
  const calculerMontantRabais = () => {
    if (rabaisType === 'pourcentage') {
      return totalHT * (rabais / 100);
    }
    return rabais;
  };

  // Calculer total HT après rabais
  const totalHTApresRabais = totalHT - calculerMontantRabais();

  // Grouper les lignes par taux de TVA
  const groupesParTaux = {};
  lignesTVA.forEach(ligne => {
    const taux = ligne.taux || 20; // Taux par défaut 20%
    if (!groupesParTaux[taux]) {
      groupesParTaux[taux] = 0;
    }
    groupesParTaux[taux] += ligne.montantHT || 0;
  });

  // Calculer TVA par taux (en tenant compte du rabais proportionnel)
  const lignesTVACalculees = Object.entries(groupesParTaux).map(([taux, montant]) => {
    const tauxNum = parseFloat(taux);
    const proportion = montant / totalHT;
    const montantApresRabais = totalHTApresRabais * proportion;
    const montantTVA = montantApresRabais * (tauxNum / 100);
    
    return {
      taux: tauxNum,
      montantHT: montantApresRabais,
      montantTVA
    };
  });

  // Si pas de lignes TVA, utiliser taux unique 20%
  if (lignesTVACalculees.length === 0 && totalHT > 0) {
    lignesTVACalculees.push({
      taux: 20,
      montantHT: totalHTApresRabais,
      montantTVA: totalHTApresRabais * 0.20
    });
  }

  // Total TVA
  const totalTVA = lignesTVACalculees.reduce((acc, l) => acc + l.montantTVA, 0);

  // Total TTC
  const totalTTC = totalHTApresRabais + totalTVA;

  return (
    <div className="space-y-4">
      {/* Section Rabais/Remise */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-3">Rabais / Remise</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-700">Type :</label>
          <select
            value={rabaisType}
            onChange={(e) => onRabaisTypeChange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="pourcentage">Pourcentage (%)</option>
            <option value="montant">Montant (€)</option>
          </select>
          
          <label className="text-sm text-gray-700">Valeur :</label>
          <input
            type="number"
            value={rabais}
            onChange={(e) => onRabaisChange(parseFloat(e.target.value) || 0)}
            className="w-32 px-3 py-2 border rounded-lg"
            step="0.01"
            min="0"
          />
          <span className="text-gray-700">
            {rabaisType === 'pourcentage' ? '%' : '€'}
          </span>

          <div className="ml-auto text-right">
            <div className="text-sm text-gray-600">Montant du rabais :</div>
            <div className="text-lg font-bold text-yellow-700">
              - {formatCurrency(calculerMontantRabais())}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-right font-semibold w-40">Montant</th>
            </tr>
          </thead>
          <tbody>
            {/* Total HT */}
            <tr className="border-t">
              <td className="px-4 py-3 font-semibold">Total HT</td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatCurrency(totalHT)}
              </td>
            </tr>

            {/* Rabais */}
            {rabais > 0 && (
              <>
                <tr className="border-t bg-yellow-50">
                  <td className="px-4 py-3 text-yellow-800">
                    Rabais {rabaisType === 'pourcentage' ? `(${rabais}%)` : ''}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-800">
                    - {formatCurrency(calculerMontantRabais())}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-semibold">Total HT après rabais</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(totalHTApresRabais)}
                  </td>
                </tr>
              </>
            )}

            {/* Lignes TVA par taux */}
            {lignesTVACalculees.map((ligne, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>TVA {ligne.taux}%</span>
                    <span className="text-sm text-gray-500">
                      (base HT : {formatCurrency(ligne.montantHT)})
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(ligne.montantTVA)}
                </td>
              </tr>
            ))}

            {/* Total TTC */}
            <tr className="border-t-2 border-gray-300 bg-blue-50">
              <td className="px-4 py-4 font-bold text-lg text-blue-900">
                Total TTC
              </td>
              <td className="px-4 py-4 text-right font-bold text-xl text-blue-900">
                {formatCurrency(totalTTC)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Légende taux TVA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm text-blue-900">
          <strong>Taux TVA applicables en France :</strong>
          <ul className="mt-2 space-y-1 ml-4">
            {tauxTVA.map(t => (
              <li key={t.value} className="text-blue-800">
                • {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
