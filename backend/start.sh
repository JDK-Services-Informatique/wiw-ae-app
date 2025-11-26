#!/bin/bash
set -e

# Safe startup script for Koyeb/other hosts
# Runs Prisma setup then starts the node server.

echo "🚀 Starting WiW Backend..."
echo "📋 Environment check:"

# Check Node.js
echo "  - Node version: $(node --version)"
echo "  - NPM version: $(npm --version)"

# Check if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "  - DATABASE_URL: Configured ✅"
else
  echo "  - DATABASE_URL: Not set ❌ - Application will fail to start"
  exit 1
fi

# Check if JWT_SECRET is set
if [ -n "$JWT_SECRET" ]; then
  echo "  - JWT_SECRET: Configured ✅"
else
  echo "  - JWT_SECRET: Not set ❌ - Application will fail to start"
  exit 1
fi

echo ""
echo "🔧 Setting up Prisma..."

# Generate Prisma client
echo "  - Generating Prisma client..."
if npx prisma generate; then
  echo "  - Prisma client generated ✅"
else
  echo "  - Prisma client generation failed ❌"
  exit 1
fi

# Run migrations if database is configured
if [ -n "$DATABASE_URL" ]; then
  echo "  - Running database migrations..."
  if npx prisma migrate deploy; then
    echo "  - Migrations completed ✅"
  else
    echo "  - Migrations failed ⚠️ (continuing anyway)"
    # Don't exit here, some deployments might not need migrations
  fi
else
  echo "  - Skipping migrations (no DATABASE_URL)"
fi

echo ""
echo "🌟 Starting Node.js server..."
echo "  - Command: node src/server.js"
echo "  - Port: ${PORT:-4000}"
echo ""

# Start the server
exec node src/server.js
