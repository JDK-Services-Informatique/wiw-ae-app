// Données de test pour le prototype
// À exécuter dans la console du navigateur pour initialiser les données

function seedData() {
    // Projets
    const projets = [
        {
            id: '1',
            nom: 'Résidence étudiante - Paris 13',
            domaine: 'Logements',
            type: 'Résidence étudiante',
            montantHT: 250000,
            dateCreation: '2024-01-15',
            statut: 'Actif'
        },
        {
            id: '2',
            nom: 'Médiathèque municipale',
            domaine: 'Équipements publics',
            type: 'Équipement culturel',
            montantHT: 180000,
            dateCreation: '2024-02-20',
            statut: 'Actif'
        },
        {
            id: '3',
            nom: 'Bureaux - La Défense',
            domaine: 'Bureaux',
            type: 'Bureaux neufs',
            montantHT: 320000,
            dateCreation: '2024-03-10',
            statut: 'Actif'
        }
    ];
    
    // Appels d'offres
    const tenders = [
        {
            id: '1',
            intitule: 'Construction école primaire',
            maitreOuvrage: 'Ville de Lyon',
            montant: 500000,
            dateLimite: '2024-12-31',
            statut: 'En cours'
        },
        {
            id: '2',
            intitule: 'Réhabilitation logements sociaux',
            maitreOuvrage: 'OPH Paris',
            montant: 750000,
            dateLimite: '2024-11-30',
            statut: 'Nouveau'
        },
        {
            id: '3',
            intitule: 'Centre commercial',
            maitreOuvrage: 'Promoteur privé',
            montant: 1200000,
            dateLimite: '2024-10-15',
            statut: 'Gagné'
        },
        {
            id: '4',
            intitule: 'Gymnase municipal',
            maitreOuvrage: 'Ville de Marseille',
            montant: 300000,
            dateLimite: '2024-09-20',
            statut: 'Perdu'
        }
    ];
    
    // Devis
    const devis = [
        {
            id: '1',
            numero: 'DEV-2024-001',
            client: 'Client Test',
            montantHT: 45000,
            date: '2024-01-10',
            statut: 'Accepté'
        },
        {
            id: '2',
            numero: 'DEV-2024-002',
            client: 'Autre Client',
            montantHT: 28000,
            date: '2024-02-15',
            statut: 'En attente'
        }
    ];
    
    // Équipe
    const team = [
        {
            id: '1',
            prenom: 'Jean',
            nom: 'Dupont',
            role: 'Architecte',
            email: 'jean.dupont@wiw.fr',
            telephone: '01 23 45 67 89'
        },
        {
            id: '2',
            prenom: 'Marie',
            nom: 'Martin',
            role: 'Chef de projet',
            email: 'marie.martin@wiw.fr',
            telephone: '01 23 45 67 90'
        }
    ];
    
    // Clients
    const companies = [
        {
            id: '1',
            nom: 'Ville de Paris',
            type: 'Public',
            contact: 'M. Durand',
            email: 'contact@paris.fr'
        },
        {
            id: '2',
            nom: 'Promoteur ABC',
            type: 'Privé',
            contact: 'Mme. Dupuis',
            email: 'contact@promoteur-abc.fr'
        }
    ];
    
    // Sauvegarder dans localStorage
    localStorage.setItem('wiw-projets', JSON.stringify(projets));
    localStorage.setItem('wiw-tenders', JSON.stringify(tenders));
    localStorage.setItem('wiw-devis', JSON.stringify(devis));
    localStorage.setItem('wiw-team-members', JSON.stringify(team));
    localStorage.setItem('wiw-companies', JSON.stringify(companies));
    
    console.log('✅ Données de test initialisées !');
    console.log('Rechargez la page pour voir les données.');
    
    return {
        projets,
        tenders,
        devis,
        team,
        companies
    };
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
    window.seedData = seedData;
}

