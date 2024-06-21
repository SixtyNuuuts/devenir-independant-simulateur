import React, { useMemo, useEffect } from "react";
import { tableSpecifications } from "./specification/tableSpecifications";
import TableRow from "./TableRow";
import f from "../utils/function";

const FinancialItemsTable = ({
  financialItems = [],
  type,
  onAddFinancialItem,
  onUpdateFinancialItem,
  onDeleteFinancialItem,
  onAnnualTotalChange,
}) => {
  const specification = tableSpecifications[type];
  if (!specification) {
    console.error(`Type de table non reconnu: ${type}`);
    return null;
  }
  const {
    title,
    caption,
    headers,
    finalRowFinancialData,
    annualTotalLabel,
    asteriskLegendText,
    addBtn,
  } = specification;

  const {
    finalRowFinancialLabel,
    monthlyTotals,
    annualTotalSign,
    annualTotal,
  } = useMemo(
    () => (finalRowFinancialData ? finalRowFinancialData(financialItems) : {}),
    [financialItems]
  );

  useEffect(() => {
    if (onAnnualTotalChange) {
      onAnnualTotalChange(annualTotal);
    }
  }, [annualTotal]);

  const finalRowFinancialRender = useMemo(() => {
    if (!monthlyTotals || !annualTotal) return null;

    const finalRowFinancialCells = [
      { value: finalRowFinancialLabel },
      ...monthlyTotals.map((total) => ({ value: total })),
      { value: annualTotal },
      null,
    ];

    return (
      <tr>
        {finalRowFinancialCells.map((cell, index) => (
          <th key={index}>
            {cell
              ? index === 0
                ? cell.value
                : f.displayValue(cell.value, "financial-value")
              : ""}
          </th>
        ))}
      </tr>
    );
  }, [monthlyTotals]);

  return (
    <section aria-labelledby={type} className="table">
      {title && (
        <h2 className="table-title" id={type}>
          {title}
        </h2>
      )}
      <p id="table-caption" className="table-caption">
        {caption}
      </p>
      <table aria-labelledby="table-caption">
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
        </tbody>
        {finalRowFinancialRender && <tfoot>{finalRowFinancialRender}</tfoot>}
      </table>
      {annualTotal && (
        <figure>
          <figcaption id={`${type}-total-annual`}>
            {annualTotalLabel ?? "Total Année"}
          </figcaption>
          <span
            className="btn-secondary btn-s btn-cancel"
            aria-labelledby={`${type}-total-annual`}
          >
            {annualTotal === 0
              ? 0
              : `${annualTotalSign} ${f.displayValue(
                  annualTotal,
                  "financial-value"
                )}`}
          </span>
        </figure>
      )}
      {(addBtn || asteriskLegendText) && (
        <div className="complementary" role="complementary">
          {asteriskLegendText && (
            <p
              className="asterisk-legend-text"
              aria-label="Explication de l'astérisque"
              dangerouslySetInnerHTML={{ __html: asteriskLegendText }}
            ></p>
          )}
          {addBtn && (
            <button
              aria-label="Ajouter Item"
              className="btn-tertiary btn-s"
              onClick={() => onAddFinancialItem()}
            >
              {addBtn.text ?? "+ ajouter"}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FinancialItemsTable;
