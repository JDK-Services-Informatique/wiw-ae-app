import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Configuration du transporteur d'emails
const createTransporter = () => {
  // Vérifier si les variables d'environnement sont configurées
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('Configuration email manquante - les emails ne seront pas envoyés');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true pour port 465, false pour les autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} to - Adresse email du destinataire
 * @param {string} resetToken - Token de réinitialisation
 * @returns {Promise<boolean>} - True si l'email a été envoyé avec succès
 */
export const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      logger.error('Impossible d\'envoyer l\'email - transporteur non configuré');
      return false;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"WIW-AE+ Support" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: 'Réinitialisation de votre mot de passe - WIW-AE+',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            .warning { color: #DC2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>WIW-AE+</h1>
            </div>
            <div class="content">
              <h2>Réinitialisation de mot de passe</h2>
              <p>Bonjour,</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </p>
              <p>Ou copiez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              <p class="warning">⚠️ Ce lien est valide pendant 1 heure seulement.</p>
              <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</p>
              <p>Cordialement,<br>L'équipe WIW-AE+</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>&copy; ${new Date().getFullYear()} WIW-AE+. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de mot de passe - WIW-AE+

        Bonjour,

        Vous avez demandé la réinitialisation de votre mot de passe.
        Cliquez sur ce lien pour créer un nouveau mot de passe :

        ${resetUrl}

        ⚠️ Ce lien est valide pendant 1 heure seulement.

        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

        Cordialement,
        L'équipe WIW-AE+
      `
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email de réinitialisation envoyé', {
      to,
      messageId: info.messageId,
      response: info.response
    });

    return true;
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de réinitialisation', {
      to,
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};

/**
 * Envoie un email de bienvenue lors de l'inscription
 * @param {string} to - Adresse email du destinataire
 * @param {string} nom - Nom de l'utilisateur
 * @returns {Promise<boolean>} - True si l'email a été envoyé avec succès
 */
export const sendWelcomeEmail = async (to, nom) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      logger.warn('Impossible d\'envoyer l\'email de bienvenue - transporteur non configuré');
      return false;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const mailOptions = {
      from: `"WIW-AE+ Support" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: 'Bienvenue sur WIW-AE+ !',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bienvenue sur WIW-AE+ !</h1>
            </div>
            <div class="content">
              <p>Bonjour ${nom},</p>
              <p>Merci de vous être inscrit sur WIW-AE+, votre solution de gestion de projets pour architectes et bureaux d'études techniques.</p>
              <p>Vous pouvez maintenant accéder à toutes nos fonctionnalités :</p>
              <ul>
                <li>✅ Gestion de projets et devis</li>
                <li>✅ Suivi des appels d'offres</li>
                <li>✅ Gestion d'équipe et ressources</li>
                <li>✅ Calcul d'honoraires</li>
                <li>✅ Tableaux de bord et analyses</li>
              </ul>
              <p style="text-align: center;">
                <a href="${frontendUrl}" class="button">Accéder à mon compte</a>
              </p>
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              <p>Cordialement,<br>L'équipe WIW-AE+</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WIW-AE+. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Bienvenue sur WIW-AE+ !

        Bonjour ${nom},

        Merci de vous être inscrit sur WIW-AE+.

        Accédez à votre compte : ${frontendUrl}

        Cordialement,
        L'équipe WIW-AE+
      `
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email de bienvenue envoyé', {
      to,
      messageId: info.messageId
    });

    return true;
  } catch (error) {
    logger.error('Erreur lors de l\'envoi de l\'email de bienvenue', {
      to,
      error: error.message
    });
    return false;
  }
};
