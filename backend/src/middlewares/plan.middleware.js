/**
 * verifierAccesPlan(planRequis)
 * For demo, req.user is stubbed when absent.
 */
/**
 * verifierAccesPlan(planRequis)
 */
export const verifierAccesPlan = (planRequis) => (req, res, next) => {
  // Ensure the request is authenticated; if not, return 401.
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  const userPlan = req.user.plan || 'GRATUIT';

  const levels = {
    GRATUIT: 0,
    PREMIUM: 1,
    ENTREPRISE: 2
  };

  // Validate requested plan exists in levels
  if (!Object.prototype.hasOwnProperty.call(levels, planRequis)) {
    return res.status(500).json({ message: `Plan inconnu: ${planRequis}` });
  }

  // Normalize unknown userPlan to GRATUIT
  const normalizedUserPlan = Object.prototype.hasOwnProperty.call(levels, userPlan) ? userPlan : 'GRATUIT';

  if (levels[normalizedUserPlan] < levels[planRequis]) {
    return res.status(403).json({
      message: `Plan ${planRequis} requis`,
      planActuel: normalizedUserPlan
    });
  }

  next();
};
