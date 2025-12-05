# Prompt pour recréer le projet WIW-AE+ de façon propre

Utilise ce prompt comme cahier des charges pour régénérer le dépôt depuis zéro avec un socle clair, cohérent et sécurisé.

---

Tu es **GPT-5.1-Codex-Max**, expert en ingénierie logicielle full‑stack (Node.js / Express / Prisma / PostgreSQL côté backend et React / Vite / Tailwind côté frontend). Tu dois recréer un monorepo `wiw-ae-app` propre, prêt à être développé, testé et déployé.

## 1) Structure à produire
- Racine : documentation et scripts de démarrage, plus deux sous-dossiers `backend/` et `frontend/`.
- `backend/` : API REST Express, Prisma pour l'accès PostgreSQL, scripts `dev`, `start`, `lint`, `test` et génération Prisma (`prisma generate`).
- `frontend/` : Vite + React + Tailwind, scripts `dev`, `build`, `preview`, `lint`, `test`.
- Chaque package possède son propre `package.json` et verrou (`package-lock.json`).

## 2) Fonctionnalités minimales
- Backend :
  - Endpoint `/api/honoraires` acceptant `{ partenaires: [{ nom, coutHoraire }] }` et renvoyant un calcul basé sur la formule OPC 1993.
  - Example Prisma schema avec tables `Utilisateur`, `Projet`, `Offre`, `Reference`, `TemplateDocument` pour couvrir les thèmes du produit (gestion d'offres, calcul d'honoraires, références, templates).
  - Gestion d'erreurs centralisée, en-tête `x-powered-by` masqué, CORS configurable, limites de payload JSON/URL-encoded, logging minimal.
  - Arrêt gracieux : capture des signaux, fermeture du serveur HTTP et déconnexion Prisma.
- Frontend :
  - Page d'accueil listant les modules (Appels d'Offres, Calcul d'Honoraires, Gestion d'Équipe, Références, Analytics, Templates).
  - Page Analytics utilisant `recharts` pour illustrer un graphique simple.
  - Possibilité de configurer l'URL API via `VITE_API_URL`.

## 3) Qualité et sécurité
- TypeScript facultatif mais ESLint + Prettier recommandés pour les deux packages.
- Tests unitaires de base (ex. validation de la route `/api/honoraires` et rendu d'un composant React).
- Variables d'environnement : fichiers `.env.example` pour chaque package ; backend nécessite `DATABASE_URL`.
- Ne pas committer de secrets. Utiliser des scripts de seed/dummy data pour les démos.
- Configurer CORS, taux de transfert des bodies et désactiver `x-powered-by` par défaut.

## 4) Déploiement et scripts
- Prévoir une configuration Nixpacks ou Railway pour le backend (inclure `DATABASE_URL` à la génération Prisma) et une configuration Vercel/Netlify basique pour le frontend.
- Fournir instructions README succinctes pour l'installation locale (npm install, prisma migrate dev, npm run dev) et pour le déploiement sur Railway/Vercel.

## 5) Livrables attendus
- Code propre, linté, avec scripts npm fonctionnels.
- Documentation claire (README à la racine + README dans `backend/` et `frontend/`).
- Aucun fichier inutile ou artefact de build.

Réponds uniquement en livrant l'arborescence et les fichiers nécessaires ; n'ajoute ni texte superflu ni excuses.
