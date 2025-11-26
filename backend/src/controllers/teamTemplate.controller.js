import { Router } from 'express';
import {
  createTeamTemplate,
  getTeamTemplates,
  getTeamTemplate,
  updateTeamTemplate,
  deleteTeamTemplate,
  applyTeamTemplate
} from '../services/teamTemplate.service.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

/**
 * POST /api/team-templates
 * Créer un nouveau template d'équipe
 */
router.post('/', async (req, res) => {
  try {
    const utilisateurId = req.user.id;
    const template = await createTeamTemplate(req.body, utilisateurId);

    res.status(201).json(template);
  } catch (error) {
    console.error('Erreur création template équipe:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du template d\'équipe'
    });
  }
});

/**
 * GET /api/team-templates
 * Récupérer tous les templates d'équipe
 */
router.get('/', async (req, res) => {
  try {
    const utilisateurId = req.user.id;
    const templates = await getTeamTemplates(utilisateurId);

    res.json(templates);
  } catch (error) {
    console.error('Erreur récupération templates équipe:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des templates d\'équipe'
    });
  }
});

/**
 * GET /api/team-templates/:id
 * Récupérer un template spécifique
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const template = await getTeamTemplate(parseInt(id));

    res.json(template);
  } catch (error) {
    console.error('Erreur récupération template équipe:', error);
    if (error.message === 'Template non trouvé') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({
      error: 'Erreur lors de la récupération du template d\'équipe'
    });
  }
});

/**
 * PUT /api/team-templates/:id
 * Mettre à jour un template d'équipe
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const template = await updateTeamTemplate(parseInt(id), req.body);

    res.json(template);
  } catch (error) {
    console.error('Erreur mise à jour template équipe:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du template d\'équipe'
    });
  }
});

/**
 * DELETE /api/team-templates/:id
 * Supprimer un template d'équipe
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTeamTemplate(parseInt(id));

    res.json({ message: 'Template supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression template équipe:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du template d\'équipe'
    });
  }
});

/**
 * POST /api/team-templates/:id/apply
 * Appliquer un template à un projet
 */
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { projetId } = req.body;
    const utilisateurId = req.user.id;

    if (!projetId) {
      return res.status(400).json({
        error: 'projetId est requis'
      });
    }

    const equipe = await applyTeamTemplate(parseInt(id), parseInt(projetId), utilisateurId);

    res.json(equipe);
  } catch (error) {
    console.error('Erreur application template équipe:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'application du template d\'équipe'
    });
  }
});

export default router;