import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";

function ProfitPage({ simulationId }) {
  const {
    financialItems,
    isLoading: loadingGetFinancialItems,
    error,
  } = useGetFinancialItems("/professional/income", simulationId);

  const {
    updateFinancialItem,
    isLoading: loadingUpdateFinancialItem,
    error: updateError,
  } = useUpdateFinancialItem();

  const [professionalIncomes, setProfessionalIncomes] = useState([]);

  useEffect(() => {
    setProfessionalIncomes(financialItems);
  }, [financialItems]);

  // Handlers pour ajouter, mettre à jour et supprimer les éléments financiers
  const onAddFinancialItem = (item) => {
    // Logique pour ajouter un élément financier
  };

  const onUpdateFinancialItem = async (item, fieldKey, newValue) => {
    const updatedItem = updateItem(item, fieldKey, newValue);
    const result = await updateFinancialItem(updatedItem);
    if (result) {
      setProfessionalIncomes((currentItems) => {
        return currentItems.map((fi) =>
          fi.id === item.id ? { ...fi, ...updatedItem } : fi
        );
      });
    }
  };

  const onDeleteFinancialItem = (itemId) => {
    // Logique pour supprimer un élément financier
  };

  function updateItem(item, valuePath, value) {
    const updatedItem = { ...item };
    if (valuePath.includes(".")) {
      const keys = valuePath.split(".");
      const lastKey = keys.pop();
      const lastObj = keys.reduce(
        (o, key) => (o[key] = o[key] || {}),
        updatedItem
      );
      lastObj[lastKey] = value;
    } else {
      updatedItem[valuePath] = value;
    }
    return updatedItem;
  }

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
