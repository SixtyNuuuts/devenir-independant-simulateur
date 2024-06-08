import f from "../../utils/function";

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
      { value: item.name || "", type: "product-name", isEditable: true },
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
      const { monthlyTotals, annualTotal } = f.calculateMonthlyTotalsAndAnnualTotalFinancialItems(financialItems, 'sale_per_month');
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
      { value: item.name || "", type: "product-name", isEditable: true },
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
      { value: item.nature === 'salary' ? 'Mon salaire (Cout total entreprise)' : item.name || "", type: "product-name", isEditable: item.nature === 'salary' ? false : true },
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
      const { monthlyTotals, annualTotal } = f.calculateMonthlyTotalsAndAnnualTotalFinancialItems(financialItems, 'value_per_month');
      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals, annualTotalSign: "-", annualTotal };
    },
    annualTotalLabel: "Charges totales Année 1",
    addBtn: { text: "+ ajouter" },

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
      { value: item.name || "", type: "product-name", isEditable: true },
      { value: item.value || "00.00", type: "financial-value", isEditable: true },
    ],
    isDeletableItems: true,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      const annualTotal = f.calculateAnnualTotalFinancialItems(financialItems);
      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals: null, annualTotalSign: "", annualTotal };
    },
    annualTotalLabel: "Total Frais annuels",
    addBtn: { text: "+ ajouter un frais" },

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
      { value: item.name || "", type: "product-name", isEditable: item.nature === 'salary' ? false : true },
      { value: item.value || "00.00", type: "financial-value", isEditable: true },
    ],
    isDeletableItems: true,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      const annualTotal = f.calculateAnnualTotalFinancialItems(financialItems);
      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals: null, annualTotalSign: "", annualTotal };
    },
    annualTotalLabel: "Salaire annuel",
    addBtn: { text: "+ ajouter un revenu" },
  },

  'salary-targets': {
    title: "Salaire demain",
    caption: "Ce que je vise comme rémunération avec ma future activité",
    headers: [
      { label: "Intitulé", key: "name" },
      { label: "Mensuel", key: "value" },
      { label: "Annuel" },
      { label: "" } // delete item btn,
    ],
    rows: (item) => [
      { value: item.name, type: "product-name", isEditable: false },
      { value: item.value || "00.00", type: "financial-value", isEditable: ['brut', 'total-company-cost'].includes(item.type) ? false : true },
    ],
    isDeletableItems: false,
    columnTotalSum: true,
    finalRowFinancialData: (financialItems) => {
      const annualTotal = f.calculateAnnualTotalFinancialItems(financialItems, ['brut', 'total-company-cost']);
      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals: null, annualTotalSign: "", annualTotal };
    },
    annualTotalLabel: "Salaire annuel net envisagé",
  },

  'profits-view': {
    headers: [
      { label: "Profits", key: "name" },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("fr", { month: "short" }),
        key: `attributes.sale_per_month.${i}.quantity`,
      })),
      { label: "Total ANNUEL" },
    ],
    rows: (item) => [
      { value: item.name || "", type: "product-name", isEditable: false },
      ...(item.attributes.sale_per_month && item.attributes.sale_per_month.length > 0
        ? item.attributes.sale_per_month.map(sale => ({ value: sale.quantity, type: "number", isEditable: false }))
        : Array.from({ length: 12 }, (_, i) => ({
          value: 100,
          type: "number",
          isEditable: false,
          month: i + 1,
        }))
      ),
    ],
    columnTotalSum: true,
    isDeletableItems: false,
    finalRowFinancialData: (financialItems) => {
      const { monthlyTotals, annualTotal } = f.calculateMonthlyTotalsAndAnnualTotalFinancialItems(financialItems, 'sale_per_month');
      return { finalRowFinancialLabel: "CA HT", monthlyTotals, annualTotalSign: "+", annualTotal };
    },
    annualTotalLabel: "CA HT total Année 1",
  },

  'charges-view': {
    headers: [
      { label: "Charges", key: "name" },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("fr", { month: "short" }),
        key: `attributes.value_per_month.${i}.value`,
      })),
      { label: "Total ANNUEL" },
    ],
    rows: (item) => [
      { value: item.nature === 'salary' ? 'Mon salaire (Cout total entreprise)' : item.name || "", type: "product-name", isEditable: false },
      ...(item.attributes.value_per_month && item.attributes.value_per_month.length > 0
        ? item.attributes.value_per_month.map(expense => ({ value: expense.value, type: "financial-value", isEditable: false }))
        : Array.from({ length: 12 }, (_, i) => ({
          value: item.value,
          type: "financial-value",
          isEditable: false,
          month: i + 1,
        }))
      ),
    ],
    columnTotalSum: true,
    isDeletableItems: false,
    finalRowFinancialData: (financialItems) => {
      const { monthlyTotals, annualTotal } = f.calculateMonthlyTotalsAndAnnualTotalFinancialItems(financialItems, 'value_per_month');
      return { finalRowFinancialLabel: "Sous total HT", monthlyTotals, annualTotalSign: "-", annualTotal };
    },
    annualTotalLabel: "Charges totales Année 1",
  },
};
