# Analyse des écarts - WIW AE+ v2.0
## État actuel vs Plan d'amélioration

---

## ✅ FONCTIONNALITÉS DÉJÀ IMPLÉMENTÉES

### 1. Assistant/Wizard AO → Mission → Honoraires
**Statut :** ✅ **PARTIELLEMENT IMPLÉMENTÉ**

**Fichiers existants :**
- `frontend/src/components/AOAssistant.jsx` - Assistant complet avec 5 étapes
- `frontend/src/components/AssistantAO.jsx` - Assistant alternatif
- `frontend/src/pages/NouvelleAO.jsx` - Page de création AO

**Ce qui fonctionne :**
- ✅ Workflow guidé avec étapes (AO → Équipe → Missions → Honoraires → Finalisation)
- ✅ Barre de progression
- ✅ Validation par étape
- ✅ Sauvegarde automatique

**Ce qui manque :**
- ❌ Intégration complète des étapes (certaines sont des TODO)
- ❌ Héritage automatique entre étapes
- ❌ Vérifications automatiques de cohérence

---

### 2. Gestion des scénarios d'honoraires
**Statut :** ✅ **IMPLÉMENTÉ**

**Fichiers existants :**
- `frontend/src/components/ScenariosHonoraires.jsx` - Composant complet
- `frontend/src/services/scenarioVersioning.api.js` - API versionning
- `backend/src/services/scenarioVersioning.service.js` - Service backend
- `frontend/src/components/ScenarioVersioning.jsx` - Interface versionning

**Ce qui fonctionne :**
- ✅ Création de scénarios (Base, Évolution 1, Évolution 2)
- ✅ Duplication de scénarios
- ✅ Suppression de scénarios
- ✅ Versionning avec historique
- ✅ Restauration de versions
- ✅ Export Excel/PDF

**Ce qui manque :**
- ❌ Comparaison côte à côte de scénarios (API existe mais UI manquante)
- ❌ Nommage personnalisé des scénarios
- ❌ Sauvegarde de variantes multiples

---

### 3. Médiathèque et photothèque
**Statut :** ✅ **PARTIELLEMENT IMPLÉMENTÉ**

**Fichiers existants :**
- `frontend/src/pages/MediaLibrary.jsx` - Médiathèque centralisée
- `frontend/src/pages/References.jsx` - Photothèque par projet (lignes 792-859)
- `frontend/src/components/DevisMedias.jsx` - Médias pour devis

**Ce qui fonctionne :**
- ✅ Upload de photos
- ✅ Galerie par projet
- ✅ Tags et métadonnées
- ✅ Recherche par tags
- ✅ Filtres par type, domaine, référence

**Ce qui manque :**
- ❌ Médiathèque vraiment centralisée (réutilisation entre projets)
- ❌ Génération automatique de fiches projet PDF
- ❌ Vidéothèque
- ❌ CDN pour performance

---

### 4. Import Excel
**Statut :** ⚠️ **SIMULÉ (non fonctionnel)**

**Fichiers existants :**
- `frontend/src/pages/BET.jsx` (lignes 250-295) - Import simulé
- `frontend/src/pages/Settings.jsx` (lignes 235-255) - Import simulé
- `frontend/src/services/mission.api.js` - API import missions (ligne 199)

**Ce qui fonctionne :**
- ✅ Interface d'upload de fichier
- ✅ Détection du type de fichier (.xlsx, .xls, .csv)

**Ce qui manque :**
- ❌ Parsing réel du fichier Excel (utiliser `xlsx` ou `papaparse`)
- ❌ Prévisualisation des données
- ❌ Mapping des colonnes
- ❌ Validation avant import
- ❌ Détection de doublons

---

### 5. Export Excel/PDF
**Statut :** ✅ **IMPLÉMENTÉ**

**Fichiers existants :**
- `frontend/src/utils/exportHonoraires.js` - Export honoraires
- `frontend/src/components/ScenariosHonoraires.jsx` - Export scénarios
- `frontend/src/components/DevisMedias.jsx` - Versionning PDF devis

**Ce qui fonctionne :**
- ✅ Export Excel des honoraires
- ✅ Export PDF des honoraires
- ✅ Export scénarios
- ✅ Versionning PDF devis

**Ce qui manque :**
- ❌ Templates personnalisables
- ❌ Export par lot
- ❌ Export CSV pour autres SI

---

### 6. Table d'évolution des honoraires
**Statut :** ✅ **IMPLÉMENTÉ**

**Fichiers existants :**
- `frontend/src/components/HonorairesEvolutionTable.jsx` - Table complète
- `frontend/src/components/HonorairesVentilation.jsx` - Ventilation

