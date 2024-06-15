import React from "react";

const AdminActivityModeButton = ({
  activity,
  isAdminActivity,
  setToggleAdminActivity,
  updateActivity,
  handleSaveActivity,
}) => {
  const handleClick = () => {
    if (isAdminActivity) {
      handleSaveActivity(activity, updateActivity, setToggleAdminActivity);
    } else {
      setToggleAdminActivity(true);
    }
  };

  return (
    <button type="button" onClick={() => handleClick()}>
      {isAdminActivity ? "Enregistrer l'activité" : "Editer l'activité"}
    </button>
  );
};

export default AdminActivityModeButton;
