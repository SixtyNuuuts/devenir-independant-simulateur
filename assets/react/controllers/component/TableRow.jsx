import React from "react";
import EditableCell from "./EditableCell";

const TableRow = ({ item, specification, onEditCell }) => {
  const { headers, rows, columnTotalKey } = specification;

  return (
    <tr key={item.id}>
      {rows(item)?.map((rowItem, index) => (
        <td key={index}>
          <EditableCell
            initialValue={rowItem.value ?? rowItem.quantity ?? ""}
            cellInputType={
              headers[index].key.includes("quantity") ? "number" : "text"
            }
            onSave={(newVal) =>
              onEditCell(
                item,
                headers[index].key,
                headers[index].key.includes("quantity")
                  ? parseInt(newVal)
                  : newVal
              )
            }
          />
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
