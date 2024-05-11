export const tableSpecifications = {
  profits: {
    title: "Profits par mois",
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
      { value: item.name || "", type: "text", isEditable: false },
      ...(item.attributes.sale_per_month || []).map(sale => ({ value: sale.quantity, type: "number", isEditable: true })),
    ],
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      const monthlyTotals = Array.from({ length: 12 }, () => 0);
      let annualTotal = 0.00;

      financialItems.forEach((item) => {
        for (let i = 0; i < 12; i++) {
          const monthSale =
            item.attributes.sale_per_month && item.attributes.sale_per_month[i]
              ? item.attributes.sale_per_month[i].quantity
              : 0;
          const price = item.value || 0.00;
          const monthlyRevenue = parseFloat(monthSale) * parseFloat(price);
          monthlyTotals[i] += monthlyRevenue;
          annualTotal += monthlyRevenue;
        }
      });

      return { finalRowFinancialLabel: "CA HT", monthlyTotals, annualTotal };
    },
  },
  products: {
    title: "Prix de mes produits",
    caption: "À quel prix vais-je vendre chacun de ces produits ou services ?",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Coût unitaire*", key: "attributes.manufacturing_cost" },
      { label: "Prix de vente HT", key: "value" },
    ],
    rows: (item) => [
      { value: item.name || "", type: "text", isEditable: true },
      { value: item.attributes.manufacturing_cost || "", type: "financial-value", isEditable: true },
      { value: item.value || "", type: "financial-value", isEditable: true },
    ],
    columnTotalSum: false,
    isDeletableItems: true,
    asteriskLegendText: "* Facultatif : Précisez ici le montant HT coutant la réalisation de ce produit ou service",
    addBtn: { text: "Ajouter un produit" },
  },
};
