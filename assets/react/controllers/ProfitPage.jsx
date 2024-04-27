import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";

function ProfitPage({ simulationId }) {
  const {
    financialItems,
    isLoading: loadingGetFinancialItems,
    error,
  } = useGetFinancialItems("/professional/income", simulationId);
  const { updateNestedItemValue, updateFinancialItem } =
    useUpdateFinancialItem();
  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [professionalIncomes, setProfessionalIncomes] = useState([]);

  useEffect(() => {
    setProfessionalIncomes(financialItems);
  }, [financialItems]);

  // Handlers pour ajouter, mettre à jour et supprimer les éléments financiers
  const onAddFinancialItem = (item) => {
    // Logique pour ajouter un élément financier
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
        </main>
      )}
    </div>
  );
}

export default ProfitPage;
