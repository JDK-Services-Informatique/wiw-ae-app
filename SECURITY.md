# Guide de Sécurité - WIW-AE+

Ce document décrit les mesures de sécurité implémentées dans l'application WIW-AE+ et les bonnes pratiques à suivre pour maintenir un niveau de sécurité optimal.

## 🔒 Mesures de Sécurité Implémentées

### 1. Authentification et Autorisation

#### JWT avec HttpOnly Cookies
- ✅ Les tokens JWT sont stockés dans des **cookies httpOnly** au lieu de localStorage
- ✅ Protection contre les attaques XSS (JavaScript ne peut pas accéder aux cookies httpOnly)
- ✅ Configuration SameSite pour protection CSRF
- ✅ Cookies sécurisés en production (HTTPS uniquement)
- ✅ Durée de vie limitée: 24 heures

**Configuration:**
```javascript
// Les cookies sont automatiquement configurés lors du login
// Voir: backend/src/controllers/auth.controller.js
```

#### Hachage des Mots de Passe
- ✅ bcryptjs avec salt rounds = 10
- ✅ Validation de la complexité des mots de passe (min 8 caractères, majuscule, minuscule, chiffre)
- ✅ Les mots de passe ne sont jamais loggés

#### Vérification des Rôles
- ✅ Système de rôles: USER, ASSISTANT, CHEF_PROJET, ADMIN
- ✅ Middlewares d'autorisation sur toutes les routes protégées
- ✅ Vérifications côté frontend ET backend

### 2. Rate Limiting

Protection contre les attaques par force brute:

- ✅ **Login:** 5 tentatives max par 15 minutes (compte seulement les échecs)
- ✅ **Registration:** 5 tentatives par 15 minutes
- ✅ **Reset Password:** 3 tentatives par heure
- ✅ **API générale:** 100 requêtes par 15 minutes

**Configuration:**
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Pour l'API générale
```

### 3. Validation et Sanitization des Entrées

#### Express-validator
- ✅ Validation de tous les inputs utilisateur
- ✅ Sanitization automatique (trim, normalizeEmail, etc.)
- ✅ Protection contre les injections SQL (via Prisma + validation)
- ✅ Validation des types, longueurs, formats

**Routes validées:**
- `/api/auth/register` - Validation complète des données utilisateur
- `/api/auth/login` - Validation email et mot de passe
- `/api/auth/forgot-password` - Validation email
- `/api/auth/reset-password` - Validation token et nouveau mot de passe

### 4. CORS (Cross-Origin Resource Sharing)

#### Configuration Sécurisée
- ✅ **Production:** Liste blanche stricte, pas de wildcards par défaut
- ✅ **Développement:** Localhost uniquement
- ✅ Credentials autorisés pour les cookies httpOnly
- ✅ Méthodes HTTP limitées: GET, POST, PUT, DELETE, OPTIONS

**Configuration Production (obligatoire):**
```env
# Liste explicite des origins autorisées
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-domain.com

