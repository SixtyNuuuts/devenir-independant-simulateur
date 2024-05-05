import React from "react";
import EditableCell from "./EditableCell";
import "./TableRow.scss";

const TableRow = ({ item, specification, onEditCell, onDelete }) => {
  const { headers, rows, isDeletableItems, columnTotalKey } = specification;

  return (
    <tr key={item.id}>
      {rows(item)?.map((rowItem, index) => (
        <td key={index} className={item.isLoading ? "loading" : ""}>
          {index === 0 && isDeletableItems ? (
            <div className="cell-with-delete">
              {rowItem.value}
              <button
                type="button"
                aria-label="Supprimer Produit"
                className="delete-icon"
                onClick={() => onDelete(item.id)}
              >
                X
              </button>
            </div>
          ) : (
            <EditableCell
              initialValue={rowItem.value ?? rowItem.quantity ?? ""}
              cellInputType={
                headers[index].key.includes("quantity") ? "number" : "text"
              }
              onSave={(newVal) =>
                onEditCell(
                  item.id,
                  headers[index].key,
                  headers[index].key.includes("quantity")
                    ? parseInt(newVal)
                    : newVal
                )
              }
            />
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
  );
};

export default TableRow;
