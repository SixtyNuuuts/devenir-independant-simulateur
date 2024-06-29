import React from "react";

const AdminActivityObjectiveList = ({
  objectives,
  handleObjectiveChange,
  handleAddObjective,
  handleRemoveObjective,
}) => {
  return (
    <div className="home-objectives">
      {objectives.map((objective, index) => (
        <div key={index}>
          <textarea
            name={`objective ${index}`}
            value={objective}
            onChange={(e) => handleObjectiveChange(index, e.target.value)}
          />
          <button
            className="btn-delete"
            onClick={() => handleRemoveObjective(index)}
          ></button>
        </div>
      ))}
      <button className="btn-secondary btn-s" onClick={handleAddObjective}>
        +
      </button>
    </div>
  );
};

export default AdminActivityObjectiveList;
