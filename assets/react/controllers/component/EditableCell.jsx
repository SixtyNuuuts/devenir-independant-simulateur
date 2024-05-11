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
          {f.displayValue(value, itemType)}
        </span>
      )}
    </div>
  );
};

export default React.memo(EditableCell);
