// Middleware pour valider les fichiers uploadés
import multer from 'multer';
import logger from '../utils/logger.js';

// Configuration par défaut
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Configuration du stockage en mémoire (pour traitement ultérieur)
const storage = multer.memoryStorage();

// Filtre pour les images
const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Types autorisés: ${ALLOWED_IMAGE_TYPES.join(', ')}`), false);
  }
};

// Filtre pour les documents
const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Types autorisés: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

// Configuration multer pour les images
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10 // Maximum 10 fichiers
  },
  fileFilter: imageFilter
});

// Configuration multer pour les documents
export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 fichiers
  },
  fileFilter: documentFilter
});

// Middleware pour valider la taille des fichiers après upload
export const validateFileSize = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const oversizedFiles = req.files.filter(file => file.size > MAX_FILE_SIZE);
  
  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles.map(f => f.originalname).join(', ');
    logger.warn('Fichiers trop volumineux rejetés', { files: fileNames });
    return res.status(400).json({
      error: 'Fichiers trop volumineux',
      message: `Les fichiers suivants dépassent la taille maximale de ${MAX_FILE_SIZE / 1024 / 1024} MB: ${fileNames}`
    });
  }

  next();
};

// Middleware pour valider le nombre de fichiers
export const validateFileCount = (maxFiles = 10) => {
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    if (req.files.length > maxFiles) {
      logger.warn('Trop de fichiers uploadés', { count: req.files.length, max: maxFiles });
      return res.status(400).json({
        error: 'Trop de fichiers',
        message: `Maximum ${maxFiles} fichiers autorisés, ${req.files.length} fournis`
      });
    }

    next();
  };
};

export default {
  uploadImage,
  uploadDocument,
  validateFileSize,
  validateFileCount
};

