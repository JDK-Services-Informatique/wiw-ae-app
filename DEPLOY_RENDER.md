# Guide de deploiement WIW-AE+ sur Render

## Prerequis

- Compte Render (https://render.com)
- Repository GitHub avec le code source
- PostgreSQL (fourni par Render)

## Methode 1 : Blueprint automatique (recommande)

### Etape 1 : Preparer le repository

1. Push le fichier `render.yaml` a la racine du projet
2. Verifier que la structure est correcte :
   ```
   wiw-ae-app/
   ├── render.yaml          # Configuration Render
   ├── backend/
   │   ├── package.json
   │   ├── prisma/
   │   └── src/
   └── frontend/
       ├── package.json
       └── src/
   ```

### Etape 2 : Deployer via Blueprint

1. Aller sur https://dashboard.render.com
2. Cliquer "New" > "Blueprint"
3. Connecter votre repository GitHub
4. Selectionner la branche (main/master)
5. Render detecte automatiquement `render.yaml`
6. Cliquer "Apply"

### Etape 3 : Verifier le deploiement

Render va creer automatiquement :
- **wiw-ae-backend** : Web Service Node.js
- **wiw-ae-frontend** : Static Site
- **wiw-ae-db** : Base PostgreSQL

Attendre que tous les services soient "Live".

## Methode 2 : Configuration manuelle

### Backend (Web Service)

1. "New" > "Web Service"
2. Connecter le repository
3. Configuration :
   - **Name** : wiw-ae-backend
   - **Root Directory** : backend
   - **Runtime** : Node
   - **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command** : `npm start`
   - **Plan** : Starter ($7/mois) ou Free

4. Variables d'environnement :
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[copier depuis la BDD]
   JWT_SECRET=[generer une cle]
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=[URL du frontend une fois deploye]
   ```

### Frontend (Static Site)

1. "New" > "Static Site"
2. Connecter le repository
3. Configuration :
   - **Name** : wiw-ae-frontend
   - **Root Directory** : frontend
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : dist

4. Variables d'environnement :
   ```
   VITE_API_URL=[URL du backend]
   ```

5. Rewrites (pour le routing SPA) :
   - Source : `/*`
   - Destination : `/index.html`
   - Action : Rewrite

### Base de donnees PostgreSQL

1. "New" > "PostgreSQL"
2. Configuration :
   - **Name** : wiw-ae-db
   - **Database** : wiw_ae_production
   - **User** : wiw_admin
   - **Region** : Frankfurt (proche de la France)
   - **Plan** : Starter ($7/mois) ou Free (90 jours)

3. Copier l'**Internal Database URL** pour le backend

## Post-deploiement

### Initialiser la base de donnees

Si la migration automatique ne s'execute pas :

1. Ouvrir le Shell du backend sur Render
2. Executer :
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Creer un administrateur

```bash
# Dans le Shell Render du backend
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hash = await bcrypt.hash('VotreMotDePasse!', 10);
  await prisma.utilisateur.create({
    data: {
      nom: 'Admin',
      prenom: 'WIW',
      email: 'admin@wiw-ae.com',
      motDePasse: hash,
      role: 'ADMIN',
      plan: 'ENTERPRISE'
    }
  });
  console.log('Admin cree');
}
createAdmin();
"
```

### Verifier les endpoints

- Backend : `https://wiw-ae-backend.onrender.com/api/health`
- Frontend : `https://wiw-ae-frontend.onrender.com`

## Domaine personnalise (optionnel)

1. Aller dans les parametres du service frontend
2. "Custom Domains" > "Add Custom Domain"
3. Suivre les instructions DNS

## Couts estimes

| Service | Plan Free | Plan Starter |
|---------|-----------|--------------|
| Backend | Suspendu apres inactivite | $7/mois |
| Frontend | Gratuit | Gratuit |
| PostgreSQL | 90 jours gratuits | $7/mois |
| **Total** | **Gratuit (limite)** | **$14/mois** |

## Troubleshooting

### Le backend ne demarre pas

1. Verifier les logs dans Render Dashboard
2. Verifier DATABASE_URL
3. Executer `npx prisma migrate deploy` manuellement

### Erreur CORS

1. Verifier que FRONTEND_URL est correct dans le backend
2. Verifier que CORS_ORIGIN inclut le domaine frontend

### Frontend ne charge pas les donnees

1. Verifier VITE_API_URL dans le frontend
2. S'assurer que l'URL pointe vers le backend Render

### Base de donnees vide

```bash
npx prisma db seed
```

## CI/CD avec GitHub Actions

Creer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## Support

- Documentation Render : https://render.com/docs
- Status Render : https://status.render.com