**Ce qui fonctionne :**
- ✅ Modification des pourcentages en temps réel
- ✅ Calcul automatique des montants
- ✅ Blocage/déblocage d'évolutions
- ✅ Visualisation Base/Évolution 1/Évolution 2

**Ce qui manque :**
- ❌ Curseurs visuels (sliders) pour ajustement
- ❌ Graphiques de visualisation (waterfall, etc.)
- ❌ Indicateurs visuels de cohérence (vert/orange/rouge)

---

## ❌ FONCTIONNALITÉS MANQUANTES (À IMPLÉMENTER)

### 1. Table de mixage des prix (PRIORITÉ HAUTE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Ce qui manque :**
- Interface type console audio avec faders
- Fader principal "Forfait final"
- Faders par poste avec recalcul automatique
- Curseur "Rabais global"
- Vue temps réel montant cible vs actuel
- Graphique d'impact sur marges

**Fichiers à créer :**
- `frontend/src/components/PriceMixer.jsx`

**Complexité :** Haute

---

### 2. Comparaison côte à côte de scénarios (PRIORITÉ MOYENNE)
**Statut :** ⚠️ **API EXISTE, UI MANQUANTE**

**Ce qui existe :**
- ✅ `scenarioVersioning.api.js` - Méthode `compareVersions()`
- ✅ Backend service de comparaison

**Ce qui manque :**
- ❌ Interface de comparaison visuelle
- ❌ Vue tabulaire côte à côte
- ❌ Mise en évidence des écarts
- ❌ Graphiques comparatifs

**Fichiers à créer :**
- `frontend/src/components/ScenarioComparison.jsx`

**Complexité :** Moyenne

---

### 3. Import Excel réel (PRIORITÉ HAUTE)
**Statut :** ❌ **SIMULÉ UNIQUEMENT**

**Ce qui manque :**
- Parsing réel avec bibliothèque `xlsx` ou `papaparse`
- Prévisualisation des données avant import
- Mapping des colonnes (drag & drop)
- Validation (doublons, formats, champs requis)
- Template Excel à télécharger
- Gestion des erreurs et rollback

**Fichiers à modifier :**
- `frontend/src/pages/BET.jsx` - Remplacer simulation
- `frontend/src/pages/Settings.jsx` - Remplacer simulation
- Créer `frontend/src/utils/excelParser.js`

**Complexité :** Moyenne

---

### 4. Modes lecture Générale/Détail (PRIORITÉ MOYENNE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Ce qui manque :**
- Toggle "Vue générale" / "Voir détails" sur chaque écran
- Vue générale : Informations essentielles uniquement
- Vue détaillée : Tous les champs, médias, historique
- Mémorisation du choix par utilisateur

**Fichiers à créer :**
- `frontend/src/components/DetailView.jsx` (existe mais pas utilisé partout)
- `frontend/src/hooks/useViewMode.js`

**Complexité :** Basse

---

### 5. Réorganisation navigation 4 piliers (PRIORITÉ HAUTE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Structure actuelle :**
- Menu latéral avec tous les items au même niveau

**Structure souhaitée :**
1. **Tableau de bord** (Dashboard)
2. **BET & Architectes** (BET, Team, Contacts)
3. **Clients & Maîtres d'Ouvrage** (Company, References)
4. **Appels d'Offres** (Tenders, Pipeline, Prospection)

**Fichiers à modifier :**
- `frontend/src/components/NavigationMenu.jsx`
- `frontend/src/components/DashboardLayout.jsx`

**Complexité :** Moyenne

---

### 6. Héritage automatique AO → Mission → Honoraires (PRIORITÉ HAUTE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/components/InheritanceHelper.jsx` - Composant d'aide
- ✅ `frontend/src/services/inheritance.api.js` - API héritage

**Ce qui manque :**
- ❌ Héritage automatique lors de la création
- ❌ Synchronisation bidirectionnelle
- ❌ Contrôles de cohérence automatiques
- ❌ Alertes visuelles en cas d'incohérence

**Fichiers à modifier :**
- `frontend/src/components/AOAssistant.jsx` - Intégrer héritage automatique
- `frontend/src/pages/Honoraires.jsx` - Utiliser InheritanceHelper

**Complexité :** Haute

---

### 7. Moteur de comparaisons d'affaires (PRIORITÉ MOYENNE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Ce qui manque :**
- Comparateur multi-critères (Domaine, Type, Montant, Équipe)
- Sélection multiple d'AO
- Tableau comparatif avec indicateurs
- Analyse de patterns (combinaisons gagnantes)
- Benchmarking interne

