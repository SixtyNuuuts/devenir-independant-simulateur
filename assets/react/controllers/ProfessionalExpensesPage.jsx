import React, { useState, useEffect, useCallback } from "react";
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

  const onAddFinancialItem = useCallback(() => {
    setModalAddProfessionalExpenseOpen(true);
  }, []);

  const onAddFinancialItemProcess = useCallback(async (item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "professional",
      "expense"
    );
    const result = await createFinancialItem(newItem);
    if (result?.success && result.id) {
      setProfessionalExpenses((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
      // setProfessionalExpenses((currentItems) => {
      //   const salaryItemIndex = currentItems.findIndex(
      //     (item) => item.nature === "salary"
      //   );

      //   if (salaryItemIndex === -1) {
      //     return [...currentItems, { ...newItem, id: currentItems.length + 1 }];
      //   }

      //   return [
      //     ...currentItems.slice(0, salaryItemIndex),
      //     { ...newItem, id: currentItems.length + 1 },
      //     ...currentItems.slice(salaryItemIndex),
      //   ];
      // });
    } else {
      // Gérer l'erreur
    }

    setModalAddProfessionalExpenseOpen(false);
  }, []);

  const onUpdateFinancialItem = useCallback(
    async (itemId, fieldKey, newValue) => {
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
      if (result?.success) {
        setProfessionalExpenses((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId
              ? { ...item, ...newItem, isLoading: false }
              : item
          )
        );
      } else {
        setProfessionalExpenses((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId ? { ...item, isLoading: false } : item
          )
        );
      }
    },
    [professionalExpenses]
  );

  const onDeleteFinancialItem = useCallback(async (itemId) => {
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result?.success) {
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
  }, []);

  return (
    <>
      {professionalExpensesLoading ? (
        <div>Chargement...</div>
      ) : professionalExpensesError ? (
        <div>Une erreur est survenue lors du chargement des données.</div>
      ) : (
        <>
          <h1 className="title-1 hidden-mobile">Charges</h1>
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
        </>
      )}
    </>
  );
}

export default ProfessionalExpensesPage;
