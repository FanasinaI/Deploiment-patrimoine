import { v4 as uuidv4 } from 'uuid';

export const possessions = [
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
        "libelle": "MacBook Pro",
        "valeur": 4300000,
        "dateDebut": "2023-12-25T00:00:00.000Z",
        "dateFin": null,
        "tauxAmortissement": 5
    },
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
        "libelle": "Compte épargne",
        "valeur": 500000,
        "dateDebut": "2019-01-06T00:00:00.000Z",
        "dateFin": null,
        "tauxAmortissement": -5
    },
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
        "libelle": "Clothes",
        "valeur": 2000000,
        "dateDebut": "2020-01-01T00:00:00.000Z",
        "dateFin": null,
        "tauxAmortissement": 10
    },
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
        "libelle": "Alternance",
        "valeur": 600000,
        "dateDebut": "2023-02-13T00:00:00.000Z",
        "dateFin": null,
        "tauxAmortissement": 0,
        "jour": 1,
        "valeurConstante": 600000
    },
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
        "libelle": "Survie",
        "valeur": 300000,
        "dateDebut": "2023-02-13T00:00:00.000Z",
        "dateFin": null,
        "tauxAmortissement": 0,
        "jour": 2,
        "valeurConstante": -300000
    },
    {
        "id": uuidv4(),
        "possesseur": {
            "nom": "John Doe"
        },
       "libelle": "Redmi Note 9",
                  "valeur": 800000,
                  "dateDebut": "2022-12-29T00:00:00.000Z",
                  "dateFin": null,
                  "tauxAmortissement": 15
    }
];
