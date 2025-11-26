# WIW / AE+ - Solution Light 🪶

## Version Minimaliste pour Auto-Entrepreneurs

Cette version est optimisée pour les artisans, auto-entrepreneurs et EURL qui souhaitent une solution **100% locale** et **indépendante**.

---

## [SPARKLES] Caractéristiques principales

### 🏠 Stockage Local
- **100% localStorage** : Toutes les données sont stockées dans votre navigateur
- **Pas de serveur** : Aucune connexion internet requise après installation
- **Privé** : Vos données restent sur votre ordinateur
- **Rapide** : Accès instantané, pas de latence réseau

### [TARGET] Fonctionnalités Essentielles

#### [SUCCESS] Conservées
- **[LIST] Appels d'Offres (AO)** : Gestion complète des tenders avec missions
- **💰 Honoraires** : Calcul des frais et devis
- **👥 Clients / MOA** : Base de données clients simplifiée
- **[BUILDING] Références** : Portfolio de projets (Projets/BET/Entreprises)
- **🔔 Alertes & Relances** : Système de rappels simples
- **[SAVE] Sauvegarde/Restauration** : Export/Import de toutes les données

#### [ERROR] Désactivées (commentées dans le code)
- **📐 Plans & Abonnements** : Pas de système de paiement
- **[CHART] Analytics complexes** : Statistiques de base uniquement
- **[ART] Médiathèque lourde** : Version simplifiée ou désactivée
- **👥 Gestion d'équipe complexe** : Simplifiée

---

## [PACKAGE] Installation

### Méthode 1 : Utiliser en local
```bash
# 1. Cloner le projet
git clone https://github.com/Suffix6805/wiw-app.git
cd wiw-app/frontend

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev

# 4. Ouvrir http://localhost:5173
```

### Méthode 2 : Build statique
```bash
# 1. Builder l'application
npm run build

# 2. Le dossier dist/ contient tous les fichiers
# Vous pouvez les ouvrir directement dans un navigateur
# ou les héberger sur n'importe quel serveur web

# 3. Prévisualiser le build
npm run preview
```

---

## [SAVE] Gestion des Données

### Sauvegarde
1. Aller dans **Données** (menu principal)
2. Cliquer sur **[SAVE] Télécharger sauvegarde**
3. Un fichier JSON sera téléchargé : `wiw-backup-YYYY-MM-DD.json`
4. **Recommandé** : Sauvegarder régulièrement sur clé USB ou cloud

### Restauration
1. Aller dans **Données**
2. Cliquer sur **📂 Restaurer sauvegarde**
3. Sélectionner votre fichier `.json`
4. Confirmer la restauration
5. La page se rechargera automatiquement

### [WARNING] Important
- **localStorage** a une limite de ~5-10 Mo selon les navigateurs
- Les données sont liées au navigateur (Chrome, Firefox, etc.)
- Effacer les données du navigateur supprimera tout
- **Pensez à faire des sauvegardes régulières !**

---

## 🔔 Alertes & Relances

Nouvelle fonctionnalité minimaliste pour gérer vos rappels :

- **Titre** : Description courte de la relance
- **Date** : Date prévue de relance
- **Priorité** : Basse / Normale / Haute / Urgente
- **Statut** : En attente / En cours / Terminée
- **Contact** : Nom, téléphone, email (cliquables)
- **Description** : Notes et contexte

### Alertes intelligentes
- **Tri automatique** : Par date puis priorité
- **Indicateurs visuels** :
  - 🔴 En retard (date dépassée)
  - 🟠 Aujourd'hui
  - 🟢 À venir
- **Séparation** : Alertes en cours / Terminées

---

## [LAUNCH] Utilisation

### Premier lancement
1. Ouvrir l'application
2. Commencer à créer vos **Appels d'Offres**
3. Ajouter vos **Clients**
4. Calculer vos **Honoraires**
5. Créer des **Alertes** pour vos relances