**Fichiers à créer :**
- `frontend/src/pages/AOComparison.jsx`
- `frontend/src/services/comparison.api.js`
- `backend/src/services/comparison.service.js`

**Complexité :** Haute

---

### 8. Analyse économique avancée (PRIORITÉ MOYENNE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Ce qui manque :**
- Tableau de bord économique
- Temps prévisionnel vs temps réel
- Rentabilité par affaire et par partenaire
- Historique des remises et taux
- Graphiques d'analyse (courbes, scatter plots, heatmaps)
- Rapports automatisés

**Fichiers à créer :**
- `frontend/src/pages/EconomicAnalysis.jsx`
- `frontend/src/components/EconomicCharts.jsx`

**Complexité :** Haute

---

### 9. Gestion AO perdus enrichie (PRIORITÉ MOYENNE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ Statut "Perdu" dans `Tenders.jsx`
- ✅ Filtrage par statut

**Ce qui manque :**
- ❌ Champ "Raison de perte" (menu déroulant + commentaire)
- ❌ Champ "Prix du gagnant"
- ❌ Comparaison avec notre offre (écart)
- ❌ Statistiques taux de réussite par domaine/type
- ❌ Recommandations basées sur l'historique

**Fichiers à modifier :**
- `frontend/src/pages/Tenders.jsx` - Ajouter champs
- `backend/prisma/schema.prisma` - Ajouter champs DB

**Complexité :** Basse

---

### 10. Contrôles automatiques et détection anomalies (PRIORITÉ MOYENNE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/components/ValidationAlerts.jsx` - Composant d'alertes
- ✅ `frontend/src/services/validation.api.js` - API validation
- ✅ Validation pourcentages/montants/heures

**Ce qui manque :**
- ❌ Validation automatique à chaque modification
- ❌ Détection d'anomalies (montants anormaux vs historique)
- ❌ Suggestions automatiques (répartition équilibrée)
- ❌ Blocage export si erreurs critiques
- ❌ Panneau centralisé des anomalies

**Fichiers à modifier :**
- `frontend/src/components/ValidationAlerts.jsx` - Enrichir
- `frontend/src/services/validation.api.js` - Ajouter règles

**Complexité :** Moyenne

---

### 11. Tableau de bord opérationnel avec KPIs (PRIORITÉ HAUTE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/pages/Dashboard.jsx` - Dashboard de base
- ✅ `frontend/src/components/AOPipelineStats.jsx` - Stats pipeline
- ✅ `frontend/src/components/AdvancedStats.jsx` - Stats avancées

**Ce qui manque :**
- ❌ KPIs complets (Pipe AO, CA prévisionnel, Charge équipe, Rentabilité)
- ❌ Widgets configurables
- ❌ Graphiques pipe AO (funnel)
- ❌ Carte de charge équipe (heatmap)
- ❌ Top 5 partenaires (performance)
- ❌ Alertes centralisées

**Fichiers à modifier :**
- `frontend/src/pages/Dashboard.jsx` - Enrichir avec KPIs
- Créer `frontend/src/components/DashboardWidgets.jsx`

**Complexité :** Moyenne

---

### 12. Aide à la décision (scoring, calibrage) (PRIORITÉ MOYENNE)
**Statut :** ❌ **NON IMPLÉMENTÉ**

**Ce qui manque :**
- Score de priorité AO (algorithme multi-critères)
- Calibrage automatique de rémunération (suggestion basée historique)
- Recommandation de composition d'équipe
- Alertes si écart significatif vs benchmark

**Fichiers à créer :**
- `frontend/src/services/decisionSupport.api.js`
- `frontend/src/components/AOScoring.jsx`
- `backend/src/services/decisionSupport.service.js`

**Complexité :** Haute

---

### 13. Gestion droits granulaires (PRIORITÉ HAUTE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/components/RoleGuard.jsx` - Protection par rôle
- ✅ Système de rôles basique

**Ce qui manque :**
- ❌ Profils utilisateurs complets (Admin, Direction, Chef projet, Standard)
- ❌ Droits granulaires par module
- ❌ Droits par action (Lecture, Édition, Suppression, Export)
- ❌ Droits par partenaire (accès limité)
- ❌ Droits par affaire (projets assignés)
- ❌ Journal des modifications (audit trail)
- ❌ Historique des accès

**Fichiers à modifier :**
- `frontend/src/components/RoleGuard.jsx` - Enrichir
- Créer `frontend/src/services/permissions.api.js`
- `backend/src/services/permissions.service.js`

**Complexité :** Haute

