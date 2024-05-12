import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";

function PersonalFlowsPage({ simulationId }) {
  const {
    financialItems: personalIncomesData,
    isLoading: personalIncomesLoading,
    error: personalIncomesError,
  } = useGetFinancialItems("/personal/income", simulationId);
  const {
    financialItems: personalExpensesData,
    isLoading: personalExpensesLoading,
    error: personalExpensesError,
  } = useGetFinancialItems("/personal/expense", simulationId);

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();
  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();
  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [personalIncomes, setPersonalIncomes] = useState([]);
  const [personalExpenses, setPersonalExpenses] = useState([]);

  const [isModalAddPersonalIncomeOpen, setModalAddPersonalIncomeOpen] =
    useState(false);
  const [isModalAddPersonalExpenseOpen, setModalAddPersonalExpenseOpen] =
    useState(false);

  useEffect(() => {
    setPersonalIncomes(personalIncomesData);
  }, [personalIncomesData]);
  useEffect(() => {
    setPersonalExpenses(personalExpensesData);
  }, [personalExpensesData]);

  const onAddPersonalIncome = () => {
    setModalAddPersonalIncomeOpen(true);
  };
  const onAddPersonalExpense = () => {
    setModalAddPersonalExpenseOpen(true);
  };

  const onAddPersonalIncomeProcess = async (item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "personal",
      "income"
    );
    const result = await createFinancialItem(newItem);
    if (result && result.success && result.id) {
      setPersonalIncomes((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
    } else {
      // Gérer l'erreur
    }

    setModalAddPersonalIncomeOpen(false);
  };
  const onAddPersonalExpenseProcess = async (item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "personal",
      "expense"
    );
    const result = await createFinancialItem(newItem);
    if (result && result.success && result.id) {
      setPersonalExpenses((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
    } else {
      // Gérer l'erreur
    }

    setModalAddPersonalExpenseOpen(false);
  };

  const onUpdatePersonalIncome = async (itemId, fieldKey, newValue) => {
    setPersonalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = personalIncomes.find((item) => item.id === itemId);
    const newItem = formatFinancialItemForUpdate(
      originalItem,
      fieldKey,
      newValue
    );
    const result = await updateFinancialItem(newItem);
    if (result && result.success) {
      setPersonalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, ...newItem, isLoading: false } : item
        )
      );
    } else {
      setPersonalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: false } : item
        )
      );
    }
  };
  const onUpdatePersonalExpense = async (itemId, fieldKey, newValue) => {
    setPersonalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = personalExpenses.find((item) => item.id === itemId);
    const newItem = formatFinancialItemForUpdate(
      originalItem,
      fieldKey,
      newValue
    );
    const result = await updateFinancialItem(newItem);
    if (result && result.success) {
      setPersonalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, ...newItem, isLoading: false } : item
        )
      );
    } else {
      setPersonalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: false } : item
        )
      );
    }
  };

  const onDeletePersonalIncome = async (itemId) => {
    setPersonalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result && result.success) {
      setPersonalIncomes((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } else {
      // Gérer l'erreur
    }
    setPersonalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  };
  const onDeletePersonalExpense = async (itemId) => {
    setPersonalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result && result.success) {
      setPersonalExpenses((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } else {
      // Gérer l'erreur
    }
    setPersonalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  };

  return (
    <div
      className={
        personalIncomesLoading || personalExpensesLoading ? "loading" : ""
      }
    >
      {personalIncomesLoading || personalExpensesLoading ? (
        <div>Chargement...</div>
      ) : personalIncomesError || personalExpensesError ? (
        <div>Une erreur est survenue lors du chargement des données.</div>
      ) : (
        <main>
          <h1>Niveau de vie personnel</h1>
          <p>
            Pour pouvoir vivre de votre future activité professionnelle il faut
            que vous puissiez couvrir vos frais personnels en vous versant une
            rémunération minimum
          </p>
          <FinancialItemsTable
            financialItems={personalExpenses}
            type="personal-expenses"
            onAddFinancialItem={onAddPersonalExpense}
            onUpdateFinancialItem={onUpdatePersonalExpense}
            onDeleteFinancialItem={onDeletePersonalExpense}
          />
          <FinancialItemsTable
            financialItems={personalIncomes}
            type="personal-incomes"
            onAddFinancialItem={onAddPersonalIncome}
            onUpdateFinancialItem={onUpdatePersonalIncome}
            onDeleteFinancialItem={onDeletePersonalIncome}
          />
          <AddFinancialItemModal
            type="personal-income"
            isOpen={isModalAddPersonalIncomeOpen}
            onClose={() => setModalAddPersonalIncomeOpen(false)}
            onSave={onAddPersonalIncomeProcess}
          />
          <AddFinancialItemModal
            type="personal-expense"
            isOpen={isModalAddPersonalExpenseOpen}
            onClose={() => setModalAddPersonalExpenseOpen(false)}
            onSave={onAddPersonalExpenseProcess}
          />
        </main>
      )}
    </div>
  );
}

export default PersonalFlowsPage;
