@echo off
echo ========================================
echo   Demarrage du Backend WIW-AE+
echo ========================================
echo.

cd backend

if not exist .env (
    echo [1/5] Creation du fichier .env...
    copy env.example .env
    echo.
    echo ⚠️  ATTENTION: Configurez JWT_SECRET dans backend/.env
    echo    Generer un secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    echo.
    pause
)

echo [2/5] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation
    pause
    exit /b 1
)

echo.
echo [3/5] Generation Prisma Client...
call npm run db:generate
if errorlevel 1 (
    echo ❌ Erreur lors de la generation Prisma
    pause
    exit /b 1
)

echo.
echo [4/5] Initialisation de la base de donnees...
call npm run db:push
if errorlevel 1 (
    echo ❌ Erreur lors de l'initialisation de la base
    pause
    exit /b 1
)

echo.
echo [5/5] Demarrage du serveur backend...
echo.
echo ✅ Le backend sera accessible sur http://localhost:4000
echo.
call npm run dev

