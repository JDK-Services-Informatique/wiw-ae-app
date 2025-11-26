/**
 * calculerHonoraires(partenaires, plan)
 * - partenaires: [{ nom, coutHoraire, heuresHebdo }]
 * - plan: 'GRATUIT'|'PREMIUM'|'ENTREPRISE'
 *
 * NOTE: Business assumption — monthly cost is computed as 4 weeks of work:
 *   coutMensuel = coutHebdomadaire * 4
 * If you prefer a calendar-month average, use 52/12 (~4.3333) instead.
 *
 * Returns array with computed costs.
 */
export const calculerHonoraires = (partenaires = [], plan = 'GRATUIT') => {
  const factor = plan === 'PREMIUM' ? 1.05 : (plan === 'ENTREPRISE' ? 1.15 : 1.0);

  return partenaires.map(p => {
    const rate = Number(p.coutHoraire || 0);
    const min = p.coutMin ? Number(p.coutMin) : +(rate * 0.8).toFixed(2);
    const hebdoHours = p.heuresHebdo ? Number(p.heuresHebdo) : 35;
    const coutHebdo = +(rate * hebdoHours * factor).toFixed(2);
    const coutMensuel = +(coutHebdo * 4).toFixed(2);
    return {
      nom: p.nom || 'Partenaire',
      coutHoraireMoyen: +(rate * factor).toFixed(2),
      coutHoraireMin: +(min * factor).toFixed(2),
      coutHebdomadaire: coutHebdo,
      coutMensuel: coutMensuel
    };
  });
};
