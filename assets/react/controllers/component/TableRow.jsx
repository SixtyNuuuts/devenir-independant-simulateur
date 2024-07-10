import React, { useMemo } from "react";
import EditableCell from "./EditableCell";
import "./TableRow.scss";
import f from "../utils/function";
import classNames from "classnames";

const TableRow = ({ item, specification, onEditCell, onDelete }) => {
  const { headers, rows, isDeletableItems, columnTotalSum } = specification;
  const ItemRows = rows(item);

  const calculateTotalSum = () => {
    if (ItemRows.length <= 1) return 0;

    if (ItemRows.length === 2) {
      return parseFloat(ItemRows[1].value ?? 0) * 12;
    }

    return ItemRows.slice(1).reduce(
      (sum, itemRow) => sum + parseFloat(itemRow.value ?? 0),
      0
    );
  };

  const columnTotalSumRender = useMemo(() => {
    if (!ItemRows.length || !columnTotalSum) return null;

    const totalSum = calculateTotalSum();
    if (ItemRows[1].type === "financial-value") {
      return f.displayValue(totalSum, "financial-value");
    }

    return totalSum;
  }, [ItemRows, columnTotalSum]);

  return (
    <tr
      key={item.id}
      className={classNames({
        loading: item.isLoading,
        deleting: item.isDeleting,
      })}
    >
      {ItemRows.length &&
        ItemRows.map((itemRow, index) => (
          <td
            key={index}
            className={classNames({
              "is-editable": itemRow.isEditable,
            })}
          >
            {itemRow.isEditable ? (
              <EditableCell
                itemValue={itemRow.value}
                itemType={itemRow.type}
                onSave={(newVal) =>
                  onEditCell(item.id, headers[index].key, newVal)
                }
              />
            ) : itemRow.type === "product-name" ? (
              <h3>{f.displayValue(itemRow.value, itemRow.type)}</h3>
            ) : (
              f.displayValue(itemRow.value, itemRow.type)
            )}
          </td>
        ))}
      {columnTotalSumRender && <td>{columnTotalSumRender}</td>}
      <td>
        {isDeletableItems && ItemRows[0].isEditable && (
          <button
            type="button"
            aria-label="Supprimer Item"
            className="btn-delete"
            onClick={() => onDelete(item)}
          ></button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
