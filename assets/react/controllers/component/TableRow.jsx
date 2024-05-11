import React from "react";
import EditableCell from "./EditableCell";
import "./TableRow.scss";

const TableRow = ({ item, specification, onEditCell, onDelete }) => {
  const { headers, rows, isDeletableItems, columnTotalSum } = specification;

  return (
    <tr key={item.id}>
      {rows(item)?.map((rowItem, index) => (
        <td key={index} className={item.isLoading ? "loading" : ""}>
          {rowItem.isEditable ? (
            <>
              {index === 0 && isDeletableItems && (
                <div className="cell-with-delete">
                  <button
                    type="button"
                    aria-label="Supprimer Produit"
                    className="delete-icon"
                    onClick={() => onDelete(item.id)}
                  >
                    X
                  </button>
                </div>
              )}
              <EditableCell
                itemValue={rowItem.value}
                itemType={rowItem.type}
                onSave={(newVal) =>
                  onEditCell(item.id, headers[index].key, newVal)
                }
              />
            </>
          ) : (
            rowItem.value
          )}
        </td>
      ))}
      {columnTotalSum && (
        <td>
          {rows(item)
            ?.slice(1)
            .reduce(
              (sum, rowItem) => sum + (parseFloat(rowItem.value, 10) || 0),
              0
            )}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
