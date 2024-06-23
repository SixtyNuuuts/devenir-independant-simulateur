import React, { useState, useEffect, useRef } from "react";
import { AddFinancialItemModalSpecifications } from "./specification/AddFinancialItemModalSpecifications";
import f from "../utils/function";
import classNames from "classnames";

const AddProfessionalIncome = ({ type, isOpen, onClose, onSave }) => {
  const specification = AddFinancialItemModalSpecifications[type];
  if (!specification) {
    console.error(`Type de modale non reconnu: ${type}`);
    return null;
  }
  const { title, fields } = specification;

  const initializeItemState = () => {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.initValue || "";
      return acc;
    }, {});
  };

  const [item, setItem] = useState(initializeItemState);

  const resetForm = () => {
    setItem(initializeItemState());
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const debounceTimeoutRef = useRef(null);

  const debouncedHandleChange = (fieldName, fieldValue, fieldType) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (fieldValue !== "") {
      const formatedValue = f.formatValue(fieldValue, fieldType);
      debounceTimeoutRef.current = setTimeout(() => {
        setItem((prev) => ({
          ...prev,
          [fieldName]: formatedValue === ".00" ? "00.00" : formatedValue,
        }));
      }, 900);
    }
  };

  const handleChange = (e, fieldType) => {
    const { name: fieldName, value: fieldValue } = e.target;
    setItem((prev) => ({ ...prev, [fieldName]: fieldValue }));
    debouncedHandleChange(fieldName, fieldValue, fieldType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return isOpen ? (
    <div className="modal" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <span className="cross" onClick={onClose}></span>
        <p className="modal-title">{title}</p>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name} className="input">
              <input
                type={
                  ["financial-value"].includes(field.type) ? "text" : field.type
                }
                name={field.name}
                value={item[field.name]}
                className={classNames({
                  filled: item[field.name],
                })}
                onChange={(e) => handleChange(e, field.type)}
              />
              <span className="label">{field.label}</span>
            </label>
          ))}
          <button className="btn-primary btn-l" type="submit">
            Valider
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddProfessionalIncome;
