export const tableSpecifications = {
    profits: {
        caption: "Combien je vais vendre de produits ou services par mois",
        headers: [
            { label: "Produit", key: "name" },
            ...Array.from({ length: 12 }, (_, i) => ({
                label: new Date(0, i).toLocaleString("fr", { month: "short" }),
                key: `attributes.sale_per_month.${i}.quantity`,
            })),
            { label: "Total ANNUEL" },
        ],
        rows: (item) => [
            { value: item.name || "" },
            ...(item.attributes.sale_per_month || []),
        ],
        columnTotalKey: "quantity",
    },
    products: {
        caption: "À quel prix vais-je vendre chacun de ces produits ou services ?",
        headers: [
            { label: "Intitulé", key: "name" },
            { label: "Coût unitaire*", key: "attributes.manufacturing_cost" },
            { label: "Prix de vente HT", key: "value" },
        ],
        rows: (item) => [
            { value: item.name || "" },
            { value: item.attributes.manufacturing_cost || "" },
            { value: item.value || "" },
        ],
        columnTotalKey: null,
    },
};
