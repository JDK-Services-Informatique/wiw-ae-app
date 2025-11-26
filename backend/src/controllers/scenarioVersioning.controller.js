import { Router } from 'express';
import {
  createScenarioVersion,
  getScenarioVersions,
  getScenarioVersion,
  restoreScenarioVersion,
  compareScenarioVersions
} from '../services/scenarioVersioning.service.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

/**
 * POST /api/scenario-versions
 * Créer une nouvelle version de scénario
 */
router.post('/', async (req, res) => {
  try {
    const { projetId, scenarioData, commentaire } = req.body;
    const utilisateurId = req.user.id;

    if (!projetId || !scenarioData) {
      return res.status(400).json({
        error: 'projetId et scenarioData sont requis'
      });
    }

    const version = await createScenarioVersion(
      projetId,
      scenarioData,
      utilisateurId,
      commentaire
    );

    res.status(201).json(version);
  } catch (error) {
    console.error('Erreur création version scénario:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la version de scénario'
    });
  }
});

/**
 * GET /api/scenario-versions/project/:projetId
 * Récupérer toutes les versions d'un projet
 */
router.get('/project/:projetId', async (req, res) => {
  try {
    const { projetId } = req.params;
    const versions = await getScenarioVersions(parseInt(projetId));

    res.json(versions);
  } catch (error) {
    console.error('Erreur récupération versions scénario:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des versions de scénario'
    });
  }
});

/**
 * GET /api/scenario-versions/:id
 * Récupérer une version spécifique
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const version = await getScenarioVersion(parseInt(id));

    res.json(version);
  } catch (error) {
    console.error('Erreur récupération version scénario:', error);
    if (error.message === 'Version non trouvée') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Erreur lors de la récupération de la version de scénario'
    });
  }
});

/**
 * POST /api/scenario-versions/:id/restore
 * Restaurer une version précédente
 */
router.post('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateurId = req.user.id;

    const newVersion = await restoreScenarioVersion(parseInt(id), utilisateurId);

    res.json(newVersion);
  } catch (error) {
    console.error('Erreur restauration version scénario:', error);
    res.status(500).json({
      error: 'Erreur lors de la restauration de la version de scénario'
    });
  }
});

/**
 * GET /api/scenario-versions/compare/:id1/:id2
 * Comparer deux versions
 */
router.get('/compare/:id1/:id2', async (req, res) => {
  try {
    const { id1, id2 } = req.params;
    const comparison = await compareScenarioVersions(parseInt(id1), parseInt(id2));

    res.json(comparison);
  } catch (error) {
    console.error('Erreur comparaison versions scénario:', error);
    res.status(500).json({
      error: 'Erreur lors de la comparaison des versions de scénario'
    });
  }
});

export default router;