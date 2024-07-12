import React, { useState } from "react";
import f from "../utils/function";

const EditableCell = ({ itemValue: initialValue, itemType, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const saveAndExitEditing = () => {
    const formattedValue = f.formatValue(value, itemType);
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

  const handleFocus = () => {
    setEditing(true);
  };

  return (
    <>
      {editing ? (
        <input
          type={
            ["product-name", "financial-value"].includes(itemType)
              ? "text"
              : itemType
          }
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
          onFocus={handleFocus}
        >
          {itemType === "product-name" ? (
            <h3>{f.displayValue(value, itemType)}</h3>
          ) : (
            f.displayValue(value, itemType)
          )}
        </span>
      )}
    </>
  );
};

export default React.memo(EditableCell);
