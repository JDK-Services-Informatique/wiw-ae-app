# 🔑 Configuration API Render

## Vue d'ensemble

L'API Render permet de gérer vos services et ressources programmatiquement. Elle peut être utilisée pour :
- Déclencher des déploiements
- Gérer les services
- Consulter les logs et métriques
- Automatiser les tâches de déploiement

Documentation complète : [https://render.com/docs/api](https://render.com/docs/api)

---

## 📝 Étape 1 : Créer une clé API

### Via le Dashboard Render

1. **Accéder aux paramètres du compte**
   - Allez sur https://dashboard.render.com
   - Cliquez sur votre profil (en haut à droite)
   - Sélectionnez **"Account Settings"**

2. **Créer une nouvelle clé API**
   - Dans le menu de gauche, cliquez sur **"API Keys"**
   - Cliquez sur **"Create API Key"**
   - Donnez un nom descriptif (ex: "GitHub Actions CI/CD")
   - Cliquez sur **"Create"**

3. **Copier la clé API**
   - ⚠️ **IMPORTANT** : La clé n'est affichée qu'une seule fois lors de la création
   - Copiez-la immédiatement et stockez-la de manière sécurisée
   - Si vous perdez la clé, vous devrez en créer une nouvelle

### Sécurité

> ⚠️ **Les clés API sont des identifiants secrets !**
>
> - ❌ Ne les commitez jamais dans le code
> - ❌ Ne les partagez pas publiquement
> - ✅ Utilisez des secrets GitHub pour les workflows CI/CD
> - ✅ Stockez-les dans des variables d'environnement sécurisées
> - ✅ Révoquez-les immédiatement si elles sont compromises

---

## 🧪 Étape 2 : Tester la clé API

### Test basique avec curl

```bash
# Remplacez YOUR_API_KEY par votre clé API
curl --request GET \
     --url 'https://api.render.com/v1/services?limit=20' \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer YOUR_API_KEY'
```

Si la clé est valide, vous recevrez une réponse `200` avec la liste de vos services.

### Test avec Node.js

```javascript
const axios = require('axios');

async function testRenderAPI() {
  const apiKey = process.env.RENDER_API_KEY;
  
  try {
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      params: {
        limit: 20
      }
    });
    
    console.log('Services:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

testRenderAPI();
```

---

## 🔄 Étape 3 : Utiliser l'API dans GitHub Actions

### Configuration des secrets GitHub

1. **Aller dans les paramètres du repository**
   - GitHub → Votre repository → **Settings** → **Secrets and variables** → **Actions**

2. **Ajouter le secret**
   - Cliquez sur **"New repository secret"**
   - **Name** : `RENDER_API_KEY`
   - **Value** : Collez votre clé API Render
   - Cliquez sur **"Add secret"**

### Exemple de workflow GitHub Actions

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: |
          curl --request POST \
            --url "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            --header 'Accept: application/json' \
            --header 'Authorization: Bearer ${{ secrets.RENDER_API_KEY }}' \
            --header 'Content-Type: application/json' \
            --data '{"clearCache": false}'
```

---

## 📚 Endpoints API utiles

### Lister les services

```bash
GET https://api.render.com/v1/services
```

### Obtenir les détails d'un service

```bash
GET https://api.render.com/v1/services/{serviceId}
```

### Déclencher un déploiement

```bash
POST https://api.render.com/v1/services/{serviceId}/deploys
```

### Consulter les logs

```bash
GET https://api.render.com/v1/services/{serviceId}/logs
```

### Obtenir les métriques

```bash
GET https://api.render.com/v1/services/{serviceId}/metrics
```

---

## 🔍 Trouver l'ID d'un service

### Via le Dashboard

1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service
3. L'URL contient l'ID : `https://dashboard.render.com/web/services/{serviceId}`

### Via l'API

```bash
curl --request GET \
     --url 'https://api.render.com/v1/services' \
     --header 'Authorization: Bearer YOUR_API_KEY' \
     | jq '.[] | {name: .service.name, id: .service.id}'
```

---

## 🚀 Exemples d'utilisation

### Script de déploiement automatique

```bash
#!/bin/bash
# deploy.sh - Script de déploiement automatique

RENDER_API_KEY="${RENDER_API_KEY}"
SERVICE_ID="${RENDER_SERVICE_ID}"

if [ -z "$RENDER_API_KEY" ] || [ -z "$SERVICE_ID" ]; then
  echo "❌ RENDER_API_KEY et SERVICE_ID doivent être définis"
  exit 1
fi

echo "🚀 Déclenchement du déploiement..."

RESPONSE=$(curl -s --request POST \
  --url "https://api.render.com/v1/services/${SERVICE_ID}/deploys" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer ${RENDER_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{"clearCache": false}')

DEPLOY_ID=$(echo $RESPONSE | jq -r '.deploy.id')

if [ "$DEPLOY_ID" != "null" ]; then
  echo "✅ Déploiement déclenché : $DEPLOY_ID"
  echo "📊 Suivre le déploiement : https://dashboard.render.com/web/services/${SERVICE_ID}/deploys/${DEPLOY_ID}"
else
  echo "❌ Erreur lors du déploiement"
  echo "$RESPONSE" | jq '.'
  exit 1
fi
```

### Intégration avec GitHub Actions

Voir le fichier `.github/workflows/ci-cd.yml` pour un exemple complet.

---

## 📖 Documentation complète

- **API Reference** : [https://api-docs.render.com](https://api-docs.render.com)
- **Documentation API** : [https://render.com/docs/api](https://render.com/docs/api)
- **OpenAPI Spec** : [https://api-docs.render.com/openapi/6140fb3daeae351056086186](https://api-docs.render.com/openapi/6140fb3daeae351056086186)

---

## ⚠️ Limitations et bonnes pratiques

### Limitations

- Les clés API ont les mêmes permissions que votre compte
- Limite de taux : 100 requêtes/minute par défaut
- Les clés API expirent après 1 an d'inactivité

### Bonnes pratiques

1. **Utilisez des clés API dédiées** pour chaque environnement (dev, staging, prod)
2. **Rotez les clés régulièrement** (tous les 6-12 mois)
3. **Surveillez l'utilisation** via les logs d'audit
4. **Limitez les permissions** en créant des comptes de service si possible
5. **Ne stockez jamais les clés** dans le code source

---

**Dernière mise à jour** : Décembre 2024  
**Référence** : [https://render.com/docs/api](https://render.com/docs/api)

