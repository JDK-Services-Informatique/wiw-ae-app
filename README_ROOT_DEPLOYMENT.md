# Railway Monorepo - Ne PAS builder depuis la racine

Ce projet nécessite des services séparés pour backend et frontend.

Si vous voyez cette erreur, le Root Directory n'est PAS configuré.

## Configuration Requise

Chaque service DOIT avoir son Root Directory configuré:

- **Backend Service**: Root Directory = `backend`
- **Frontend Service**: Root Directory = `frontend`

## Instructions

1. Supprimer ce service (il ne peut pas builder depuis la racine)
2. Créer 2 nouveaux services
3. Configurer Root Directory pour chaque service
4. Voir: RAILWAY_MONOREPO_CONFIG.md
