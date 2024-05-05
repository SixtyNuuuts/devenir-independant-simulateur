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

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();

  const { updateFinancialItem, formatFinancialItemForUpdate } =
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

  const onAddFinancialItemProcess = async (item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "professional",
      "income"
    );
    const result = await createFinancialItem(newItem);
    if (result && result.success && result.id) {
      setProfessionalIncomes((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
    } else {
      // Gérer l'erreur
    }
    console.log(professionalIncomes);
    setModalAddProfessionalIncomeOpen(false);
  };

  const onUpdateFinancialItem = async (itemId, fieldKey, newValue) => {
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = professionalIncomes.find((item) => item.id === itemId);
    const newItem = formatFinancialItemForUpdate(
      originalItem,
      fieldKey,
      newValue
    );
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
