import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";

function ProfessionalExpensesPage({ simulationId }) {
  const {
    financialItems: professionalExpensesData,
    isLoading: professionalExpensesLoading,
    error: professionalExpensesError,
  } = useGetFinancialItems("/professional/expense", simulationId);

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();

  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();

  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [professionalExpenses, setProfessionalExpenses] = useState([]);

  const [
    isModalAddProfessionalExpenseOpen,
    setModalAddProfessionalExpenseOpen,
  ] = useState(false);

  useEffect(() => {
    setProfessionalExpenses(professionalExpensesData);
  }, [professionalExpensesData]);

  const onAddFinancialItem = () => {
    setModalAddProfessionalExpenseOpen(true);
  };

  const onAddFinancialItemProcess = async (item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "professional",
      "expense"
    );
    const result = await createFinancialItem(newItem);
    if (result && result.success && result.id) {
      setProfessionalExpenses((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
    } else {
      // Gérer l'erreur
    }

    setModalAddProfessionalExpenseOpen(false);
  };

  const onUpdateFinancialItem = async (itemId, fieldKey, newValue) => {
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = professionalExpenses.find(
      (item) => item.id === itemId
    );
    const newItem = formatFinancialItemForUpdate(
      originalItem,
      fieldKey,
      newValue
    );
    const result = await updateFinancialItem(newItem);
    if (result && result.success) {
      setProfessionalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, ...newItem, isLoading: false } : item
        )
      );
    } else {
      setProfessionalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: false } : item
        )
      );
    }
  };

  const onDeleteFinancialItem = async (itemId) => {
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result && result.success) {
      setProfessionalExpenses((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } else {
      // Gérer l'erreur
    }
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  };

  return (
    <div className={professionalExpensesLoading ? "loading" : ""}>
      {professionalExpensesLoading ? (
        <div>Chargement...</div>
      ) : professionalExpensesError ? (
        <div>Une erreur est survenue lors du chargement des données.</div>
      ) : (
        <main>
          <h1>Charges</h1>
          <FinancialItemsTable
            financialItems={professionalExpenses}
            type="charges"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={onDeleteFinancialItem}
          />
          <AddFinancialItemModal
            type="charge"
            isOpen={isModalAddProfessionalExpenseOpen}
            onClose={() => setModalAddProfessionalExpenseOpen(false)}
            onSave={onAddFinancialItemProcess}
          />
        </main>
      )}
    </div>
  );
}

export default ProfessionalExpensesPage;
