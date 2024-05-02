import React, { useState } from "react";
import { AddFinancialItemModalSpecifications } from "./specification/AddFinancialItemModalSpecifications";

const AddProfessionalIncome = ({ type, isOpen, onClose, onSave }) => {
  const specification = AddFinancialItemModalSpecifications[type];
  if (!specification) {
    console.error(`Type de modale non reconnu: ${type}`);
    return null;
  }
  const { title, fields } = specification;

  const [item, setItem] = useState(
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: "",
      }),
      {}
    )
  );

  const handleChange = (e) => {
    const { name: fieldName, value: fieldValue } = e.target;
    setItem((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item);
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}:
              <input
                type={field.type}
                name={field.name}
                value={item[field.name]}
                onChange={handleChange}
              />
            </label>
          ))}
          <div>
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddProfessionalIncome;
