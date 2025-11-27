# Dockerfile pour Railway (fallback si Nixpacks ne fonctionne pas)
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production

# Générer Prisma Client
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]

