# 🌐 Configuration Domaines Personnalisés

Configuration des domaines `wiw-ae-plus.com`, `wiw-ae-plus.fr` et `wiw-ae-plus.net`.

---

## 📋 Architecture des Domaines

### Domaines Disponibles
- **wiw-ae-plus.com** → Domaine principal (frontend)
- **wiw-ae-plus.fr** → Redirection vers .com
- **wiw-ae-plus.net** → Redirection vers .com
- **api.wiw-ae-plus.com** → Backend API

### Stratégie de Redirection

```
┌─────────────────────────┐
│  wiw-ae-plus.fr         │ ──┐
│  wiw-ae-plus.net        │ ──┤ Redirection 301
└─────────────────────────┘   │
                              ↓
┌─────────────────────────────────────┐
│  wiw-ae-plus.com (Principal)        │
│  Application Frontend               │
└──────────────┬──────────────────────┘
               │ API Calls
               ↓
┌─────────────────────────────────────┐
│  api.wiw-ae-plus.com                │
│  Backend API                        │
└──────────────┬──────────────────────┘
               │ PostgreSQL
               ↓
┌─────────────────────────────────────┐
│  Neon PostgreSQL Database           │
└─────────────────────────────────────┘
```

---

## 🚀 Configuration Vercel

### 1. Backend API : api.wiw-ae-plus.com

#### Configuration Projet Vercel
```
Project Name: wiw-ae-backend
Root Directory: backend/
Framework: Other
Build Command: npm run build
```

#### Environment Variables
```bash
# Database
DATABASE_URL=votre-connection-string-neon

# JWT
JWT_SECRET=70d3e1d96841c6cbb722912a66752722d089e509f9f06069ad5226ce396bad92

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password-gmail
EMAIL_FROM=noreply@wiw-ae-plus.com

# CORS - Autoriser tous les domaines
ALLOWED_ORIGINS=https://wiw-ae-plus.com,https://www.wiw-ae-plus.com,https://wiw-ae-plus.fr,https://www.wiw-ae-plus.fr,https://wiw-ae-plus.net,https://www.wiw-ae-plus.net

# Domaine principal frontend
FRONTEND_URL=https://wiw-ae-plus.com

# Node
NODE_ENV=production
```

#### Domaine Personnalisé Vercel
1. **Backend Vercel Project** → **Settings** → **Domains**
2. **Add Domain** : `api.wiw-ae-plus.com`
3. Configurer DNS (voir section DNS ci-dessous)

---

### 2. Frontend : wiw-ae-plus.com (Principal)

#### Configuration Projet Vercel
```
Project Name: wiw-ae-frontend
Root Directory: frontend/
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

#### Environment Variable
```bash
VITE_API_URL=https://api.wiw-ae-plus.com/api
```

#### Domaines Personnalisés Vercel
1. **Frontend Vercel Project** → **Settings** → **Domains**
2. **Add Domains** :
   - `wiw-ae-plus.com` (Principal)
   - `www.wiw-ae-plus.com` → Redirect to `wiw-ae-plus.com`

---

### 3. Redirections : .fr et .net vers .com

#### Option A : Redirections DNS (Recommandé)

Si votre registrar de domaines supporte les redirections :
- `wiw-ae-plus.fr` → `https://wiw-ae-plus.com` (301)
- `www.wiw-ae-plus.fr` → `https://wiw-ae-plus.com` (301)
- `wiw-ae-plus.net` → `https://wiw-ae-plus.com` (301)
- `www.wiw-ae-plus.net` → `https://wiw-ae-plus.com` (301)

#### Option B : Projets Vercel de Redirection

Si vous devez gérer les redirections dans Vercel :

1. **Créer `vercel-redirects`** (nouveau projet Vercel)
2. **Ajouter les domaines** :
   - `wiw-ae-plus.fr`
   - `www.wiw-ae-plus.fr`
   - `wiw-ae-plus.net`
   - `www.wiw-ae-plus.net`
3. **Créer `vercel.json`** dans le projet de redirection :
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://wiw-ae-plus.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## 🔧 Configuration DNS

### Pour api.wiw-ae-plus.com (Backend)

Chez votre registrar DNS (ex: Cloudflare, OVH, Gandi), ajoutez :

```
Type: CNAME
Name: api
Target: cname.vercel-dns.com.
TTL: Auto
```

Vercel vous donnera le CNAME exact lors de l'ajout du domaine.

### Pour wiw-ae-plus.com (Frontend)

#### Configuration A Record (Apex domain)
```
Type: A
Name: @
Target: 76.76.21.21  (IP Vercel)
TTL: Auto
```

#### Configuration www (CNAME)
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com.
TTL: Auto
```

### Pour wiw-ae-plus.fr et .net (Redirections)

#### Option A : Redirection DNS Native
Configurez la redirection dans votre registrar (si supporté).

#### Option B : Via Vercel
Même configuration que pour .com, mais pointant vers le projet de redirection.

---

## 📝 Checklist de Configuration

### Backend API
- [ ] Projet Vercel créé avec Root Directory `backend/`
- [ ] Environment variables configurées (9 variables)
- [ ] `ALLOWED_ORIGINS` contient tous les domaines (.com, .fr, .net + www)
- [ ] Domaine `api.wiw-ae-plus.com` ajouté dans Vercel
- [ ] DNS CNAME `api` configuré
- [ ] SSL/TLS vérifié ✅
- [ ] Test : `curl https://api.wiw-ae-plus.com/api/health`

