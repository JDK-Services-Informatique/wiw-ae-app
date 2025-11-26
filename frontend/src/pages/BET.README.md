# Module BET - Bureaux d'Études Techniques

## Description
Module complet de gestion des Bureaux d'Études Techniques (BET) pour l'application WIW/AE+.

## Fonctionnalités

### [LIST] Liste des BET Partenaires
- **Ajout/Modification/Suppression** de BET
- **Informations complètes** :
  - Nom et logo
  - Spécialité (Structure, Thermique & Fluides, Acoustique, VRD, Sécurité)
  - Contact (responsable, téléphone, email, adresse)
  - Compétences techniques
  - Certifications (Qualibat, ISO, RGE, etc.)
  - Tarif horaire
- **Affichage en cartes** avec toutes les informations visibles
- **Sélection** pour voir les détails

### [CHART] Études en Cours
- **Suivi des études BET** par projet
- **Informations trackées** :
  - BET assigné
  - Projet concerné
  - Type d'étude
  - Statut (En attente, En cours, Terminé)
  - Dates (début et livraison)
  - Montant
  - Avancement en pourcentage
  - Liste des livrables attendus
- **Visualisation** :
  - Tableau détaillé
  - Barre de progression visuelle
  - Codes couleur par statut
- **Statistiques** :
  - Nombre d'études actives
  - Total engagé en euros

### [TARGET] Compétences
- **Référentiel** des compétences par spécialité
- **5 spécialités** :
  1. **Structure** : Calcul béton, métal, bois, diagnostics, parasismique
  2. **Thermique & Fluides** : RT2020, CVC, BBC, énergies renouvelables
  3. **Acoustique** : Isolation, mesures, modélisation, vibrations
  4. **VRD** : Voirie, réseaux, assainissement, hydraulique
  5. **Sécurité** : SPS, sécurité incendie, accessibilité PMR
- **Affichage en badges** pour visualisation rapide

## Structure de données

### BET
```javascript
{
  id: number,
  nom: string,
  type: 'Structure' | 'Thermique & Fluides' | 'Acoustique' | 'VRD' | 'Sécurité',
  contact: {
    responsable: string,
    telephone: string,
    email: string,
    adresse: string
  },
  competences: string[],
  certifications: string[],
  tarifHoraire: number,
  logo: string | null
}
```

### Étude
```javascript
{
  id: number,
  betId: number,
  betNom: string,
  projet: string,
  type: string,
  statut: 'En attente' | 'En cours' | 'Terminé',
  dateDebut: string (ISO date),
  dateLivraison: string (ISO date),
  montant: number,
  avancement: number (0-100),
  livrables: string[]
}
```

## Intégrations

### Avec le module Entreprises
Les BET sont également listés dans le module Entreprises en tant que partenaires, permettant une vue unifiée.

### Avec le module Honoraires
Les tarifs horaires des BET alimentent le calcul global des honoraires.

### Avec le module Équipe
Les BET peuvent être associés aux équipes de projet.

## KPIs affichés
1. **BET Partenaires** : Nombre total de BET dans la base
2. **Études actives** : Nombre d'études en cours
3. **Total engagé** : Somme des montants de toutes les études

## Actions utilisateur
- [EDIT] **Modifier** : Édition complète des informations BET ou étude
- [DELETE] **Supprimer** : Suppression avec confirmation
- [ADD] **Ajouter** : Création de nouveau BET ou nouvelle étude
- [VIEW] **Consulter** : Vue détaillée en cliquant sur une carte

## Navigation
Accessible via le menu principal : **[BUILDING] BET**

## Thème
S'adapte automatiquement au thème clair/sombre de l'application.

