# 🔨 Module Artisan - Documentation Complète

## Vue d'ensemble

Le **Module Artisan** est conçu pour les artisans, plombiers, électriciens, menuisiers et autres métiers du bâtiment. Il permet de gérer un **catalogue d'articles** personnalisé et de créer des **devis professionnels** avec calcul automatique.

---

## [TARGET] Fonctionnalités principales

### 1️⃣ Catalogue d'Articles

#### Gestion complète
- [SUCCESS] Création/Modification/Suppression d'articles
- [SUCCESS] Photos multiples avec vignette principale
- [SUCCESS] Prix unitaire HT et TVA personnalisables
- [SUCCESS] Catégories (plomberie, électricité, menuiserie, etc.)
- [SUCCESS] Unités variées (U, ml, m², m³, kg, heure, forfait, lot)
- [SUCCESS] Activation/Désactivation des articles
- [SUCCESS] Duplication rapide
- [SUCCESS] Recherche et filtres

#### Informations par article
- **Référence** : Code unique (ex: PLB-001)
- **Désignation** : Nom court (ex: Baignoire acrylique 170x70)
- **Description** : Détails techniques complets
- **Catégorie** : 9 catégories disponibles
- **Prix HT** : Modifiable à tout moment
- **TVA** : 0%, 5.5%, 10%, 20%
- **Photos** : Upload multiple + vignette
- **Fournisseur** : Nom du fournisseur
- **Délai** : Délai de livraison estimé

#### Stockage
- 100% **localStorage**
- Clé : `wiw-articles`
- Persistence automatique
- Export/Import via page Données

---

### 2️⃣ Devis Professionnels

#### Création de devis
- [SUCCESS] Sélection d'articles depuis le catalogue
- [SUCCESS] Quantités et prix modifiables par ligne
- [SUCCESS] Remises par ligne (en %)
- [SUCCESS] Sous-totaux personnalisés (frais de déplacement, etc.)
- [SUCCESS] Rabais final (% ou montant fixe)
- [SUCCESS] Calcul automatique TTC
- [SUCCESS] Informations client complètes
- [SUCCESS] Notes et conditions de règlement
- [SUCCESS] Statuts (brouillon, envoyé, accepté, refusé)

#### Table de mixage intelligente
Le système calcule automatiquement :
- **Total HT par ligne** : Quantité × PU HT × (1 - Remise%)
- **Total TVA par ligne** : Total HT × TVA%
- **Total TTC par ligne** : Total HT + Total TVA
- **Sous-totaux** : Somme des lignes + sous-totaux custom
- **Rabais final** : Pourcentage ou montant fixe
- **Total général TTC** : (Total HT - Rabais) + Total TVA

#### Formule complète
```
Total Final TTC = (Σ Lignes HT + Σ Sous-totaux - Rabais final) + Σ TVA
```

Où :
- `Ligne HT = Quantité × PU HT × (1 - Remise% / 100)`
- `TVA = Ligne HT × (TVA% / 100)`

---

## [PACKAGE] Structure des données

### Article
```json
{
  "id": 1234567890,
  "reference": "PLB-001",
  "designation": "Baignoire acrylique 170x70 cm",
  "description": "Baignoire acrylique haute qualité...",
  "categorie": "plomberie",
  "unite": "U",
  "puHT": 450.00,
  "tva": 20,
  "photos": ["data:image/png;base64,...", "data:image/png;base64,..."],
  "vignette": "data:image/png;base64,...",
  "actif": true,
  "fournisseur": "Leroy Merlin",
  "delai": "48h",
  "dateCreation": "2025-01-15T10:30:00.000Z"
}
```

### Devis
```json
{
  "id": 1234567890,
  "numero": "DEV-2025-001",
  "date": "2025-01-15",
  "dateValidite": "2025-02-15",
  "client": {
    "nom": "M. Dupont",
    "adresse": "12 rue de la Paix",
    "codePostal": "75001",
    "ville": "Paris",
    "telephone": "06 12 34 56 78",
    "email": "dupont@exemple.fr"
  },
  "lignes": [
    {
      "articleId": 123,
      "reference": "PLB-001",
      "designation": "Baignoire acrylique 170x70 cm",
      "unite": "U",
      "quantite": 1,
      "puHT": 450.00,
      "tva": 20,
      "remise": 10
    }
  ],
  "sousTotaux": [
    {
      "titre": "Frais de déplacement",
      "montant": 50.00
    }
  ],
  "rabaisFinal": 5,
  "rabaisFinalType": "pourcentage",
  "notes": "Travaux à réaliser sous 2 semaines",
  "conditionsReglement": "30 jours",
  "statut": "brouillon",
  "dateCreation": "2025-01-15T10:30:00.000Z"
}
```

