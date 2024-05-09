import React, { useState } from "react";

const EditableCell = ({ itemValue: initialValue, itemType, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const minValNum = 0;
  const maxValNum = 9999999;

  const formatValue = (value, itemType) => {
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
        let cleanValue = value.replace(/[^0-9,.]/g, "");

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
        console.log(formatedValue, numericValue);
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
  };

  const displayValue = (value, itemType) => {
    let displayedValue = value;

    switch (itemType) {
      case "financial-value":
        displayedValue =
          value.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        break;
    }

    return displayedValue;
  };

  const saveAndExitEditing = () => {
    const formattedValue = formatValue(value, itemType);
    if (formattedValue !== initialValue) {
      onSave(formattedValue);
    }
    setValue(formattedValue);
    setEditing(false);
  };

  const handleBlur = () => {
    saveAndExitEditing();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveAndExitEditing();
    }
  };

  return (
    <div>
      {editing ? (
        <input
          type={itemType === "financial-value" ? "text" : itemType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          onClick={() => setEditing(true)} // onDoubleClick?
          tabIndex={0}
          role="button"
          aria-label="Edit"
        >
          {displayValue(value, itemType)}
        </span>
      )}
    </div>
  );
};

export default React.memo(EditableCell);
