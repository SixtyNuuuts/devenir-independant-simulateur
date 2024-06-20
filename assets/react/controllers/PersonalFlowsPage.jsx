import React, { useState, useEffect, useMemo, useCallback } from "react";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import BalanceSection from "./component/BalanceSection";

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
  const {
    financialItems: salaryTargetsData,
    isLoading: salaryTargetsLoading,
    error: salaryTargetsError,
  } = useGetFinancialItems("/salary/target", simulationId);

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();
  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();
  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [financialData, setFinancialData] = useState({
    personalIncomes: [],
    personalExpenses: [],
    salaryTargets: [],
  });

  const [annualTotals, setAnnualTotals] = useState({
    personalIncomes: "0.00",
    personalExpenses: "0.00",
    salaryTargets: "0.00",
  });

  const [modalState, setModalState] = useState({
    personalIncome: false,
    personalExpense: false,
  });

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      personalIncomes: personalIncomesData,
    }));
  }, [personalIncomesData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      personalExpenses: personalExpensesData,
    }));
  }, [personalExpensesData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      salaryTargets: salaryTargetsData,
    }));
  }, [salaryTargetsData]);

  const toggleModal = useCallback((type, state) => {
    setModalState((prevState) => ({ ...prevState, [type]: state }));
  }, []);

  const handleAddItemProcess = useCallback(async (type, item) => {
    const newItem = formatFinancialItemForCreate(
      item,
      simulationId,
      "personal",
      type === "personalIncomes"
        ? "income"
        : type === "personalExpenses"
        ? "expense"
        : "default"
    );
    const result = await createFinancialItem(newItem);
    if (result?.success && result.id) {
      setFinancialData((prevState) => ({
        ...prevState,
        [type]: [...prevState[type], { ...newItem, id: result.id }],
      }));
    } else {
      // Gérer l'erreur
    }
    toggleModal(type, false);
  }, []);

  const handleUpdateItem = useCallback(
    async (type, itemId, fieldKey, newValue) => {
      setFinancialData((prevState) => ({
        ...prevState,
        [type]: prevState[type].map((item) =>
          item.id === itemId ? { ...item, isLoading: true } : item
        ),
      }));
      const originalItem = financialData[type].find(
        (item) => item.id === itemId
      );
      const newItem = formatFinancialItemForUpdate(
        originalItem,
        fieldKey,
        newValue
      );
      const result = await updateFinancialItem(newItem);
      if (result?.success) {
        if (type === "salaryTargets") {
          handleUpdateSalaryTarget(itemId, newItem, newValue);
        } else {
          setFinancialData((prevState) => ({
            ...prevState,
            [type]: prevState[type].map((item) =>
              item.id === itemId
                ? { ...item, ...newItem, isLoading: false }
                : item
            ),
          }));
        }
      } else {
        setFinancialData((prevState) => ({
          ...prevState,
          [type]: prevState[type].map((item) =>
            item.id === itemId ? { ...item, isLoading: false } : item
          ),
        }));
      }
    },
    [financialData]
  );

  const handleUpdateSalaryTarget = (itemId, newItem, newValue) => {
    const netSalary = parseFloat(newValue);
    const employeeContributionRate = 0.3; // 30% to calculate brut salary
    const employerContributionRate = 0.13; // 13% to calculate total cost

    const brutSalary = netSalary * employeeContributionRate + netSalary;
    const totalCompanyCost = brutSalary * employerContributionRate + brutSalary;

    setFinancialData((prevState) => ({
      ...prevState,
      salaryTargets: prevState.salaryTargets.map((item) => {
        if (item.id === itemId) {
          return { ...item, ...newItem, isLoading: false };
        } else if (item.type === "brut") {
          return { ...item, value: brutSalary.toFixed(2) };
        } else if (item.type === "total-company-cost") {
          return { ...item, value: totalCompanyCost.toFixed(2) };
        }
        return item;
      }),
    }));
  };

  const handleDeleteItem = useCallback(async (type, itemId) => {
    setFinancialData((prevState) => ({
      ...prevState,
      [type]: prevState[type].map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      ),
    }));
    const result = await deleteFinancialItem(itemId);
    if (result?.success) {
      setFinancialData((prevState) => ({
        ...prevState,
        [type]: prevState[type].filter((item) => item.id !== itemId),
      }));
    } else {
      setFinancialData((prevState) => ({
        ...prevState,
        [type]: prevState[type].map((item) =>
          item.id === itemId ? { ...item, isLoading: false } : item
        ),
      }));
    }
  }, []);

  const handleAnnualTotalChange = useCallback((type, annualTotal) => {
    setAnnualTotals((prevTotals) => ({
      ...prevTotals,
      [type]: annualTotal,
    }));
  }, []);

  const personalBalanceToday = useMemo(() => {
    return annualTotals.personalIncomes - annualTotals.personalExpenses;
  }, [annualTotals]);

  const personalBalanceTomorrow = useMemo(() => {
    return annualTotals.salaryTargets - annualTotals.personalExpenses;
  }, [annualTotals]);

  if (
    personalIncomesLoading ||
    personalExpensesLoading ||
    salaryTargetsLoading
  ) {
    return <div className="loading">Chargement...</div>;
  }

  if (personalIncomesError || personalExpensesError || salaryTargetsError) {
    return <div>Une erreur est survenue lors du chargement des données.</div>;
  }

  return (
    <>
      <h1 className="title-1">Niveau de vie personnel</h1>
      <p className="description-1">
        Pour pouvoir vivre de votre future activité professionnelle il faut que
        vous puissiez couvrir vos frais personnels en vous versant une
        rémunération minimum
      </p>
      <FinancialItemsTable
        financialItems={financialData.personalExpenses}
        type="personal-expenses"
        onAddFinancialItem={() => toggleModal("personalExpense", true)}
        onUpdateFinancialItem={(itemId, fieldKey, newValue) =>
          handleUpdateItem("personalExpenses", itemId, fieldKey, newValue)
        }
        onDeleteFinancialItem={(itemId) =>
          handleDeleteItem("personalExpenses", itemId)
        }
        onAnnualTotalChange={(annualTotal) =>
          handleAnnualTotalChange("personalExpenses", annualTotal)
        }
      />
      <FinancialItemsTable
        financialItems={financialData.personalIncomes}
        type="personal-incomes"
        onAddFinancialItem={() => toggleModal("personalIncome", true)}
        onUpdateFinancialItem={(itemId, fieldKey, newValue) =>
          handleUpdateItem("personalIncomes", itemId, fieldKey, newValue)
        }
        onDeleteFinancialItem={(itemId) =>
          handleDeleteItem("personalIncomes", itemId)
        }
        onAnnualTotalChange={(annualTotal) =>
          handleAnnualTotalChange("personalIncomes", annualTotal)
        }
      />
      <BalanceSection
        id="balance-today"
        title="Équilibre niveau de vie d'aujourd'hui"
        description="Salaire annuel - frais annuels actuels"
        balanceValue={personalBalanceToday}
      />
      <FinancialItemsTable
        financialItems={financialData.salaryTargets}
        type="salary-targets"
        onAddFinancialItem={null}
        onUpdateFinancialItem={(itemId, fieldKey, newValue) =>
          handleUpdateItem("salaryTargets", itemId, fieldKey, newValue)
        }
        onDeleteFinancialItem={null}
        onAnnualTotalChange={(annualTotal) =>
          handleAnnualTotalChange("salaryTargets", annualTotal)
        }
      />
      <BalanceSection
        id="balance-tomorrow"
        title="Équilibre niveau de vie de demain"
        description="Salaire annuel net envisagé - frais annuels actuels"
        balanceValue={personalBalanceTomorrow}
      />
      <AddFinancialItemModal
        type="personal-income"
        isOpen={modalState.personalIncome}
        onClose={() => toggleModal("personalIncome", false)}
        onSave={(item) => handleAddItemProcess("personalIncomes", item)}
      />
      <AddFinancialItemModal
        type="personal-expense"
        isOpen={modalState.personalExpense}
        onClose={() => toggleModal("personalExpense", false)}
        onSave={(item) => handleAddItemProcess("personalExpenses", item)}
      />
    </>
  );
}

export default PersonalFlowsPage;
