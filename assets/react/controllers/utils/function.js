const minValNum = 0;
const maxValNum = 999999;

export default {

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
          value.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        break;
    }

    return displayedValue;
  },

}