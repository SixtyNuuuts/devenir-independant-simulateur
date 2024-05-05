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
      { value: item.name || "", type: "text" },
      ...(item.attributes.sale_per_month || []).map(sale => ({ value: sale.quantity, type: "number" })),
    ],
    columnTotalKey: "quantity",
    lineTotalData: (financialItems) => {
      const monthlyTotals = Array.from({ length: 12 }, () => 0);
      let annualTotal = 0;

      financialItems.forEach((item) => {
        for (let i = 0; i < 12; i++) {
          const monthSale =
            item.attributes.sale_per_month && item.attributes.sale_per_month[i]
              ? item.attributes.sale_per_month[i].quantity
              : 0;
          const price = item.value || 0;
          const monthlyRevenue = Math.round(monthSale * price);
          monthlyTotals[i] += monthlyRevenue;
          annualTotal += monthlyRevenue;
        }
      });

      return { lineTotalLabel: "CA HT", monthlyTotals, annualTotal };
    },
  },
  products: {
    caption: "À quel prix vais-je vendre chacun de ces produits ou services ?",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Coût unitaire*", key: "attributes.manufacturing_cost" },
      { label: "Prix de vente HT", key: "value" },
    ],
    rows: (item) => [
      { value: item.name || "", type: "text" },
      { value: item.attributes.manufacturing_cost || "", type: "financial-value" },
      { value: item.value || "", type: "financial-value" },
    ],
    columnTotalKey: null,
    isDeletableItems: true,
    addBtn: { text: "Ajouter un produit" },
  },
};
