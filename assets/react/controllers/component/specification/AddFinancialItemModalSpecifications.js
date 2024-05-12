export const AddFinancialItemModalSpecifications = {
    'product': {
        title: "Ajouter un produit / service",
        fields: [
            { label: "Intitulé", name: "name", type: "text" },
            { label: "Coût unitaire", name: "manufacturing_cost", type: "text" },
            { label: "Prix de vente HT", name: "value", type: "text" }
        ],
    },

    'charge': {
        title: "Ajouter une charge",
        fields: [
            { label: "Intitulé", name: "name", type: "text" },
            { label: "Coût mensuel en € HT", name: "value", type: "text" }
        ],
    },

    'personal-income': {
        title: "Ajouter un revenu",
        fields: [
            { label: "Intitulé", name: "name", type: "text" },
            { label: "Montant net mensuel", name: "value", type: "text" }
        ],
    },

    'personal-expense': {
        title: "Ajouter un frais",
        fields: [
            { label: "Intitulé", name: "name", type: "text" },
            { label: "Coût mensuel", name: "value", type: "text" }
        ],
    },
};