### Workflow type
```
[LIST] AO reçu
  ↓
💰 Calcul honoraires
  ↓
📧 Envoi devis
  ↓
🔔 Alerte relance (J+7)
  ↓
[SUCCESS] Signature / [ERROR] Refus
```

---

## [TOOLS] Personnalisation

### Activer des fonctionnalités désactivées
Dans `frontend/src/App.jsx`, décommenter les lignes :

```jsx
// Pour réactiver Plans & Outils
<button className={`nav-btn-sub ${currentPage === 'plans' ? 'active' : ''}`} onClick={() => handlePageChange('plans')}>
  <span>📐</span> Plans & Outils
</button>

// Pour réactiver Médiathèque
<button className={`nav-btn-sub ${currentPage === 'mediatheque' ? 'active' : ''}`} onClick={() => handlePageChange('mediatheque')}>
  <span>[ART]</span> Médiathèque
</button>
```

---

## [MOBILE] Multi-appareils

### Option 1 : Fichiers de sauvegarde
1. Sauvegarder sur appareil A
2. Transférer le JSON vers appareil B
3. Restaurer sur appareil B

### Option 2 : Cloud personnel
1. Automatiser la sauvegarde vers Dropbox/Drive
2. Synchroniser entre appareils
3. Restaurer quand nécessaire

---

## [LOCK] Sécurité & Confidentialité

### [SUCCESS] Avantages
- **Données locales** : Aucun serveur tiers
- **Pas de compte** : Pas de login, pas d'authentification
- **Gratuit** : Aucun coût récurrent
- **Rapide** : Pas de latence réseau

### [WARNING] Limites
- **Pas de synchronisation auto** : Sauvegardes manuelles
- **Limité à un navigateur** : Les données ne se transfèrent pas automatiquement
- **Effacement cache** : Effacer les données du navigateur = perte de données (si pas de sauvegarde)
- **Pas de collaboration** : Usage mono-utilisateur

---

## [BULB] Conseils

### Pour les auto-entrepreneurs
- [SUCCESS] Parfait si vous travaillez seul
- [SUCCESS] Idéal si vous voulez éviter les abonnements
- [SUCCESS] Adapté aux petits volumes (<100 projets)
- [SUCCESS] Simple et rapide à prendre en main

### Passer à la version complète
Si vous souhaitez :
- Collaboration multi-utilisateurs
- Synchronisation cloud
- Analytics avancés
- Médiathèque complète

→ Décommenter les fonctionnalités dans `App.jsx`
→ Ajouter un backend (voir `backend/` dans le projet)

---

## 🆘 Support

### Problèmes courants

**"Mes données ont disparu"**
- Vérifier si le cache du navigateur a été effacé
- Restaurer depuis une sauvegarde JSON

**"Limite de stockage atteinte"**
- Supprimer les données anciennes
- Exporter et archiver les projets terminés
- Utiliser les filtres pour limiter les données affichées

**"L'application ne charge pas"**
- Vider le cache du navigateur
- Vérifier la console (F12) pour les erreurs
- Réinstaller avec `npm install`

---

## [CHART] Capacités techniques

### Données stockées (estimation)
- **Clients** : ~500 entrées
- **AO** : ~200 projets
- **Alertes** : ~100 rappels
- **Références** : ~50 projets

**Total** : ~2-3 Mo (bien en dessous de la limite de 5 Mo)

---

## 🎓 Technologies utilisées

- **React 18** : Interface utilisateur
- **Vite 5** : Build rapide
- **localStorage API** : Stockage navigateur
- **Hooks personnalisés** : `useLocalStorage` pour persistence

---

## 📄 Licence

Projet personnel - Libre d'utilisation pour auto-entrepreneurs et EURL

---

## 🤝 Contribution

Ce projet est orienté **minimaliste** par design. 

Les contributions sont acceptées si elles :
- Restent dans l'esprit "light"
- N'ajoutent pas de dépendances lourdes
- Améliorent la performance
- Simplifient l'usage

---

**Développé avec ❤️ pour les artisans indépendants**

*Version Light - Janvier 2025*

