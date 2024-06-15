import React from "react";

const AdminActivityObjectiveList = ({
  objectives,
  handleObjectiveChange,
  handleAddObjective,
  handleRemoveObjective,
}) => {
  return (
    <div>
      {objectives.map((objective, index) => (
        <div key={index}>
          <textarea
            name={`objective ${index}`}
            value={objective}
            onChange={(e) => handleObjectiveChange(index, e.target.value)}
            rows="1"
          />
          <button onClick={() => handleRemoveObjective(index)}>X</button>
        </div>
      ))}
      <button onClick={handleAddObjective}>+</button>
    </div>
  );
};

export default AdminActivityObjectiveList;
