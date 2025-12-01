# ⚡ Quick Start - Neon + Vercel

Guide ultra-rapide pour déployer WIW-AE+ en production.

---

## 🔥 Commandes Essentielles

### 1️⃣ Créer Base de Données Neon

1. https://console.neon.tech → New Project
2. Nom : `wiw-ae-production`
3. Région : `Europe (Frankfurt)`
4. Copiez la **Connection String**

### 2️⃣ Migrer le Schéma Prisma

```bash
cd backend
echo 'DATABASE_URL="votre-connection-string-neon"' > .env.local
npx prisma generate
npx prisma db push
```

✅ Vérifiez : `npx prisma studio`

### 3️⃣ Générer JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat (64 caractères)

### 4️⃣ Créer App Password Gmail

1. Google Account → Sécurité → Validation en deux étapes
2. Mots de passe des applications → Mail → Créer
3. Copiez le mot de passe (16 caractères)

---

## 🚀 Déploiement Vercel

### Backend

1. https://vercel.com/new → Import `wiw-ae-app`
2. **Configure** :
   - Project Name: `wiw-ae-backend`
   - Root Directory: `backend/`
   - Build Command: `npm ci && npx prisma generate`
3. **Environment Variables** :
   ```bash
   DATABASE_URL=postgresql://...neon.tech/...
   JWT_SECRET=votre-secret-64-chars
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=votre-email@gmail.com
   EMAIL_PASSWORD=votre-app-password-16-chars
   EMAIL_FROM=noreply@wiw-ae.com
   FRONTEND_URL=https://wiw-ae-frontend.vercel.app
   NODE_ENV=production
   ```
4. **Deploy** 🚀
5. **Testez** : `curl https://wiw-ae-backend.vercel.app/api/health`

### Frontend

1. https://vercel.com/new → Import `wiw-ae-app` (encore)
2. **Configure** :
   - Project Name: `wiw-ae-frontend`
   - Root Directory: `frontend/`
   - Framework: `Vite`
3. **Environment Variables** :
   ```bash
   VITE_API_URL=https://wiw-ae-backend.vercel.app/api
   ```
4. **Deploy** 🚀

### Mise à Jour CORS

1. Backend Vercel → Settings → Environment Variables
2. Modifiez `FRONTEND_URL` avec l'URL réelle du frontend
3. Redeploy le backend

---

## ✅ Checklist

- [ ] Neon project créé
- [ ] `DATABASE_URL` récupérée
- [ ] `npx prisma db push` réussi
- [ ] `JWT_SECRET` généré
- [ ] App Password Gmail créé
- [ ] Backend Vercel déployé
- [ ] `/api/health` répond
- [ ] Frontend Vercel déployé
- [ ] `FRONTEND_URL` mise à jour
- [ ] Backend redéployé
- [ ] Login/Signup fonctionne

---

## 🐛 Erreurs Fréquentes

### "Database connection failed"
→ Vérifiez `DATABASE_URL` avec `?sslmode=require`

### "CORS blocked"
→ Vérifiez `FRONTEND_URL` exacte dans backend

### "Prisma Client not generated"
→ Build Command : `npm ci && npx prisma generate`

---

## 📚 Guide Complet

Voir : `DEPLOY_NEON_VERCEL.md`

---

## 🎯 URLs Importantes

- **Neon Console** : https://console.neon.tech
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Prisma Studio** : `cd backend && npx prisma studio`

Bonne chance ! 🚀
