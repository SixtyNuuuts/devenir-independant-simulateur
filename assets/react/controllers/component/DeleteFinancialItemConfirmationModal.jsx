import React from "react";

const DeleteFinancialItemConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
}) => {
  const handleBackgroundClick = (e) => {
    if (e.target.className === "modal") {
      onClose();
    }
  };

  return isOpen ? (
    <div className="modal" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <span className="cross" onClick={onClose}></span>
        <p className="modal-title">Confirmation de suppression</p>
        <p>
          <span>Êtes-vous sûr de vouloir supprimer</span>
          <span className="item-name">{itemName}</span> ?
        </p>
        <div className="modal-buttons-group">
          <button onClick={onClose} className="btn-secondary btn-m">
            Annuler
          </button>
          <button onClick={onDelete} className="btn-primary btn-m">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteFinancialItemConfirmationModal;
