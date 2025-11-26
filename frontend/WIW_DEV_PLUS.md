# 💼 WIW Dev+ - Documentation Complète

## Vue d'ensemble

**WIW Dev+** est une variante simplifiée de WIW AE+ conçue pour les **missions de MOE réduites**, **études de faisabilité**, **AMO** et missions de **conseil**. 

### [TARGET] Positionnement
- **WIW AE+** : Réponse à des marchés basés sur un Acte d'Engagement (AE)
- **WIW Dev+** : Réponse par lettre de présentation + devis analytique

---

## 🔑 Différences avec WIW AE+

| Caractéristique | WIW AE+ | WIW Dev+ |
|-----------------|---------|----------|
| **Type de réponse** | Marché public (AE) | Lettre + Devis analytique |
| **Équipe** | Illimitée | **Max 2 partenaires** |
| **Mission** | Loi MOP complète (12 phases) | **10 types spécifiques** |
| **Décomposition financière** | Tableau honoraires complexe | **Devis classique + banque d'articles** |
| **Usage** | Grands projets structurés | Petites missions, conseil, expertise |
| **Menus** | Tous modules | **80% conservés** |

---

## [LIST] Les 10 types de missions

| N° | Type | Icône | Description |
|----|------|-------|-------------|
| 1 | **MOE** | [BUILDING] | Maîtrise d'œuvre (réduite) |
| 2 | **AMO** | 🤝 | Assistance Maîtrise d'Ouvrage |
| 3 | **Étude de Faisabilité** | [SEARCH] | Analyse de faisabilité technique/financière |
| 4 | **Étude préalable** | [CHART] | Diagnostic et études préalables |
| 5 | **PROG** | [NOTE] | Programme (élaboration) |
| 6 | **Conseil** | [BULB] | Conseil technique ou stratégique |
| 7 | **Expertise** | 🎓 | Expertise technique spécialisée |
| 8 | **Audit** | 🔎 | Audit Technique et Financier |
| 9 | **OPC** | ⚙️ | Ordonnancement, Pilotage, Coordination |
| 10 | **SPS** | 🦺 | Sécurité Protection Santé |

---

## [BUILDING] Structure d'une mission

### Informations générales
- **N° Mission** : Identifiant unique (ex: MISS-2025-001)
- **Date** : Date de création
- **Type** : 1 des 10 types ci-dessus
- **Intitulé** : Titre descriptif de la mission
- **Statut** : 
  - 🟢 Brouillon
  - 🔵 Envoyé
  - 🟢 Accepté
  - 🔴 Refusé
  - 🟠 En cours
  - 🟣 Terminé

### Client
- Nom
- Adresse complète (rue, CP, ville)
- Téléphone
- Email

### Équipe (MAX 2 PARTENAIRES)
Pour chaque partenaire :
- **Nom** : Cabinet ou personne
- **Fonction** : Rôle / Spécialité
- **Coût horaire** : Taux horaire (€/h)

[WARNING] **Limite stricte : 2 partenaires maximum**

### Détails mission
- **Description** : Objectifs, livrables attendus
- **Durée estimée** : En jours
- **Honoraires proposés** : Montant global HT (€)
- **Notes** : Observations internes

---

## 💰 Calcul des honoraires

### Formule automatique
```
Total Honoraires = Honoraires Équipe + Honoraires Proposés

Où :
Honoraires Équipe = Σ (Coût horaire × Durée (jours) × 8h/jour)
```

### Exemple concret

**Mission : Étude de faisabilité (20 jours)**

**Équipe :**
- Architecte : 80 €/h
- Économiste : 65 €/h

**Calcul :**
```
Architecte : 80 € × 20 jours × 8h = 12 800 €
Économiste : 65 € × 20 jours × 8h = 10 400 €
────────────────────────────────────────────
Sous-total équipe : 23 200 €
Honoraires proposés (forfait) : 5 000 €
────────────────────────────────────────────
TOTAL : 28 200 € HT
```

---

## [TARGET] Cas d'usage typiques

### 1️⃣ MOE réduite

**Client** : Mairie de Puteaux  
**Type** : MOE  
**Mission** : Maîtrise d'œuvre pour extension mairie (300 m²)  
**Équipe** :
- Architecte DPLG : 90 €/h
- BET Structure : 75 €/h
**Durée** : 30 jours  
**Honoraires** : 39 600 € HT

---

### 2️⃣ Étude de faisabilité

**Client** : SCI Immobilière ABC  
**Type** : Étude de Faisabilité  
**Mission** : Faisabilité surélévation immeuble R+3  
**Équipe** :
- Architecte : 80 €/h
**Durée** : 10 jours  
**Honoraires** : 6 400 € HT

---

### 3️⃣ AMO

**Client** : Conseil Départemental 92  
**Type** : AMO  
**Mission** : Assistance MOA pour rénovation énergétique groupe scolaire  
**Équipe** :
- Ingénieur thermicien : 70 €/h
- Économiste : 65 €/h
**Durée** : 25 jours  
**Honoraires** : 27 000 € HT

---

### 4️⃣ Expertise technique

**Client** : Tribunal de Grande Instance  
**Type** : Expertise  
**Mission** : Expertise fissures façade immeuble  
**Équipe** :
- Expert structure : 95 €/h
**Durée** : 5 jours  
**Honoraires** : 3 800 € HT

---

### 5️⃣ OPC

**Client** : Maître d'ouvrage privé  
**Type** : OPC  
**Mission** : Coordination travaux construction résidence 15 logements  
**Équipe** :
- Coordinateur OPC : 75 €/h
**Durée** : 60 jours  
**Honoraires** : 36 000 € HT

---

## [LAUNCH] Guide d'utilisation

### Étape 1 : Créer une mission

1. Cliquer sur **💼 Dev+** dans le menu
2. Cliquer sur **+ Nouvelle mission**
3. Remplir les champs obligatoires :
   - N° Mission (ex: MISS-2025-001)
   - Type de mission (liste déroulante)
   - Intitulé
   - Client (nom minimum)

### Étape 2 : Composer l'équipe

1. Cliquer sur **+ Ajouter un partenaire**
2. Renseigner :
   - Nom du cabinet ou personne
   - Fonction / Spécialité
   - Coût horaire (€/h)
3. Répéter pour le 2ème partenaire (max)

[WARNING] **Limite stricte : 2 partenaires maximum**

### Étape 3 : Définir les honoraires

1. Indiquer la **durée estimée** (jours)
2. Le calcul automatique s'affiche :
   ```
   Équipe : (Partenaire 1 + Partenaire 2) × Durée × 8h
   ```
3. Ajouter **honoraires proposés** si forfait global

### Étape 4 : Finaliser

1. Ajouter description et notes si besoin
2. Choisir le statut (brouillon par défaut)
3. Cliquer **✓ Créer la mission**

---

## [CHART] Statistiques

Sur la page d'accueil, 4 KPI :
- **Missions totales** : Nombre total de missions
- **En cours** : Missions avec statut "En cours"
- **Acceptées** : Missions signées (statut "Accepté")
- **Total honoraires** : Somme de tous les honoraires (toutes missions)

---

## [LINK] Intégration avec autres modules

### Modules réutilisés (80%)
- [SUCCESS] **Tableau de bord** : Vue d'ensemble
- [SUCCESS] **BET** : Gestion entreprise et équipes
- [SUCCESS] **Architectes** : Références et prospection
- [SUCCESS] **Client/MOA** : Appels d'offres, honoraires, calendrier
- [SUCCESS] **Artisan** : Catalogue articles + Devis (réutilisable pour décomposition)
- [SUCCESS] **Données** : Export/Import
- [SUCCESS] **Paramètres** : Configuration générale
- [SUCCESS] **Alertes** : Notifications et relances

### Module spécifique Dev+ (20%)
- 🆕 **Missions Conseil** : Page dédiée avec limitation 2 partenaires

---

## [BULB] Astuces et bonnes pratiques

### 1️⃣ Numérotation cohérente
```
MISS-2025-001 : Étude faisabilité
MISS-2025-002 : AMO rénovation
MISS-2025-003 : Expertise fissures
```

### 2️⃣ Gestion du statut
- **Brouillon** : Mission en préparation
- **Envoyé** : Proposition envoyée au client
- **Accepté** : Mission signée → passer en "En cours"
- **En cours** : Mission active
- **Terminé** : Mission achevée (facturation)
- **Refusé** : Proposition rejetée (archiver)

### 3️⃣ Limitation équipe
- **2 partenaires max** → simplification gestion
- Si besoin de plus : utiliser **WIW AE+** (version complète)
- Partenaires = Cabinets externes (pas salariés internes)

### 4️⃣ Calcul honoraires
- **Durée** : Estimer en jours pleins (1 jour = 8h)
- **Coût horaire** : Taux de vente (pas coût de revient)
- **Honoraires proposés** : Forfait additionnel ou frais

