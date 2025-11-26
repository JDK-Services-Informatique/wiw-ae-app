import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

// Middleware de validation pour les devis
export function validateDevisData(req, res, next) {
  const { numero, clientNom, lignes } = req.body;

  const errors = [];

  if (!numero || typeof numero !== 'string' || numero.trim().length === 0) {
    errors.push('Le numéro du devis est obligatoire');
  }

  if (!clientNom || typeof clientNom !== 'string' || clientNom.trim().length === 0) {
    errors.push('Le nom du client est obligatoire');
  }

  if (lignes && Array.isArray(lignes)) {
    lignes.forEach((ligne, index) => {
      if (!ligne.designation || typeof ligne.designation !== 'string' || ligne.designation.trim().length === 0) {
        errors.push(`La désignation de la ligne ${index + 1} est obligatoire`);
      }
      if (!ligne.unite || typeof ligne.unite !== 'string') {
        errors.push(`L'unité de la ligne ${index + 1} est obligatoire`);
      }
      if (typeof ligne.puHT !== 'number' || ligne.puHT < 0) {
        errors.push(`Le prix unitaire HT de la ligne ${index + 1} doit être un nombre positif`);
      }
      if (typeof ligne.quantite !== 'number' || ligne.quantite <= 0) {
        errors.push(`La quantité de la ligne ${index + 1} doit être un nombre positif`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

// Middleware de validation pour les références
export function validateReferenceData(req, res, next) {
  const { designation, unite, puHT, categorie } = req.body;

  const errors = [];

  if (!designation || typeof designation !== 'string' || designation.trim().length === 0) {
    errors.push('La désignation est obligatoire');
  }

  if (!unite || typeof unite !== 'string') {
    errors.push('L\'unité est obligatoire');
  }

  if (!categorie || typeof categorie !== 'string') {
    errors.push('La catégorie est obligatoire');
  }

  if (typeof puHT !== 'number' || puHT < 0) {
    errors.push('Le prix unitaire HT doit être un nombre positif');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

// Middleware de validation pour l'équipe
export function validateEquipeData(req, res, next) {
  const { nom, role } = req.body;

  const errors = [];

  if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
    errors.push('Le nom est obligatoire');
  }

  if (!role || typeof role !== 'string') {
    errors.push('Le rôle est obligatoire');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

// Middleware pour vérifier les limites de plan
export async function checkPlanLimits(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Définir les limites selon le plan
    const limits = {
      GRATUIT: {
        maxDevis: 5,
        maxReferences: 20,
        maxEquipe: 3
      },
      PREMIUM: {
        maxDevis: 50,
        maxReferences: 200,
        maxEquipe: 10
      },
      PRO: {
        maxDevis: -1, // illimité
        maxReferences: -1,
        maxEquipe: -1
      }
    };

    const userLimits = limits[user.plan] || limits.GRATUIT;

    // Vérifier les limites selon l'endpoint
    if (req.path.includes('/devis') && req.method === 'POST') {
      const devisCount = await prisma.devis.count({ where: { utilisateurId: userId } });
      if (userLimits.maxDevis !== -1 && devisCount >= userLimits.maxDevis) {
        return res.status(403).json({
          error: `Limite de ${userLimits.maxDevis} devis atteinte pour le plan ${user.plan}`
        });
      }
    }

    if (req.path.includes('/references') && req.method === 'POST') {
      const referencesCount = await prisma.reference.count({ where: { utilisateurId: userId } });
      if (userLimits.maxReferences !== -1 && referencesCount >= userLimits.maxReferences) {
        return res.status(403).json({
          error: `Limite de ${userLimits.maxReferences} références atteinte pour le plan ${user.plan}`
        });
      }
    }

    if (req.path.includes('/equipe') && req.method === 'POST') {
      const equipeCount = await prisma.equipe.count({ where: { utilisateurId: userId } });
      if (userLimits.maxEquipe !== -1 && equipeCount >= userLimits.maxEquipe) {
        return res.status(403).json({
          error: `Limite de ${userLimits.maxEquipe} membres d'équipe atteinte pour le plan ${user.plan}`
        });
      }
    }

    next();
  } catch (error) {
    logger.error('Erreur lors de la vérification des limites', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
}