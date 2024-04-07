import React, { useState, useMemo, useCallback } from "react";
import EditableCell from "./EditableCell";

const tableSpecifications = {
  profits: {
    caption: "Combien je vais vendre de produits ou services par mois",
    headers: [
      { label: "Produit", key: "name" },
      ...Array.from({ length: 12 }, (_, i) => {
        return {
          label: new Date(0, i).toLocaleString("fr", { month: "short" }),
          key: "attributes.sale_per_month." + i + ".quantity",
        };
      }),
      { label: "Total ANNUEL" }, // columnTotal
    ],
    rows: (item) => [
      { value: item.name || "" },
      ...(item.attributes.sale_per_month || []),
    ],
    finalRow: (financialItems) => {
      const monthlyTotals = Array.from({ length: 12 }, () => 0);
      let annualTotal = 0;

      financialItems.forEach((item) => {
        for (let i = 0; i < 12; i++) {
          const monthSale =
            item.attributes.sale_per_month && item.attributes.sale_per_month[i]
              ? item.attributes.sale_per_month[i].quantity
              : 0;
          const price = item.value || 0;
          const monthlyRevenue = monthSale * price;
          monthlyTotals[i] += monthlyRevenue;
          annualTotal += monthlyRevenue;
        }
      });

      // Création de la ligne finale avec les totaux mensuels et le total annuel
      const finalRowCells = [
        { value: "CA HT" },
        ...monthlyTotals.map((total) => ({ value: total })),
        { value: annualTotal },
      ];

      return (
        <tr>
          {finalRowCells.map((cell, index) => (
            <td key={index}>{cell.value}</td>
          ))}
        </tr>
      );
    },
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
      { value: item.name || "---" },
      { value: item.attributes.manufacturing_cost || "---" },
      { value: item.value || "---" },
    ],
    finalRow: null,
    columnTotalKey: null,
  },
  // Plus de spécifications pour d'autres types peuvent être ajoutées ici...
};

const FinancialItemsTable = ({
  financialItems = [],
  type,
  onAddFinancialItem,
  onEditFinancialItem,
  onDeleteFinancialItem,
}) => {
  const specification = tableSpecifications[type];
  if (!specification) {
    console.error(`Type de table non reconnu: ${type}`);
    return null;
  }
  const { caption, headers, rows, columnTotalKey, finalRow } = specification;

  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [editableNewItem, setEditableNewItem] = useState({});

  const annualTotal = useMemo(() => {
    return financialItems.reduce((acc, item) => {
      let itemTotal = 0;
      for (let i = 0; i < 12; i++) {
        const sale = item.attributes.sale_per_month?.[i]?.quantity || 0;
        itemTotal += sale * (item.value || 0);
      }
      return acc + itemTotal;
    }, 0);
  }, [financialItems]);

  const handleEditCell = (value, itemId, fieldKey) => {
    // Logique pour gérer l'édition des cellules et mise à jour des items
    onEditFinancialItem(itemId, { [fieldKey]: value });
  };

  const handleSaveNewItem = () => {
    // Validation et envoi du nouvel item
    onAddFinancialItem(editableNewItem);
    setEditableNewItem({});
    setIsAddingNewItem(false);
  };

  const renderEditableRow = () => {
    return (
      <tr key="new-item">
        {headers.map((header, index) => (
          <td key={index}>
            <input
              type="text"
              value={editableNewItem[header.toLowerCase().replace(/\s/g, "_")]}
              onChange={(e) =>
                setEditableNewItem({
                  ...editableNewItem,
                  [header.toLowerCase().replace(/\s/g, "_")]: e.target.value,
                })
              }
              placeholder={header}
            />
          </td>
        ))}
        <td>
          <button onClick={handleSaveNewItem}>Sauvegarder</button>
        </td>
      </tr>
    );
  };

  const renderRows = useCallback(
    (item) => (
      <tr key={item.id}>
        {rows(item)?.map((rowItem, index) => (
          <td key={index}>
            {(type === "profits" && index >= 1 && index <= 12) ||
            (type === "products" && index >= 0 && index <= 2) ? (
              <EditableCell
                initialValue={rowItem.value ?? rowItem.quantity ?? ""}
                onSave={(newVal) =>
                  handleEditCell(newVal, item.id, headers[index].key)
                }
                itemId={item.id}
                fieldKey={headers[index].key}
              />
            ) : (
              <span>{rowItem.value ?? rowItem.quantity ?? ""}</span>
            )}
          </td>
        ))}
        {columnTotalKey && (
          <td>
            {rows(item)
              ?.slice(1)
              .reduce(
                (sum, rowItem) =>
                  sum + (parseInt(rowItem[columnTotalKey], 10) || 0),
                0
              )}
          </td>
        )}
      </tr>
    ),
    [rows, columnTotalKey, type, onEditFinancialItem]
  );

  const renderFinalRow = useCallback(() => {
    if (finalRow && typeof finalRow === "function") {
      return finalRow(financialItems);
    }
    return null;
  }, [financialItems, finalRow]);

  return (
    <>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.label}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {financialItems.map(renderRows)}
          {type === "profits" && renderFinalRow()}
          {type === "products" && isAddingNewItem && renderEditableRow()}
        </tbody>
      </table>
      {type === "profits" && (
        <div style={{ marginTop: "20px" }}>
          <span>CA HT total Année 1: </span>
          <span>
            {annualTotal >= 0
              ? `+${annualTotal.toLocaleString("fr-FR")}`
              : annualTotal.toLocaleString("fr-FR")}
          </span>
        </div>
      )}
      {type === "products" && (
        <button onClick={() => setIsAddingNewItem(true)}>
          Ajouter un produit
        </button>
      )}
      {/* Le reste du composant reste inchangé */}
    </>
  );
};

export default FinancialItemsTable;
