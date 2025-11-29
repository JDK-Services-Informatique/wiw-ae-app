#!/bin/bash

# Script de déploiement Railway avec Root Directory
# Usage: ./deploy-railway.sh

echo "🚀 Déploiement Railway - WIW-AE+ Backend"
echo ""

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI n'est pas installé"
    echo "📦 Installation: npm install -g @railway/cli"
    exit 1
fi

# Se déplacer dans le dossier backend
cd backend || exit

echo "📍 Dossier actuel: $(pwd)"
echo ""

# Login Railway (si pas déjà fait)
echo "🔐 Connexion à Railway..."
railway login

# Lier au projet
echo "🔗 Liaison au projet Railway..."
railway link

# Déployer
echo "🚀 Déploiement en cours..."
railway up

echo ""
echo "✅ Déploiement terminé !"
echo "📊 Voir les logs: railway logs"