---

## [LAUNCH] Guide d'utilisation

### Étape 1 : Créer le catalogue

1. Aller dans **🔨 Artisan** → **[PACKAGE] Catalogue d'articles**
2. Cliquer sur **+ Nouvel article**
3. Remplir les informations :
   - Référence (ex: PLB-001)
   - Catégorie (ex: Plomberie)
   - Désignation (ex: Baignoire 170x70)
   - Prix HT (ex: 450.00 €)
   - TVA (ex: 20%)
4. Ajouter photos (optionnel)
5. Cliquer **✓ Ajouter au catalogue**

**Conseil** : Créez 10-20 articles de base pour commencer

---

### Étape 2 : Créer un devis

1. Aller dans **🔨 Artisan** → **[NOTE] Devis**
2. Cliquer sur **+ Nouveau devis**
3. Remplir les informations générales :
   - N° Devis (ex: DEV-2025-001)
   - Date
   - Date de validité
4. Remplir les informations client
5. Cliquer sur **+ Ajouter un article**
6. Sélectionner des articles dans le catalogue
7. Ajuster quantités et remises si nécessaire
8. Ajouter des sous-totaux (frais, déplacements...)
9. Appliquer un rabais final si besoin
10. Cliquer **✓ Créer le devis**

---

### Étape 3 : Gérer le devis

Une fois créé, vous pouvez :
- **[EDIT] Modifier** : Changer les articles, quantités, prix
- **📄 PDF** : Exporter en PDF (à venir)
- **[LIST] Dupliquer** : Créer une copie pour un nouveau client
- **[DELETE] Supprimer** : Effacer le devis

---

## [BULB] Cas d'usage typiques

### Plombier
```
Catalogue :
- Baignoire 170x70 : 450 € HT
- Mitigeur thermostatique : 120 € HT
- Flexible de douche : 25 € HT
- Main d'œuvre / heure : 45 € HT

Devis exemple :
- 1× Baignoire : 450 €
- 1× Mitigeur : 120 €
- 1× Flexible : 25 €
- 6h Main d'œuvre : 270 €
- Sous-total déplacement : 50 €
────────────────────────
Total HT : 915 €
TVA 20% : 183 €
Total TTC : 1098 €
```

### Électricien
```
Catalogue :
- Tableau électrique 3 rangées : 180 € HT
- Disjoncteur 20A : 15 € HT
- Prise avec terre : 8 € HT
- Interrupteur va-et-vient : 12 € HT
- Main d'œuvre / heure : 50 € HT

Devis exemple :
- 1× Tableau : 180 €
- 8× Disjoncteur : 120 €
- 15× Prise : 120 €
- 10× Interrupteur : 120 €
- 12h Main d'œuvre : 600 €
────────────────────────
Total HT : 1140 €
TVA 20% : 228 €
Total TTC : 1368 €
```

### Menuisier
```
Catalogue :
- Porte intérieure hêtre : 250 € HT
- Poignée chromée : 35 € HT
- Chambranle complet : 80 € HT
- Pose / unité : 120 € HT

Devis exemple :
- 5× Porte : 1250 €
- 5× Poignée : 175 €
- 5× Chambranle : 400 €
- 5× Pose : 600 €
────────────────────────
Total HT : 2425 €
TVA 10% : 242.50 €
Total TTC : 2667.50 €
```

---

## 🎓 Astuces et bonnes pratiques

### Organisation du catalogue

1. **Nomenclature cohérente**
   ```
   PLB-001, PLB-002... pour plomberie
   ELC-001, ELC-002... pour électricité
   MNU-001, MNU-002... pour menuiserie
   ```

2. **Photos de qualité**
   - Utilisez des photos claires des articles posés
   - Vignette = photo principale
   - Photos supplémentaires = détails

3. **Descriptions complètes**
   - Dimensions exactes
   - Matériaux
   - Normes (CE, NF, etc.)
   - Conseils de pose

4. **Prix à jour**
   - Mettez à jour régulièrement
   - Utilisez la duplication pour les variantes
   - Désactivez les articles obsolètes (ne pas supprimer)

---

### Optimisation des devis

1. **Numérotation**
   ```
   DEV-2025-001
   DEV-2025-002
   Format : DEV-ANNÉE-NUMÉRO
   ```

2. **Validité**
   - Devis valable 30 jours par défaut
   - Ajuster selon la nature des travaux
   - Préciser dans les notes si conditions spéciales

