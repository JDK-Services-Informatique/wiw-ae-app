import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

/**
 * Demander une réinitialisation de mot de passe
 * POST /api/auth/forgot-password
 * Body: { email: string }
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email requis' });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    // Pour la sécurité, on ne révèle pas si l'email existe ou non
    if (!user) {
      // Attendre un peu pour éviter l'énumération d'emails
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
      });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    // Supprimer les anciens tokens non utilisés
    await prisma.passwordResetToken.deleteMany({
      where: {
        utilisateurId: user.id,
        used: false,
        expiresAt: { lt: new Date() }
      }
    });

    // Créer le nouveau token
    await prisma.passwordResetToken.create({
      data: {
        token,
        utilisateurId: user.id,
        expiresAt
      }
    });

    // Envoyer l'email avec le lien de réinitialisation
    const emailSent = await sendPasswordResetEmail(user.email, token);

    if (!emailSent) {
      logger.warn('Échec de l\'envoi de l\'email de réinitialisation', {
        userId: user.id,
        email: user.email
      });
      // Ne pas révéler l'échec à l'utilisateur pour des raisons de sécurité
    }

    logger.info('Token de réinitialisation généré', {
      userId: user.id,
      email: user.email,
      emailSent
    });

    // En développement, inclure le lien dans la réponse pour faciliter les tests
    const devResponse = process.env.NODE_ENV === 'development' ? {
      resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`
    } : {};

    res.json({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      ...devResponse
    });
  } catch (err) {
    logger.error('Erreur lors de la demande de réinitialisation', { 
      error: err.message, 
      stack: err.stack 
    });
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
  }
};

/**
 * Réinitialiser le mot de passe avec un token
 * POST /api/auth/reset-password
 * Body: { token: string, newPassword: string }
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token et nouveau mot de passe requis' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Trouver le token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { utilisateur: true }
    });

    if (!resetToken) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    // Vérifier si le token est utilisé
    if (resetToken.used) {
      return res.status(400).json({ message: 'Ce token a déjà été utilisé' });
    }

    // Vérifier si le token est expiré
    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: 'Ce token a expiré' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et marquer le token comme utilisé
    await prisma.$transaction([
      prisma.utilisateur.update({
        where: { id: resetToken.utilisateurId },
        data: { motDePasse: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
    ]);

    logger.info('Mot de passe réinitialisé', { userId: resetToken.utilisateurId });

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    logger.error('Erreur lors de la réinitialisation du mot de passe', { 
      error: err.message, 
      stack: err.stack 
    });
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

