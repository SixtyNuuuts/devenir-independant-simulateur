import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";

function ProfitPage({ simulationId }) {
  const {
    financialItems,
    isLoading: loadingGetFinancialItems,
    error,
  } = useGetFinancialItems("/professional/income", simulationId);

  const { createFinancialItem } = useCreateFinancialItem();

  const { updateNestedItemValue, updateFinancialItem } =
    useUpdateFinancialItem();

  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [professionalIncomes, setProfessionalIncomes] = useState([]);

  const [isModalAddProfessionalIncomeOpen, setModalAddProfessionalIncomeOpen] =
    useState(false);

  useEffect(() => {
    setProfessionalIncomes(financialItems);
  }, [financialItems]);

  const onAddFinancialItem = () => {
    setModalAddProfessionalIncomeOpen(true);
  };

  // Handlers pour ajouter, mettre à jour et supprimer les éléments financiers
  const onAddFinancialItemProcess = async (item) => {
    const result = await createFinancialItem(item);
    if (result && result.success) {
      setProfessionalIncomes((currentItems) => [...currentItems, newItem]);
    } else {
      // Gérer l'erreur
    }
    setModalAddProfessionalIncomeOpen(false);
  };

  const onUpdateFinancialItem = async (itemId, fieldKey, newValue) => {
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = professionalIncomes.find((item) => item.id === itemId);
    const newItem = updateNestedItemValue(originalItem, fieldKey, newValue);
    const result = await updateFinancialItem(newItem);
    if (result && result.success) {
      setProfessionalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, ...newItem, isLoading: false } : item
        )
      );
    } else {
      setProfessionalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: false } : item
        )
      );
    }
  };

  const onDeleteFinancialItem = async (itemId) => {
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result && result.success) {
      setProfessionalIncomes((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } else {
      // Gérer l'erreur
    }
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  };

  return (
    <div className={loadingGetFinancialItems ? "loading" : ""}>
      {loadingGetFinancialItems ? (
        <div>Chargement...</div>
      ) : error ? (
        <div>Une erreur est survenue lors du chargement des données.</div>
      ) : (
        <main>
          <h1>Profits</h1>
          <FinancialItemsTable
            financialItems={professionalIncomes}
            type="profits"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={onDeleteFinancialItem}
          />
          <FinancialItemsTable
            financialItems={professionalIncomes}
            type="products"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={onDeleteFinancialItem}
          />
          <AddFinancialItemModal
            type="product"
            isOpen={isModalAddProfessionalIncomeOpen}
            onClose={() => setModalAddProfessionalIncomeOpen(false)}
            onSave={onAddFinancialItemProcess}
          />
        </main>
      )}
    </div>
  );
}

export default ProfitPage;
