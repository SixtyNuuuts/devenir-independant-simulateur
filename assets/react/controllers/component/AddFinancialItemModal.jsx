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
    const { name, value, manufacturing_cost } = e.target;
    console.log(name, value, manufacturing_cost);
    // setItem((prev) => ({ ...prev, [name]: value }));
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
