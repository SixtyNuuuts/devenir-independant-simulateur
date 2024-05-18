export const tableSpecifications = {
  'profits': {
    title: "Profits par mois",
    caption: "Combien je vais vendre de produits ou services par mois",
    headers: [
      { label: "Produit", key: "name" },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("fr", { month: "short" }),
        key: `attributes.sale_per_month.${i}.quantity`,
      })),
      { label: "Total ANNUEL" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.name || "", type: "text", isEditable: true },
      ...(item.attributes.sale_per_month && item.attributes.sale_per_month.length > 0
        ? item.attributes.sale_per_month.map(sale => ({ value: sale.quantity, type: "number", isEditable: true }))
        : Array.from({ length: 12 }, (_, i) => ({
          value: 100,
          type: "number",
          isEditable: true,
          month: i + 1,
        }))
      ),
    ],
    columnTotalSum: true,
    isDeletableItems: true,
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

      return { finalRowFinancialLabel: "CA HT", monthlyTotals, annualTotalSign: "+", annualTotal };
    },
    annualTotalLabel: "CA HT total Année 1",
  },

  'products': {
    title: "Prix de mes produits",
    caption: "À quel prix vais-je vendre chacun de ces produits ou services ?",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Coût unitaire*", key: "attributes.manufacturing_cost" },
      { label: "Prix de vente HT", key: "value" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.name || "", type: "text", isEditable: true },
      { value: item.attributes.manufacturing_cost || "00.00", type: "financial-value", isEditable: true },
      { value: item.value || "00.00", type: "financial-value", isEditable: true },
    ],
    columnTotalSum: false,
    isDeletableItems: true,
    asteriskLegendText: "* Facultatif : Précisez ici le montant HT coutant la réalisation de ce produit ou service",
    addBtn: { text: "+ ajouter" },
  },

  'charges': {
    title: "Charges par mois",
    caption: "Combien je vais dépenser par poste et par mois pour mon activité",
    headers: [
      { label: "Intitulé", key: "name" },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("fr", { month: "short" }),
        key: `attributes.value_per_month.${i}.value`,
      })),
      { label: "Total ANNUEL" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.nature === 'salary' ? 'Mon salaire' : item.name || "", type: "text", isEditable: item.nature === 'salary' ? false : true },
      ...(item.attributes.value_per_month && item.attributes.value_per_month.length > 0
        ? item.attributes.value_per_month.map(expense => ({ value: expense.value, type: "financial-value", isEditable: item.nature === 'salary' ? false : true }))
        : Array.from({ length: 12 }, (_, i) => ({
          value: item.value,
          type: "financial-value",
          isEditable: item.nature === 'salary' ? false : true,
          month: i + 1,
        }))
      ),
    ],
    isDeletableItems: true,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      const monthlyTotals = Array.from({ length: 12 }, () => 0.00);
      let annualTotal = 0.00;

      financialItems.forEach((item) => {
        for (let i = 0; i < 12; i++) {
          const monthExpense =
            item.attributes.value_per_month && item.attributes.value_per_month[i]
              ? item.attributes.value_per_month[i].value
              : 0.00;
          const monthExpenseFloat = parseFloat(monthExpense);
          monthlyTotals[i] += monthExpenseFloat;
          annualTotal += monthExpenseFloat;
        }
      });

      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals, annualTotalSign: "-", annualTotal };
    },
    annualTotalLabel: "Charges totales Année 1",
    addBtn: { text: "+ ajouter" },

  },

  'personal-incomes': {
    title: "Salaire aujourd'hui",
    caption: "Combien je gagne actuellement en salaire net par mois",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Mensuel", key: "value" },
      { label: "Annuel" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.nature === 'salary' ? 'Salaire net' : item.name || "", type: "text", isEditable: item.nature === 'salary' ? false : true },
      { value: item.value || "00.00", type: "financial-value", isEditable: true },
    ],
    isDeletableItems: true,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      let annualTotal = 0.00;

      financialItems.forEach((item) => {
        const annualItem = parseFloat(item.value) * 12;
        annualTotal += annualItem;
      });

      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals: null, annualTotalSign: "", annualTotal };
    },
    annualTotalLabel: "Total Revenus annuels",
    addBtn: { text: "+ ajouter un revenu" },
  },

  'personal-expenses': {
    title: "Frais personnels aujourd'hui",
    caption: "Combien je dépense par mois/an pour vivre actuellement",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Mensuel", key: "value" },
      { label: "Annuel" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.name || "", type: "text", isEditable: true },
      { value: item.value || "00.00", type: "financial-value", isEditable: true },
    ],
    isDeletableItems: true,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      let annualTotal = 0.00;

      financialItems.forEach((item) => {
        const annualItem = parseFloat(item.value) * 12;
        annualTotal += annualItem;
      });

      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals: null, annualTotalSign: "", annualTotal };
    },
    annualTotalLabel: "Total Frais annuels",
    addBtn: { text: "+ ajouter un frais" },

  },
};
