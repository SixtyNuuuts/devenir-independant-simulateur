export const AddFinancialItemModalSpecifications = {
    'product': {
        title: "Ajouter un produit / service",
        fields: [
            { label: "Intitulé", name: "name", type: "text", initValue: "Produit" },
            { label: "Coût unitaire", name: "manufacturing_cost", type: "financial-value", initValue: "00.00" },
            { label: "Prix de vente HT", name: "value", type: "financial-value", initValue: "00.00" }
        ],
    },

    'charge': {
        title: "Ajouter une charge",
        fields: [
            { label: "Intitulé", name: "name", type: "text", initValue: "Charge" },
            { label: "Coût mensuel en € HT", name: "value", type: "financial-value", initValue: "00.00" }
        ],
    },

    'personal-income': {
        title: "Ajouter un revenu",
        fields: [
            { label: "Intitulé", name: "name", type: "text", initValue: "Revenu" },
            { label: "Montant net mensuel", name: "value", type: "financial-value", initValue: "00.00" }
        ],
    },

    'personal-expense': {
        title: "Ajouter un frais",
        fields: [
            { label: "Intitulé", name: "name", type: "text", initValue: "Frais" },
            { label: "Coût mensuel", name: "value", type: "financial-value", initValue: "00.00" }
        ],
    },
};
