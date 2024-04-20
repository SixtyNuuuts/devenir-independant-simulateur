import React, { useState, useMemo, useCallback } from "react";
import { tableSpecifications } from "./config/tableSpecifications";
import TableRow from "./TableRow";

const FinancialItemsTable = ({
  financialItems = [],
  type,
  onAddFinancialItem,
  onUpdateFinancialItem,
  onDeleteFinancialItem,
}) => {
  const specification = tableSpecifications[type];
  if (!specification) {
    console.error(`Type de table non reconnu: ${type}`);
    return null;
  }
  const { caption, headers } = specification;
  // const [editableNewItem, setEditableNewItem] = useState({});
  // const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  // const handleEditCell = (value, itemId, fieldKey) => {
  //   onEditFinancialItem(value, itemId, fieldKey);
  // };

  // const handleSaveNewItem = () => {
  //   onAddFinancialItem(editableNewItem);
  //   setEditableNewItem({});
  //   setIsAddingNewItem(false);
  // };

  // const renderRows = useCallback(
  //   (item) => (
  //     <tr key={item.id}>
  //       {rows(item)?.map((rowItem, index) => (
  //         <td key={index}>
  //           {(type === "profits" && index >= 1 && index <= 12) ||
  //           (type === "products" && index >= 0 && index <= 2) ? (
  //             <EditableCell
  //               initialValue={rowItem.value ?? rowItem.quantity ?? ""}
  //               onSave={(newVal) =>
  //                 handleEditCell(newVal, item.id, headers[index].key)
  //               }
  //               itemId={item.id}
  //               fieldKey={headers[index].key}
  //             />
  //           ) : (
  //             <span>{rowItem.value ?? rowItem.quantity ?? ""}</span>
  //           )}
  //         </td>
  //       ))}
  //       {columnTotalKey && (
  //         <td>
  //           {rows(item)
  //             ?.slice(1)
  //             .reduce(
  //               (sum, rowItem) =>
  //                 sum + (parseInt(rowItem[columnTotalKey], 10) || 0),
  //               0
  //             )}
  //         </td>
  //       )}
  //     </tr>
  //   ),
  //   [type, rows, columnTotalKey]
  // );

  // const { annualTotal, monthlyTotals } = useMemo(() => {
  //   if (type !== "profits") return { monthlyTotals: [], annualTotal: 0 };

  //   const monthlyTotals = Array.from({ length: 12 }, () => 0);
  //   let annualTotal = 0;

  //   financialItems.forEach((item) => {
  //     for (let i = 0; i < 12; i++) {
  //       const monthSale =
  //         item.attributes.sale_per_month && item.attributes.sale_per_month[i]
  //           ? item.attributes.sale_per_month[i].quantity
  //           : 0;
  //       const price = item.value || 0;
  //       const monthlyRevenue = monthSale * price;
  //       monthlyTotals[i] += monthlyRevenue;
  //       annualTotal += monthlyRevenue;
  //     }
  //   });

  //   return { monthlyTotals, annualTotal };
  // }, [type, financialItems]);

  // const finalRowRender = useMemo(() => {
  //   if (type !== "profits") return null;

  //   const finalRowCells = [
  //     { value: "CA HT" },
  //     ...monthlyTotals.map((total) => ({ value: total })),
  //     { value: annualTotal },
  //   ];

  //   return (
  //     <tr>
  //       {finalRowCells.map((cell, index) => (
  //         <td key={index}>{cell.value}</td>
  //       ))}
  //     </tr>
  //   );
  // }, [monthlyTotals, annualTotal]);

  // const renderRowsMemoized = useMemo(
  //   () =>
  //     financialItems.map((item) =>
  //       renderRows(item, type, rows, columnTotalKey, headers, handleEditCell)
  //     ),
  //   [financialItems, type, rows, columnTotalKey, headers, handleEditCell]
  // );

  // // Fonction pour rendre la ligne éditable pour "products"
  // const renderEditableRow = useMemo(() => {
  //   if (type !== "products" || !isAddingNewItem) return null;
  //   return (
  //     <tr key="new-item">
  //       {headers.map((header, index) => (
  //         <td key={index}>
  //           <input
  //             type="text"
  //             value={editableNewItem[header.key] || ""}
  //             onChange={(e) =>
  //               setEditableNewItem({
  //                 ...editableNewItem,
  //                 [header.key]: e.target.value,
  //               })
  //             }
  //             placeholder={header.label}
  //           />
  //         </td>
  //       ))}
  //       <td>
  //         <button onClick={handleSaveNewItem}>Sauvegarder</button>
  //       </td>
  //     </tr>
  //   );
  // }, [isAddingNewItem, headers, editableNewItem, handleSaveNewItem, type]);

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
          {financialItems.map((item) => (
            <TableRow
              key={item.id}
              item={item}
              specification={specification}
              onEditCell={onUpdateFinancialItem}
            />
          ))}
          {/* {renderRowsMemoized}
          {type === "profits" && finalRowRender}
          {type === "products" && isAddingNewItem && renderEditableRow()} */}
        </tbody>
      </table>
      {/* {type === "profits" && (
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
      )} */}
    </>
  );
};

export default FinancialItemsTable;
