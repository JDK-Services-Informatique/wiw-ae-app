# 🔀 WIW-AE+ Redirections

Projet Vercel pour rediriger `wiw-ae-plus.fr` et `wiw-ae-plus.net` vers le domaine principal `wiw-ae-plus.com`.

---

## 🎯 Objectif

Ce projet Vercel ne contient aucun code applicatif. Il sert uniquement à :
- Rediriger **tous les domaines .fr et .net** vers **wiw-ae-plus.com**
- Préserver le chemin d'URL (ex: `/about` reste `/about`)
- Utiliser une redirection 301 permanente (SEO-friendly)

---

## 🚀 Déploiement sur Vercel

### Étape 1 : Créer le Projet

1. **Accédez** : https://vercel.com/new
2. **Import Repository** : `JDK-Services-Informatique/wiw-ae-app`
3. **Configurez** :
   ```
   Project Name: wiw-ae-redirects
   Root Directory: vercel-redirects/
   Framework: Other
   Build Command: npm run build
   ```

### Étape 2 : Ajouter les Domaines

Dans **Settings** → **Domains**, ajoutez les 4 domaines :
- `wiw-ae-plus.fr`
- `www.wiw-ae-plus.fr`
- `wiw-ae-plus.net`
- `www.wiw-ae-plus.net`

### Étape 3 : Configurer DNS

Pour chaque domaine, configurez chez votre registrar :

#### Pour apex domain (.fr, .net)
```
Type: A
Name: @
Target: 76.76.21.21  (IP Vercel)
```

#### Pour www
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com.
```

---

## 🧪 Test des Redirections

```bash
# Test .fr
curl -I https://wiw-ae-plus.fr
# Doit retourner : 301 Moved Permanently
# Location: https://wiw-ae-plus.com/

# Test .net
curl -I https://wiw-ae-plus.net
# Doit retourner : 301 Moved Permanently
# Location: https://wiw-ae-plus.com/

# Test avec chemin
curl -I https://wiw-ae-plus.fr/about
# Location: https://wiw-ae-plus.com/about
```

---

## 📂 Structure du Projet

```
vercel-redirects/
├── vercel.json        # Configuration redirections
├── package.json       # Minimal package.json
└── README.md          # Ce fichier
```

---

## ⚙️ Configuration (vercel.json)

```json
{
  "version": 2,
  "name": "wiw-ae-redirects",
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://wiw-ae-plus.com/:path*",
      "permanent": true
    }
  ]
}
```

**Explication** :
- `source: "/:path*"` → Capture tous les chemins
- `destination: "https://wiw-ae-plus.com/:path*"` → Redirige vers .com en préservant le chemin
- `permanent: true` → Utilise un code HTTP 301 (redirection permanente)

---

## ✅ Checklist

- [ ] Projet Vercel créé avec Root Directory `vercel-redirects/`
- [ ] 4 domaines ajoutés dans Vercel Domains (.fr et .net avec/sans www)
- [ ] DNS configuré pour chaque domaine
- [ ] SSL/TLS vérifié pour tous les domaines
- [ ] Tests de redirection réussis
- [ ] Vérification code 301 (permanent)

---

## 🔗 Liens Utiles

- **Documentation Vercel Redirects** : https://vercel.com/docs/concepts/projects/project-configuration#redirects
- **Documentation DNS** : https://vercel.com/docs/concepts/projects/domains/add-a-domain
- **Configuration domaines principale** : Voir `DOMAINES_CONFIG.md` à la racine

---

## 📝 Notes

### Alternative : Redirection DNS Native

Si votre registrar de domaines (ex: OVH, Gandi, Cloudflare) supporte les redirections HTTP natives, vous pouvez :
1. **Supprimer ce projet Vercel**
2. **Configurer la redirection directement** dans votre registrar

Cela économise un projet Vercel et est plus performant.

### SEO

Les redirections 301 permanentes préservent le PageRank et indiquent aux moteurs de recherche que :
- `.com` est le domaine canonique
- `.fr` et `.net` ne doivent pas être indexés séparément

---

Bon déploiement ! 🚀
