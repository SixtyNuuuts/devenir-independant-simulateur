import React, { useState } from "react";

const EditableCell = ({ initialValue, cellInputType, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const saveAndExitEditing = () => {
    if (value !== initialValue) {
      onSave(value);
    }
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
          type={cellInputType}
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
          {value}
        </span>
      )}
    </div>
  );
};

export default React.memo(EditableCell);
