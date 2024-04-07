import React, { useState } from "react";

const EditableCell = ({ initialValue, onSave, itemId, fieldKey }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setEditing(false);
    if (value !== initialValue) {
      onSave(value, itemId, fieldKey);
    }
  };

  return editing ? (
    <input
      type={fieldKey.includes("quantity") ? "number" : "text"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <span onClick={() => setEditing(true)}>{initialValue}</span>
  );
};

export default EditableCell;
