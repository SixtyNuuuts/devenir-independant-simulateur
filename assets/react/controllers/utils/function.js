const minValNum = 0;
const maxValNum = 999999;

export default {
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  },

  calculateAnnualTotalFinancialItems(financialItems, itemExclusionKeys = []) {
    let annualTotal = 0.00;
    financialItems.forEach((item) => {
      if (!itemExclusionKeys.includes(item.type)) {
        const annualItem = parseFloat(item.value) * 12;
        annualTotal += annualItem;
      }
    });
    return annualTotal;
  },

  calculateMonthlyTotalsAndAnnualTotalFinancialItems(financialItems, monthValueType, itemExclusionKeys = []) {
    const monthlyTotals = Array.from({ length: 12 }, () => 0.00);
    let annualTotal = 0.00;
    financialItems.forEach((item) => {
      if (!itemExclusionKeys.includes(item.type)) {
        for (let i = 0; i < 12; i++) {
          const monthValue =
            item.attributes[monthValueType] && item.attributes[monthValueType][i]
              ? item.attributes[monthValueType][i][monthValueType === 'sale_per_month' ? 'quantity' : 'value']
              : monthValueType === 'sale_per_month' ? 0 : 0.00;
          const monthlyResult = monthValueType === 'sale_per_month' ? (parseFloat(monthValue) * parseFloat((item.value || 0.00))) : parseFloat(monthValue);
          monthlyTotals[i] += monthlyResult;
          annualTotal += monthlyResult;
        }
      }
    });
    return { monthlyTotals, annualTotal };
  },

  calculateAnnualSalary(monthlySalary) {
    return parseFloat(monthlySalary) * 12;
  },

  calculateLifeBalanceSalary(annualSalary, annualPersonalExpenses) {
    return parseFloat(annualSalary) - parseFloat(annualPersonalExpenses);
  },

  formatValue(value, itemType) {
    let formatedValue = value;

    switch (itemType) {
      case "number":
        formatedValue = parseFloat(formatedValue);

        if (formatedValue < minValNum) {
          formatedValue = minValNum;
        }

        if (formatedValue > maxValNum) {
          formatedValue = maxValNum;
        }
        break;

      case "financial-value":
        // Étape 1 : Nettoyer l'entrée pour ne garder que les chiffres, les points et les virgules
        let cleanValue = value.toString().replace(/[^0-9,.]/g, "");

        // Étape 2 : Remplacer toutes les virgules par des points pour uniformiser les séparateurs décimaux
        cleanValue = cleanValue.replace(/,/g, ".");

        // Étape 3 : Gérer les multiples points, ne garder que le dernier comme séparateur décimal
        let parts = cleanValue.split(".").reverse();
        let decimalPart = "00"; // Présumer qu'il n'y a pas de décimales si aucun point n'est présent
        let integerPart = cleanValue; // Par défaut, toute la chaîne est la partie entière

        if (parts.length > 1) {
          // Plusieurs parties indiquent la présence de points
          decimalPart = parts[0]; // La première partie dans le tableau inversé est la partie décimale
          integerPart = parts.slice(1).reverse().join(""); // Le reste est la partie entière
        }

        // Ajouter "0" si la partie décimale est incomplète
        decimalPart = decimalPart.padEnd(2, "0").substring(0, 2);

        // Étape 4 : Réassembler le nombre complet
        formatedValue = `${integerPart}.${decimalPart}`;

        // Convertir en nombre pour appliquer les limites
        let numericValue = parseFloat(formatedValue);

        if (numericValue < minValNum) {
          formatedValue = `${minValNum.toFixed(2)}`;
        }
        if (numericValue > maxValNum) {
          formatedValue = `${maxValNum.toFixed(2)}`;
        }
        break;

      case "text":
        if (formatedValue.length > 255) {
          formatedValue = formatedValue.slice(0, 255);
        }
        break;

      default:
        break;
    }

    return formatedValue;
  },

  displayValue(value, itemType) {
    let displayedValue = value;

    switch (itemType) {
      case "financial-value":
        displayedValue =
          parseFloat(value).toFixed(2).toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        break;
      case "financial-value-rounded":
        displayedValue =
          parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        break;
    }

    return displayedValue;
  },

  getCssClassForValue(value) {
    if (value > 0) {
      return 'success';
    } else if (value < 0) {
      return 'danger';
    } else {
      return '';
    }
  },

  getSignForValue(value) {
    if (value > 0) {
      return '+';
    } else if (value < 0) {
      return '-';
    } else {
      return '';
    }
  }
}