### 5️⃣ Duplication rapide
- Utiliser **[LIST] Dupliquer** pour missions similaires
- Modifier N° et client → gain de temps

---

## 📄 Export et documentation

### Préparation devis client

1. Créer la mission dans Dev+
2. Générer le **devis analytique** via module Artisan :
   - Créer articles correspondant aux prestations
   - Importer dans devis
3. Rédiger **lettre de présentation**
4. Joindre documents :
   - CV des partenaires
   - Références similaires
   - Attestations assurance

---

## 🆚 Comparaison WIW AE+ vs Dev+

### Quand utiliser WIW Dev+ ?

[SUCCESS] **OUI Dev+** si :
- Mission simple, ponctuelle
- 1 ou 2 intervenants maximum
- Pas de marché public structuré
- Budget < 50 000 € HT
- Délai court (< 3 mois)
- Client privé ou petit projet public

[ERROR] **NON, utiliser WIW AE+** si :
- Marché public avec DC1/DC2/AE
- Équipe > 2 partenaires
- Mission Loi MOP complète (12 phases)
- Budget > 50 000 € HT
- Nécessité de décomposer par phases
- Grands projets structurés

---

## 🔮 Évolutions futures

### Court terme
- [ ] Export PDF de la mission (format lettre)
- [ ] Templates de lettres de présentation
- [ ] Import depuis module Artisan (articles → honoraires)
- [ ] Lien avec module Honoraires (réutilisation partenaires)

### Moyen terme
- [ ] Signature électronique client
- [ ] Suivi temps passé par partenaire
- [ ] Facturation depuis mission acceptée
- [ ] Statistiques avancées par type de mission
- [ ] Alertes relance (missions envoyées sans réponse)

### Long terme
- [ ] Bibliothèque de missions types
- [ ] IA : génération description mission
- [ ] Synchronisation cloud entre Dev+ et AE+
- [ ] Marketplace de partenaires

---

## 📞 Support et FAQ

### Q : Pourquoi 2 partenaires maximum ?
**R** : Dev+ cible les petites missions nécessitant une équipe réduite. Pour plus de complexité, utilisez WIW AE+.

### Q : Peut-on dépasser 2 partenaires ?
**R** : Non, limite technique volontaire. Si besoin, basculer vers WIW AE+.

### Q : Les missions sont-elles compatibles avec WIW AE+ ?
**R** : Non, structures différentes. Export/Import à prévoir dans futures versions.

### Q : Comment facturer une mission ?
**R** : Actuellement manuel. Futur : génération facture automatique depuis mission "Accepté".

### Q : Peut-on ajouter des sous-traitants ?
**R** : Les 2 "partenaires" peuvent être des cabinets ou sous-traitants (même logique).

### Q : Le catalogue Artisan est-il lié à Dev+ ?
**R** : Pas directement, mais réutilisable pour décomposer honoraires en articles.

### Q : Peut-on exporter en PDF ?
**R** : Pas encore. À venir : export PDF mission complète (lettre + devis).

---

## 💰 Commercialisation

### Offre standalone
- **WIW Dev+ seul** : 10 € / mois
- 3 machines (PC + Tablette + Smartphone)
- 50 missions maximum
- Support email

### Offre bundle
- **WIW AE+ + Dev+** : 25 € / mois
- Tous modules inclus
- Missions illimitées
- Support prioritaire

### Positionnement tarifaire
- **Version Light** : Gratuite (stockage local)
- **Dev+** : 10 € / mois (petites structures)
- **AE+** : 20 € / mois (bureaux d'études)
- **Bundle AE+ + Dev+** : 25 € / mois (offre complète)

---

## [SPARKLES] Conclusion

**WIW Dev+** est la solution idéale pour :
- 🏢 Petits cabinets d'architecture
- 👷 BET en phase de lancement
- 🎓 Consultants indépendants
- 💼 Experts techniques

**Simplicité + Efficacité = Dev+** [LAUNCH]

---

## 📚 Documents associés

- `MODULE_ARTISAN.md` : Documentation module Artisan (devis + catalogue)
- `MIGRATION_LIGHT.md` : Guide version Light (localStorage)
- `INDEX_DOCUMENTATION.md` : Index complet de toute la documentation
- `MISSION_COMPLETE.md` : Récapitulatif WIW AE+ complet

---

*Documentation WIW Dev+ - Version 1.0*  
*Novembre 2025*
