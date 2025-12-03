# 🌐 Configuration DNS - Domaines Parkés

**Serveurs DNS actuels** :
- `ns1.dns-parking.com`
- `ns2.dns-parking.com`

---

## 📋 Situation Actuelle

Vos domaines utilisent des **DNS de parking**, ce qui signifie :
- ✅ Les domaines sont enregistrés et vous appartenent
- ⚠️ Ils ne sont pas encore configurés pour pointer vers un service
- 🔄 Vous devez configurer les DNS pour Vercel

---

## 🎯 Deux Options Disponibles

### **Option A : DNS via Vercel** (⭐ RECOMMANDÉ - Plus Simple)

Vercel gère tout automatiquement, aucune configuration DNS manuelle.

**Avantages** :
- ✅ Configuration automatique
- ✅ SSL automatique
- ✅ Propagation rapide
- ✅ Interface simple
- ✅ Pas de manipulation DNS complexe

**Étapes** :
1. Déployez backend et frontend sur Vercel
2. Ajoutez vos domaines dans Vercel
3. Vercel vous donne des **Nameservers Vercel**
4. Changez les nameservers chez votre registrar
5. ✅ Terminé - Vercel gère le reste

**Nameservers Vercel** (exemples, Vercel vous donnera les vôtres) :
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

### **Option B : DNS Manuel chez votre Registrar**

Garder vos nameservers actuels et configurer manuellement.

**Avantages** :
- ✅ Contrôle total sur les DNS
- ✅ Peut gérer emails et autres services

**Inconvénients** :
- ❌ Configuration manuelle requise
- ❌ Plus complexe
- ❌ Risque d'erreurs

**Étapes** :
1. Allez chez votre registrar (où vous avez acheté les domaines)
2. Accédez à la gestion DNS
3. Configurez les records A et CNAME manuellement
4. Attendez propagation (24-48h)

---

## 🏢 Identifier Votre Registrar

Les DNS de parking `dns-parking.com` sont utilisés par plusieurs registrars.

**Registrars communs avec dns-parking** :
- **OVH** (ovh.com)
- **Gandi** (gandi.net)
- **Namecheap** (namecheap.com)
- **GoDaddy** (godaddy.com)

**Comment savoir ?**
```bash
whois wiw-ae-plus.com
# Regardez la ligne "Registrar:"
```

---

## 💡 Ma Recommandation : Option A (Vercel DNS)

### Pourquoi ?

1. **Simplicité** : Vercel gère tout
2. **Rapidité** : Configuration en 5 minutes
3. **Fiabilité** : Infrastructure Vercel
4. **SSL automatique** : Certificats générés automatiquement
5. **Pas d'erreurs** : Pas de configuration manuelle DNS

### Processus Complet

#### Étape 1 : Déployer sur Vercel (Backend + Frontend)
Suivez `DEPLOY_NOW.md` normalement.

#### Étape 2 : Ajouter les Domaines dans Vercel

**Pour le Backend** :
1. Backend Project → Settings → Domains
2. Ajoutez : `api.wiw-ae-plus.com`
3. Vercel affiche une erreur (c'est normal)

**Pour le Frontend** :
1. Frontend Project → Settings → Domains
2. Ajoutez : `wiw-ae-plus.com`
3. Ajoutez : `www.wiw-ae-plus.com`
4. Vercel affiche une erreur (c'est normal)

#### Étape 3 : Changer les Nameservers

Vercel vous donnera des instructions comme :

```
⚠️ Invalid Configuration

To use this domain, configure your nameservers:

ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Chez votre registrar** :
1. Connectez-vous à votre compte registrar
2. Allez dans la gestion de `wiw-ae-plus.com`
3. Trouvez **"Nameservers"** ou **"DNS"**
4. Changez de :
   ```
   ns1.dns-parking.com
   ns2.dns-parking.com
   ```
   vers :
   ```
   ns1.vercel-dns.com  (exemple - utilisez ceux de Vercel)
   ns2.vercel-dns.com
   ```
5. Sauvegardez

#### Étape 4 : Attendre Propagation (5-30 min)

Vercel détectera automatiquement le changement et :
- ✅ Configurera les DNS
- ✅ Générera les certificats SSL
- ✅ Activera les domaines

---

## 🔄 Si Vous Choisissez Option B (DNS Manuel)

### Configuration Requise chez votre Registrar

**Domaine** : `wiw-ae-plus.com`

#### Records pour le Backend (API)
```
Type: CNAME
Name: api
Target: cname.vercel-dns.com.
TTL: 3600
```

#### Records pour le Frontend
```
Type: A
Name: @
Target: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Target: cname.vercel-dns.com.
TTL: 3600
```

**Domaines** : `wiw-ae-plus.fr` et `wiw-ae-plus.net`

Si vous utilisez Vercel Redirects :
```
Type: A
Name: @
Target: 76.76.21.21

Type: CNAME
Name: www
Target: cname.vercel-dns.com.
```

Sinon, configurez des redirections HTTP 301 chez votre registrar.

---

## 📝 Guide Étape par Étape pour Option A

### 1. Déployez Backend et Frontend d'abord

Suivez `DEPLOY_NOW.md` jusqu'à ce que vous ayez :
- ✅ Backend déployé sur Vercel
- ✅ Frontend déployé sur Vercel
- ✅ Les deux accessibles via URLs Vercel (`.vercel.app`)

### 2. Ajoutez les Domaines dans Vercel

Ne vous inquiétez pas des erreurs DNS, on les résoudra ensuite.

### 3. Identifiez votre Registrar

Connectez-vous au site où vous avez acheté les domaines.

### 4. Changez les Nameservers

Dans la gestion de vos domaines, remplacez les nameservers de parking par ceux de Vercel.

### 5. Attendez et Vérifiez

Après 5-30 minutes :
```bash
# Vérifiez la propagation
dig wiw-ae-plus.com
dig api.wiw-ae-plus.com

# Testez l'accès
curl https://api.wiw-ae-plus.com/api/health
```

---

## ✅ Checklist Configuration DNS

**Avant** :
- [ ] Backend et frontend déployés sur Vercel
- [ ] URLs Vercel fonctionnelles

**Pendant** :
- [ ] Domaines ajoutés dans Vercel (erreurs normales)
- [ ] Nameservers Vercel récupérés
- [ ] Registrar identifié
- [ ] Accès au compte registrar

**Configuration** :
- [ ] Nameservers changés de `dns-parking.com` vers `vercel-dns.com`
- [ ] Changement sauvegardé chez le registrar
- [ ] Attente propagation (5-30 min)

**Vérification** :
- [ ] `dig wiw-ae-plus.com` retourne IP Vercel
- [ ] `dig api.wiw-ae-plus.com` retourne CNAME Vercel
- [ ] SSL actif (🔒 dans navigateur)
- [ ] Frontend accessible
- [ ] API répond

---

## 🚀 Prochaines Étapes

**Maintenant** :
1. Déployez backend sur Vercel
2. Déployez frontend sur Vercel
3. Testez avec les URLs `.vercel.app`

**Ensuite** :
1. Ajoutez vos domaines dans Vercel
2. Changez les nameservers chez votre registrar
3. Attendez propagation
4. ✅ Production !

---

## 🤝 Quel Registrar Utilisez-Vous ?

Pour vous guider précisément, dites-moi où vous avez acheté vos domaines :
- **OVH** ?
- **Gandi** ?
- **Namecheap** ?
- **GoDaddy** ?
- **Autre** ?

Je vous donnerai les instructions exactes pour votre registrar ! 🎯
