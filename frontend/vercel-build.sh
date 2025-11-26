#!/bin/bash

# Script d'installation pour déploiement Vercel avec tests
# Ce script s'exécute automatiquement lors du build Vercel

set -e

echo "🔧 Installation WIW Frontend - Cloud Deployment"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci

# Installation des browsers Playwright pour les tests E2E
if [ "$VERCEL_ENV" = "production" ] || [ "$VERCEL_ENV" = "preview" ]; then
  echo "🎭 Installation Playwright browsers..."
  npx playwright install --with-deps chromium firefox webkit
fi

# Build de production
echo "🔨 Build de production..."
npm run build

# Tests rapides (uniquement en preview)
if [ "$VERCEL_ENV" = "preview" ]; then
  echo "🧪 Tests unitaires rapides..."
  npm run test -- --run --reporter=verbose || echo "Tests unitaires échoués, mais build continue"
fi

echo "✅ Installation et build terminés!"

# Le déploiement continue automatiquement sur Vercel