3. **Remises**
   - Remise par ligne : Pour articles spécifiques
   - Rabais final : Pour le client fidèle ou gros chantier
   - Préférer remise en % (plus professionnel)

4. **Sous-totaux**
   - Frais de déplacement
   - Location de matériel
   - Évacuation de gravats
   - Fournitures diverses

---

## [CHART] Statistiques et suivi

### Depuis la page Catalogue
- **Total articles** : Nombre d'articles dans le catalogue
- **Articles actifs** : Articles disponibles pour devis
- **Valeur catalogue** : Somme des PU HT de tous les articles actifs

### Depuis la page Devis
- **Total devis** : Nombre de devis créés
- **Brouillons** : Devis en cours de rédaction
- **Acceptés** : Devis signés par clients

---

## [SAVE] Sauvegarde et export

### Données locales
- **Articles** : Clé `wiw-articles` dans localStorage
- **Devis** : Clé `wiw-devis` dans localStorage

### Sauvegarde complète
1. Aller dans **[SAVE] Données**
2. Cliquer **Télécharger sauvegarde**
3. Fichier JSON contient articles + devis + tout
4. Conserver sur clé USB ou cloud

### Import
1. **[SAVE] Données** → **Restaurer sauvegarde**
2. Sélectionner fichier `.json`
3. Confirmer
4. Page rechargée → données restaurées

---

## 🔮 Évolutions futures

### Court terme
- [ ] Export PDF des devis (génération automatique)
- [ ] Templates de devis prédéfinis
- [ ] Import catalogue depuis Excel/CSV
- [ ] Codes-barres / QR codes sur articles

### Moyen terme
- [ ] Gestion des stocks
- [ ] Historique des prix
- [ ] Statistiques avancées (CA, marges)
- [ ] Signature électronique client
- [ ] Envoi email automatique des devis

### Long terme
- [ ] Application mobile (scan articles)
- [ ] Synchronisation cloud optionnelle
- [ ] Marketplace d'articles (partage entre artisans)
- [ ] Intégration comptabilité
- [ ] Gestion des factures

---

## 🆘 FAQ

### Q : Combien d'articles puis-je stocker ?
**R** : Environ 200-300 articles avec photos (limite localStorage ~5-10 Mo)

### Q : Les photos sont-elles nécessaires ?
**R** : Non, mais recommandées pour professionnalisme

### Q : Puis-je modifier un article après avoir créé des devis ?
**R** : Oui, mais cela ne modifie pas les devis existants (copie au moment de l'ajout)

### Q : Comment partager un devis avec un client ?
**R** : Actuellement : export PDF (à venir) ou copier-coller. Futur : envoi email automatique

### Q : Que se passe-t-il si je supprime un article utilisé dans un devis ?
**R** : Le devis conserve les informations (copie indépendante)

### Q : Puis-je utiliser plusieurs devises ?
**R** : Non, uniquement € pour l'instant. Évolution possible.

### Q : Comment gérer les variantes (couleurs, tailles) ?
**R** : Créer un article par variante ou utiliser la description

### Q : Puis-je ajouter des CGV au devis ?
**R** : Oui, dans le champ "Notes / Observations"

---

## 📞 Support

### En cas de problème

1. **Vérifier localStorage**
   - F12 → Application → Local Storage
   - Vérifier clés `wiw-articles` et `wiw-devis`

2. **Sauvegarder avant manipulation**
   - Toujours faire backup avant tests

3. **Réinitialiser si corrompu**
   ```javascript
   // Dans console F12
   localStorage.removeItem('wiw-articles');
   localStorage.removeItem('wiw-devis');
   location.reload();
   ```

---

## 💰 Commercialisation suggérée

Comme mentionné dans votre demande :

### Offre SaaS
- **Tarif** : 1 € / jour
- **Soit** : ~30 € / mois
- **3 machines** : Ordinateur + Tablette + Smartphone
- **Synchronisation** : Cloud entre appareils
- **Support** : Email + Chat

### Avantages pour l'artisan
- [SUCCESS] Pas d'investissement initial
- [SUCCESS] Essai gratuit 30 jours
- [SUCCESS] Sans engagement
- [SUCCESS] Accessible partout
- [SUCCESS] Sauvegardes automatiques
- [SUCCESS] Mises à jour incluses

---

## [SPARKLES] Conclusion

Le **Module Artisan** est conçu pour la simplicité et l'efficacité :
- **5 minutes** pour créer un catalogue de base
- **2 minutes** pour créer un devis professionnel
- **100% local**, rapide, sans connexion

**Prêt à l'emploi dès maintenant !** [LAUNCH]

---

*Documentation Module Artisan - Version 1.0*
*Janvier 2025*

