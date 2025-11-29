import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import logger from '../utils/logger.js';

// Validation de l'email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper pour configurer les cookies sécurisés
const setCookieOptions = () => ({
  httpOnly: true, // Empêche l'accès JavaScript au cookie (protection XSS)
  secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Protection CSRF
  maxAge: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
  path: '/'
});

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, plan } = req.body;
    const errors = [];
    
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      errors.push('Le nom est obligatoire');
    }
    
    // Prénom est optionnel mais doit être valide si fourni
    if (prenom && (typeof prenom !== 'string' || prenom.trim().length === 0)) {
      errors.push('Le prénom doit être une chaîne valide');
    }
    
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.push('L\'email est obligatoire');
    } else if (!isValidEmail(email.trim())) {
      errors.push('L\'email n\'est pas valide');
    }
    
    if (!motDePasse || typeof motDePasse !== 'string' || motDePasse.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    
    // Ne jamais logger le mot de passe, même hashé
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const user = await prisma.utilisateur.create({
      data: { 
        nom: nom.trim(), 
        prenom: prenom?.trim() || null, 
        email: email.trim().toLowerCase(), 
        motDePasse: hashedPassword, 
        role: role || 'USER', 
        plan: plan || 'GRATUIT' 
      }
    });
    
    // Logger uniquement les informations non sensibles
    logger.info('Nouvel utilisateur créé', { userId: user.id, email: user.email, plan: user.plan });
    
    res.status(201).json({ 
      message: 'Utilisateur créé', 
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email } 
    });
  } catch (err) {
    logger.error('Erreur lors de l\'inscription', { error: err.message, stack: err.stack });
    
    // Gestion des erreurs Prisma
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    
    if (!email || !motDePasse) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }
    
    if (!isValidEmail(email.trim())) {
      return res.status(400).json({ message: 'Format d\'email invalide' });
    }
    
    const user = await prisma.utilisateur.findUnique({ 
      where: { email: email.trim().toLowerCase() } 
    });
    
    if (!user || !await bcrypt.compare(motDePasse, user.motDePasse)) {
      logger.warn('Tentative de connexion échouée', { email: email.trim().toLowerCase() });
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET non défini');
      return res.status(500).json({ message: 'Erreur de configuration serveur' });
    }
    
    const token = jwt.sign(
      { id: user.id, plan: user.plan, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('Connexion réussie', { userId: user.id, email: user.email });

    // Définir le cookie httpOnly avec le token
    res.cookie('token', token, setCookieOptions());

    // Retourner aussi le token dans le body pour compatibilité avec le frontend existant
    // TODO: Supprimer le token du body une fois le frontend migré vers les cookies
    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        plan: user.plan,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Erreur lors de la connexion', { error: err.message, stack: err.stack });
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Supprimer le cookie en définissant une date d'expiration dans le passé
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      expires: new Date(0),
      path: '/'
    });

    logger.info('Déconnexion réussie', { userId: req.user?.id });

    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    logger.error('Erreur lors de la déconnexion', { error: err.message });
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};