### Frontend Principal
- [ ] Projet Vercel créé avec Root Directory `frontend/`
- [ ] `VITE_API_URL=https://api.wiw-ae-plus.com/api` configuré
- [ ] Domaine `wiw-ae-plus.com` ajouté dans Vercel
- [ ] Domaine `www.wiw-ae-plus.com` ajouté (redirect to apex)
- [ ] DNS A record `@` configuré
- [ ] DNS CNAME `www` configuré
- [ ] SSL/TLS vérifié ✅
- [ ] Test : Ouvrir `https://wiw-ae-plus.com`

### Redirections .fr et .net
- [ ] Redirections DNS configurées OU
- [ ] Projet Vercel de redirection créé
- [ ] Domaines .fr et .net ajoutés
- [ ] DNS configuré pour .fr et .net
- [ ] Test redirections :
  - [ ] `https://wiw-ae-plus.fr` → `https://wiw-ae-plus.com`
  - [ ] `https://wiw-ae-plus.net` → `https://wiw-ae-plus.com`

---

## 🧪 Tests de Validation

### Test 1 : API Health Check
```bash
curl https://api.wiw-ae-plus.com/api/health
```
**Résultat attendu** :
```json
{"status":"ok","database":"connected"}
```

### Test 2 : CORS depuis tous les domaines
```bash
# Test depuis .com
curl -H "Origin: https://wiw-ae-plus.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.wiw-ae-plus.com/api/health

# Test depuis .fr
curl -H "Origin: https://wiw-ae-plus.fr" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.wiw-ae-plus.com/api/health
```
**Résultat attendu** : Headers `Access-Control-Allow-Origin` présents

### Test 3 : Frontend Principal
1. Ouvrez : `https://wiw-ae-plus.com`
2. Vérifiez que la page se charge
3. Testez l'inscription/login
4. Vérifiez les API calls dans DevTools Network

### Test 4 : Redirections
1. Ouvrez : `https://wiw-ae-plus.fr`
2. Devrait rediriger vers : `https://wiw-ae-plus.com`
3. Vérifiez le code HTTP 301 dans DevTools

---

## 🔐 Sécurité EMAIL_FROM

Mettez à jour `EMAIL_FROM` pour utiliser votre domaine :

```bash
EMAIL_FROM=noreply@wiw-ae-plus.com
```

Configurez SPF, DKIM et DMARC pour votre domaine (optionnel mais recommandé) :

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@wiw-ae-plus.com
```

---

## 📊 URLs Finales

### Production
- **Frontend** : https://wiw-ae-plus.com
- **Backend API** : https://api.wiw-ae-plus.com/api
- **Redirections** :
  - https://wiw-ae-plus.fr → https://wiw-ae-plus.com
  - https://wiw-ae-plus.net → https://wiw-ae-plus.com

### Emails
- **Support** : support@wiw-ae-plus.com
- **No-reply** : noreply@wiw-ae-plus.com

---

## 🛠️ Commandes Utiles

### Vérifier DNS
```bash
# Vérifier CNAME api
dig api.wiw-ae-plus.com

# Vérifier A record
dig wiw-ae-plus.com

# Vérifier propagation DNS
nslookup api.wiw-ae-plus.com
```

### Test SSL
```bash
# Vérifier certificat SSL
openssl s_client -connect api.wiw-ae-plus.com:443 -servername api.wiw-ae-plus.com
```

---

## 📚 Documentation

- **Vercel Custom Domains** : https://vercel.com/docs/concepts/projects/domains
- **Vercel DNS** : https://vercel.com/docs/concepts/projects/domains/add-a-domain
- **CORS Configuration** : Voir `backend/src/server.js` lignes 74-120

---

## ✅ Résumé Configuration

```
Domaines :
├── api.wiw-ae-plus.com       → Backend Vercel (backend/)
├── wiw-ae-plus.com           → Frontend Vercel (frontend/)
├── www.wiw-ae-plus.com       → Redirect → wiw-ae-plus.com
├── wiw-ae-plus.fr            → Redirect → wiw-ae-plus.com
├── www.wiw-ae-plus.fr        → Redirect → wiw-ae-plus.com
├── wiw-ae-plus.net           → Redirect → wiw-ae-plus.com
└── www.wiw-ae-plus.net       → Redirect → wiw-ae-plus.com

CORS Backend :
✅ Accepte .com, .fr, .net (avec et sans www)

Variables d'environnement :
Backend : 9 variables (DATABASE_URL, JWT_SECRET, EMAIL_*, ALLOWED_ORIGINS, FRONTEND_URL, NODE_ENV)
Frontend : 1 variable (VITE_API_URL)
```

Bon déploiement ! 🚀