# OU une seule origin principale
CORS_ORIGIN=https://your-app.vercel.app
```

**⚠️ IMPORTANT:** Ne JAMAIS utiliser de wildcards (`*`) en production!

### 5. Security Headers (Helmet.js)

Headers de sécurité configurés:

- ✅ **Content-Security-Policy:** Limite les sources de contenu
- ✅ **HSTS:** Force HTTPS pendant 1 an
- ✅ **X-Content-Type-Options:** Empêche le MIME sniffing
- ✅ **X-Frame-Options:** Protection contre le clickjacking
- ✅ **X-XSS-Protection:** Protection XSS pour anciens navigateurs
- ✅ **Hide X-Powered-By:** Ne révèle pas la stack technique

### 6. Protection des Données Sensibles

#### Variables d'Environnement
- ✅ Toutes les données sensibles dans `.env` (jamais commitées)
- ✅ `.env.example` contient UNIQUEMENT des exemples/placeholders
- ✅ Validation des variables d'environnement au démarrage

**Variables Critiques:**
```env
JWT_SECRET=<générer avec crypto.randomBytes(64).toString('hex')>
DATABASE_URL=postgresql://...
EMAIL_PASSWORD=<app-specific password>
```

#### Logging Sécurisé
- ✅ Aucun mot de passe dans les logs
- ✅ Logger centralisé (backend/src/utils/logger.js)
- ✅ Niveaux de log appropriés (info, warn, error)
- ✅ Pas de données sensibles en production

### 7. Email Sécurisé

#### Réinitialisation de Mot de Passe
- ✅ Tokens cryptographiquement sécurisés (32 bytes)
- ✅ Expiration après 1 heure
- ✅ Usage unique (token marqué comme utilisé)
- ✅ Suppression automatique des anciens tokens
- ✅ Pas de révélation si l'email existe (protection énumération)

**Service Email:**
- Nodemailer configuré avec SMTP
- Templates HTML sécurisés
- Liens avec tokens dans URL (HTTPS uniquement en prod)

### 8. Base de Données

#### Prisma ORM
- ✅ Protection native contre les injections SQL
- ✅ Transactions pour opérations critiques
- ✅ Validation des types au niveau schéma
- ✅ Gestion des erreurs Prisma avec middleware dédié

## 🚀 Configuration pour la Production

### Checklist de Déploiement

Avant de déployer en production, vérifiez:

- [ ] `NODE_ENV=production` défini
- [ ] `JWT_SECRET` généré de manière sécurisée (min 256 bits)
- [ ] `DATABASE_URL` avec credentials de production
- [ ] `ALLOWED_ORIGINS` liste explicite (pas de wildcards)
- [ ] Configuration email (SMTP credentials)
- [ ] `FRONTEND_URL` pointe vers le domaine de production
- [ ] HTTPS activé (certificat SSL valide)
- [ ] Logs configurés pour la production
- [ ] Backups de la base de données configurés
- [ ] Rate limits adaptés au trafic attendu

### Variables d'Environnement Production

```env
# Serveur
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Base de données
DATABASE_URL=postgresql://user:password@host:5432/db

# Sécurité
JWT_SECRET=<256-bit-random-secret>
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=<sendgrid-api-key>
EMAIL_FROM=noreply@example.com

# Frontend
FRONTEND_URL=https://app.example.com

# Rate Limiting (ajuster selon le trafic)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🛡️ Bonnes Pratiques

### Pour les Développeurs

1. **Ne jamais committer:**
   - Fichiers `.env`
   - Credentials réels dans `.env.example`
   - Tokens ou clés API
   - Données de production

2. **Toujours:**
   - Utiliser les middlewares de validation
   - Logger les actions sensibles
   - Tester les permissions avant déploiement
   - Vérifier les types et formats des données
   - Utiliser des transactions pour les opérations critiques

3. **Éviter:**
   - `console.log()` en production (utiliser le logger)
   - Révéler des détails d'erreur en production
   - Hardcoder des valeurs de configuration
   - Désactiver les mesures de sécurité "temporairement"

### Pour les Administrateurs

1. **Monitoring:**
   - Surveiller les logs d'erreurs
   - Vérifier les tentatives de connexion échouées
   - Auditer régulièrement les accès

2. **Mises à jour:**
   - Maintenir les dépendances à jour
   - Appliquer les patches de sécurité rapidement
   - Tester après chaque mise à jour

3. **Backup:**
   - Backups quotidiens de la base de données
   - Tester régulièrement la restauration
   - Stockage sécurisé hors site

## 🔍 Audit de Sécurité

### Dépendances

Vérifier régulièrement les vulnérabilités:

```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

### Tests de Sécurité

Recommandations:
- Tests de pénétration réguliers
- Scan de vulnérabilités (OWASP ZAP, etc.)
- Revue de code focalisée sécurité
- Tests des limites d'authentification

## 📞 Signalement de Vulnérabilités

Si vous découvrez une faille de sécurité:

1. **Ne pas** créer une issue publique GitHub
2. Contacter l'équipe de sécurité en privé
3. Fournir le maximum de détails
4. Attendre confirmation avant divulgation publique

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

**Dernière mise à jour:** 2025-11-29
**Version:** 1.0.0
