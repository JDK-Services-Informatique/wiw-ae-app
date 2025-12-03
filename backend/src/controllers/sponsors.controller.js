import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/sponsors
 * Récupérer la liste des sponsors actifs
 */
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { actif: true },
      orderBy: { ordre: 'asc' },
      select: {
        id: true,
        nom: true,
        logo: true,
        url: true,
        description: true,
        ordre: true
      }
    });

    res.json(sponsors);
  } catch (error) {
    console.error('Erreur lors de la récupération des sponsors:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des sponsors',
      details: error.message
    });
  }
};

/**
 * GET /api/sponsors/:id
 * Récupérer un sponsor par son ID
 */
export const getSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: parseInt(id) }
    });

    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor introuvable' });
    }

    res.json(sponsor);
  } catch (error) {
    console.error('Erreur lors de la récupération du sponsor:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du sponsor',
      details: error.message
    });
  }
};

/**
 * POST /api/sponsors
 * Créer un nouveau sponsor (admin uniquement)
 */
export const createSponsor = async (req, res) => {
  try {
    const { nom, logo, url, description, ordre } = req.body;

    // Validation basique
    if (!nom || !logo) {
      return res.status(400).json({
        error: 'Le nom et le logo sont obligatoires'
      });
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        nom,
        logo,
        url: url || null,
        description: description || null,
        ordre: ordre || 0,
        utilisateurId: req.user?.id || null
      }
    });

    res.status(201).json(sponsor);
  } catch (error) {
    console.error('Erreur lors de la création du sponsor:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du sponsor',
      details: error.message
    });
  }
};

/**
 * PUT /api/sponsors/:id
 * Mettre à jour un sponsor (admin uniquement)
 */
export const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, logo, url, description, ordre, actif } = req.body;

    const sponsor = await prisma.sponsor.update({
      where: { id: parseInt(id) },
      data: {
        ...(nom !== undefined && { nom }),
        ...(logo !== undefined && { logo }),
        ...(url !== undefined && { url }),
        ...(description !== undefined && { description }),
        ...(ordre !== undefined && { ordre }),
        ...(actif !== undefined && { actif })
      }
    });

    res.json(sponsor);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du sponsor:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sponsor introuvable' });
    }
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du sponsor',
      details: error.message
    });
  }
};

/**
 * DELETE /api/sponsors/:id
 * Supprimer un sponsor (admin uniquement)
 */
export const deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sponsor.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Sponsor supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du sponsor:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Sponsor introuvable' });
    }
    res.status(500).json({
      error: 'Erreur lors de la suppression du sponsor',
      details: error.message
    });
  }
};
