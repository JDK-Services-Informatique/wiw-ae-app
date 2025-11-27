#!/bin/bash

# Script de démarrage local pour WiW Application
# Usage: ./start-local.sh

echo "🚀 Démarrage de l'application WiW en local..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ est requis (version actuelle: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) détecté${NC}"

# Vérifier les fichiers .env
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env n'existe pas${NC}"
    echo "Création d'un fichier .env.example..."
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        echo -e "${GREEN}✅ Fichier .env créé depuis .env.example${NC}"
        echo -e "${YELLOW}⚠️  N'oubliez pas de configurer les variables dans backend/.env${NC}"
    else
        echo -e "${RED}❌ Créez manuellement backend/.env avec les variables requises${NC}"
        exit 1
    fi
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env n'existe pas${NC}"
    echo "Création d'un fichier .env..."
    echo "VITE_API_URL=http://localhost:4000/api" > frontend/.env
    echo -e "${GREEN}✅ Fichier frontend/.env créé${NC}"
fi

# Installer les dépendances si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances frontend...${NC}"
    cd frontend && npm install && cd ..
fi

# Générer Prisma Client
echo -e "${YELLOW}🔨 Génération du client Prisma...${NC}"
cd backend
npm run db:generate
cd ..

# Démarrer les services
echo ""
echo -e "${GREEN}🚀 Démarrage des services...${NC}"
echo ""

# Fonction pour nettoyer les processus à la sortie
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt des services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Démarrer le backend
echo -e "${GREEN}📡 Démarrage du backend sur http://localhost:4000${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Attendre un peu que le backend démarre
sleep 3

# Démarrer le frontend
echo -e "${GREEN}🌐 Démarrage du frontend sur http://localhost:5173${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Services démarrés !${NC}"
echo ""
echo "Backend:  http://localhost:4000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les services"

# Attendre que les processus se terminent
wait

