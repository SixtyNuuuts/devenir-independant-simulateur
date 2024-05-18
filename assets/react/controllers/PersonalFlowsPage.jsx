import React, { useState, useEffect, useMemo } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";
import f from "./utils/function";

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

  const [personalIncomes, setPersonalIncomes] = useState([]);
  const [personalExpenses, setPersonalExpenses] = useState([]);
  const [salaryTargets, setSalaryTargets] = useState([]);

  const [annualTotals, setAnnualTotals] = useState({
    personalIncomes: "0.00",
    personalExpenses: "0.00",
    salaryTargets: "0.00",
  });

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
  useEffect(() => {
    setSalaryTargets(salaryTargetsData);
  }, [salaryTargetsData]);

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
  const onUpdateSalaryTarget = async (itemId, fieldKey, newValue) => {
    setSalaryTargets((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const originalItem = salaryTargets.find((item) => item.id === itemId);
    const newItem = formatFinancialItemForUpdate(
      originalItem,
      fieldKey,
      newValue
    );
    const result = await updateFinancialItem(newItem);
    if (result && result.success) {
      const netSalary = parseFloat(newValue);
      const employeeContributionRate = 0.3; // 30% to calculate brut salary
      const employerContributionRate = 0.13; // 13% to calculate total cost

      const brutSalary = netSalary * employeeContributionRate + netSalary;
      const totalCompanyCost =
        brutSalary * employerContributionRate + brutSalary;

      setSalaryTargets(
        (currentItems) =>
          (currentItems = currentItems.map((item) => {
            if (item.id === itemId) {
              return { ...item, ...newItem, isLoading: false };
            } else if (item.type === "brut") {
              return { ...item, value: brutSalary.toFixed(2) };
            } else if (item.type === "total-company-cost") {
              return { ...item, value: totalCompanyCost.toFixed(2) };
            }
            return item;
          }))
      );
    } else {
      setSalaryTargets((currentItems) =>
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

  const handleAnnualTotalChange = (type, annualTotal) => {
    setAnnualTotals((prevTotals) => ({
      ...prevTotals,
      [type]: annualTotal,
    }));
  };

  const personalBalanceToday = useMemo(() => {
    return annualTotals["personal-incomes"] - annualTotals["personal-expenses"];
  }, [annualTotals["personal-incomes"], annualTotals["personal-expenses"]]);

  const personalBalanceTomorrow = useMemo(() => {
    return annualTotals["salary-targets"] - annualTotals["personal-expenses"];
  }, [annualTotals["salary-targets"], annualTotals["personal-expenses"]]);

  return (
    <div
      className={
        personalIncomesLoading ||
        personalExpensesLoading ||
        salaryTargetsLoading
          ? "loading"
          : ""
      }
    >
      {personalIncomesLoading ||
      personalExpensesLoading ||
      salaryTargetsLoading ? (
        <div>Chargement...</div>
      ) : personalIncomesError ||
        personalExpensesError ||
        salaryTargetsError ? (
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
            onAnnualTotalChange={handleAnnualTotalChange}
          />
          <FinancialItemsTable
            financialItems={personalIncomes}
            type="personal-incomes"
            onAddFinancialItem={onAddPersonalIncome}
            onUpdateFinancialItem={onUpdatePersonalIncome}
            onDeleteFinancialItem={onDeletePersonalIncome}
            onAnnualTotalChange={handleAnnualTotalChange}
          />
          <figure>
            <figcaption>
              <strong>Equilibre niveau de vie d'aujourd'hui</strong> = Salaire
              annuel - frais annuels actuels
            </figcaption>
            <span className={f.getCssClassForValue(personalBalanceToday)}>
              {f.getSignForValue(personalBalanceToday)}{" "}
              {f.displayValue(
                Math.abs(personalBalanceToday),
                "financial-value"
              )}
            </span>
          </figure>
          <FinancialItemsTable
            financialItems={salaryTargets}
            type="salary-targets"
            onAddFinancialItem={null}
            onUpdateFinancialItem={onUpdateSalaryTarget}
            onDeleteFinancialItem={null}
            onAnnualTotalChange={handleAnnualTotalChange}
          />
          <figure>
            <figcaption>
              <strong>Equilibre niveau de vie de demain</strong> = Salaire
              annuel net envisagé - frais annuels actuels
            </figcaption>
            <span className={f.getCssClassForValue(personalBalanceTomorrow)}>
              {f.getSignForValue(personalBalanceTomorrow)}{" "}
              {f.displayValue(
                Math.abs(personalBalanceTomorrow),
                "financial-value"
              )}
            </span>
          </figure>
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
