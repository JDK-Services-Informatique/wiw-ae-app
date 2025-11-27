@echo off
REM Script de démarrage local pour WiW Application (Windows)
REM Usage: start-local.bat

echo 🚀 Démarrage de l'application WiW en local...
echo.

REM Vérifier Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier les fichiers .env
if not exist "backend\.env" (
    echo ⚠️  backend\.env n'existe pas
    if exist "backend\env.example" (
        copy backend\env.example backend\.env
        echo ✅ Fichier .env créé depuis .env.example
        echo ⚠️  N'oubliez pas de configurer les variables dans backend\.env
    ) else (
        echo ❌ Créez manuellement backend\.env avec les variables requises
        pause
        exit /b 1
    )
)

if not exist "frontend\.env" (
    echo ⚠️  frontend\.env n'existe pas
    echo VITE_API_URL=http://localhost:4000/api > frontend\.env
    echo ✅ Fichier frontend\.env créé
)

REM Installer les dépendances si nécessaire
if not exist "backend\node_modules" (
    echo 📦 Installation des dépendances backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installation des dépendances frontend...
    cd frontend
    call npm install
    cd ..
)

REM Générer Prisma Client
echo 🔨 Génération du client Prisma...
cd backend
call npm run db:generate
cd ..

echo.
echo 🚀 Démarrage des services...
echo.

REM Démarrer le backend dans un nouveau terminal
start "WiW Backend" cmd /k "cd backend && npm run dev"

REM Attendre un peu
timeout /t 3 /nobreak >nul

REM Démarrer le frontend dans un nouveau terminal
start "WiW Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Services démarrés !
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Les services s'exécutent dans des fenêtres séparées
echo Fermez les fenêtres pour arrêter les services
echo.
pause