---

### 14. Module Données admin sécurisé (PRIORITÉ MOYENNE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/pages/DataManagement.jsx` - Gestion données
- ✅ `frontend/src/pages/Settings.jsx` - Paramètres

**Ce qui manque :**
- ❌ Interface admin dédiée avec accès restreint
- ❌ Éditeur JSON sécurisé avec validation
- ❌ Gestion des listes déroulantes (CRUD complet)
- ❌ Configuration système
- ❌ Historique des modifications JSON
- ❌ Rollback en cas d'erreur

**Fichiers à modifier :**
- `frontend/src/pages/DataManagement.jsx` - Enrichir
- Créer `frontend/src/components/JSONEditor.jsx`

**Complexité :** Moyenne

---

### 15. Multilingue (PRIORITÉ BASSE)
**Statut :** ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**

**Ce qui existe :**
- ✅ `frontend/src/components/LanguageSwitcher.jsx` - Sélecteur langue
- ✅ `i18next` installé dans `package.json`

**Ce qui manque :**
- ❌ Fichiers de traduction complets (fr, en, es)
- ❌ Traduction de tous les labels
- ❌ Gestion formats (dates, montants, devises)
- ❌ Traduction des données utilisateur

**Fichiers à créer :**
- `frontend/src/locales/fr.json`
- `frontend/src/locales/en.json`
- `frontend/src/locales/es.json`

**Complexité :** Haute

---

### 16. Remplissage vocal (PRIORITÉ BASSE)
**Statut :** ⚠️ **COMPOSANTS EXISTENT, NON INTÉGRÉS**

**Ce qui existe :**
- ✅ `frontend/src/components/VoiceInputButton.jsx`
- ✅ `frontend/src/components/VoiceInputField.jsx`

**Ce qui manque :**
- ❌ Intégration dans les écrans ciblés
- ❌ Activation sur champs texte libres uniquement
- ❌ Indicateur visuel pendant dictée
- ❌ Validation après dictée

**Fichiers à modifier :**
- Intégrer `VoiceInputField` dans les formulaires pertinents

**Complexité :** Basse

---

## 📊 RÉCAPITULATIF PAR PRIORITÉ

### PRIORITÉ HAUTE (Court terme - 3-6 mois)
1. ❌ Table de mixage des prix
2. ❌ Import Excel réel
3. ❌ Réorganisation navigation 4 piliers
4. ⚠️ Héritage automatique (à compléter)
5. ⚠️ Tableau de bord opérationnel (à enrichir)
6. ⚠️ Gestion droits granulaires (à compléter)

### PRIORITÉ MOYENNE (Moyen terme - 6-12 mois)
1. ⚠️ Comparaison scénarios (API existe, UI manquante)
2. ⚠️ Modes lecture Générale/Détail (composant existe, pas intégré)
3. ❌ Moteur de comparaisons d'affaires
4. ❌ Analyse économique avancée
5. ⚠️ Gestion AO perdus (à enrichir)
6. ⚠️ Contrôles automatiques (à compléter)
7. ❌ Aide à la décision
8. ⚠️ Module Données admin (à enrichir)

### PRIORITÉ BASSE (Long terme - 12+ mois)
1. ⚠️ Multilingue (infrastructure existe, traductions manquantes)
2. ⚠️ Remplissage vocal (composants existent, non intégrés)

---

## 🎯 PLAN D'ACTION RECOMMANDÉ

### Sprint 1 (2 semaines) - Fondations
1. Réorganisation navigation 4 piliers
2. Import Excel réel (bibliothèque + parsing)
3. Enrichir gestion AO perdus

### Sprint 2 (2 semaines) - Core métier
1. Table de mixage des prix
2. Compléter héritage automatique
3. Comparaison scénarios (UI)

### Sprint 3 (2 semaines) - UX
1. Modes lecture Générale/Détail
2. Enrichir tableau de bord (KPIs)
3. Compléter contrôles automatiques

### Sprint 4 (2 semaines) - Sécurité & Admin
1. Gestion droits granulaires
2. Module Données admin sécurisé
3. Audit trail

### Sprint 5+ (selon priorités)
- Moteur de comparaisons
- Analyse économique
- Aide à la décision
- Multilingue
- Remplissage vocal

---

## 📝 NOTES

- **Fonctionnalités partiellement implémentées** : Infrastructure existe mais nécessite complétion
- **Fonctionnalités simulées** : Interface existe mais logique métier manquante
- **Fonctionnalités non implémentées** : À créer de zéro

**Estimation totale :** ~12-16 semaines pour les priorités HAUTE et MOYENNE

