import React, { useState } from "react";

const EditableCell = ({ itemValue: initialValue, itemType, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    let newValue = e.target.value;
    const isDeleteContentBackward =
      e.nativeEvent.inputType === "deleteContentBackward";

    if (!newValue && !isDeleteContentBackward) return;

    switch (itemType) {
      case "number":
        newValue = parseFloat(newValue);
        const minValNum = 0;
        const maxValNum = 9999999;

        if (newValue < minValNum) {
          newValue = minValNum;
        }

        if (newValue > maxValNum) {
          newValue = maxValNum;
        }
        break;

      case "financial-value":
        let numericRegex = /^\d+(\.\d{1,2})?$/;

        if (numericRegex.test(newValue)) {
          newValue = newValue.replace(/\./g, ",");
        } else {
          newValue = newValue.replace(/[^\d.,]/g, "");

          newValue = newValue.replace(/([,.]\d{2})\d+/g, (match) =>
            match.substring(0, match.length - 1)
          );

          newValue = newValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
        }

        break;

      case "text":
        if (newValue.length > 255) {
          newValue = newValue.slice(0, 255);
        }
        break;

      default:
        break;
    }

    setValue(newValue);
  };

  const saveAndExitEditing = () => {
    if (!value && itemType === "number") {
      setValue(0);
    }
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
          type={itemType === "financial-value" ? "text" : itemType}
          value={value}
          onChange={handleChange}
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
