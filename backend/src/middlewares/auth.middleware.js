import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    logger.warn('Tentative d\'accès sans token', { path: req.path, method: req.method });
    return res.status(401).json({ message: 'Accès refusé - Token manquant' });
  }
  
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET non défini dans les variables d\'environnement');
    return res.status(500).json({ message: 'Erreur de configuration serveur' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn('Token expiré', { path: req.path });
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (err.name === 'JsonWebTokenError') {
      logger.warn('Token invalide', { path: req.path, error: err.message });
      return res.status(401).json({ message: 'Token invalide' });
    }
    logger.error('Erreur lors de la vérification du token', { error: err.message });
    return res.status(401).json({ message: 'Erreur d\'authentification' });
  }
};