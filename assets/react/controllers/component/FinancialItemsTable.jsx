import React, { useMemo } from "react";
import { tableSpecifications } from "./specification/tableSpecifications";
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
  const { caption, headers, lineTotalData, addBtn } = specification;

  const { lineTotalLabel, monthlyTotals, annualTotal } = useMemo(
    () => (lineTotalData ? lineTotalData(financialItems) : {}),
    [financialItems]
  );

  const totalRowRender = useMemo(() => {
    if (!monthlyTotals && !annualTotal) return null;

    const finalRowCells = [
      { value: lineTotalLabel },
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
  }, [monthlyTotals, monthlyTotals]);

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
              specification={{ ...specification, type }}
              onEditCell={onUpdateFinancialItem}
              onDelete={onDeleteFinancialItem}
            />
          ))}
          {totalRowRender}
        </tbody>
      </table>
      {annualTotal && (
        <div style={{ marginTop: "20px" }}>
          <span>CA HT total Année 1: </span>
          <span>{annualTotal >= 0 ? `+${annualTotal}` : annualTotal}</span>
        </div>
      )}
      {addBtn && (
        <button onClick={() => onAddFinancialItem()}>
          {addBtn.text ?? "Ajouter un élément"}
        </button>
      )}
    </>
  );
};

export default FinancialItemsTable;
