import React, { useState, useEffect, useMemo, useCallback } from "react";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import DeleteFinancialItemConfirmationModal from "./component/DeleteFinancialItemConfirmationModal";
import BalanceSection from "./component/BalanceSection";
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
    personalIncomes: false,
    personalExpenses: false,
  });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    const formattedItem = {
      name: f.formatValue(item.name, "text"),
      value: f.formatValue(item.value, "financial-value"),
    };
    const newItem = formatFinancialItemForCreate(
      formattedItem,
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
        [type]: prevState[type].map((item) =>
          item.id === itemId ? { ...item, isDeleting: true } : item
        ),
      }));
      setTimeout(() => {
        setFinancialData((prevState) => ({
          ...prevState,
          [type]: prevState[type].filter((item) => item.id !== itemId),
        }));
      }, 300);
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

  const handleDeleteClick = useCallback((type, item) => {
    setItemToDelete({ type, item });
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (itemToDelete && itemToDelete.type && itemToDelete.item) {
      await handleDeleteItem(itemToDelete.type, itemToDelete.item.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, handleDeleteItem]);

  const personalBalanceToday = useMemo(() => {
    return annualTotals.personalIncomes - annualTotals.personalExpenses;
  }, [annualTotals]);

  const personalBalanceTomorrow = useMemo(() => {
    return annualTotals.salaryTargets - annualTotals.personalExpenses;
  }, [annualTotals]);

  return (
    <>
      <div className="title-description-zone">
        <h1 className="title-1">Niveau de vie personnel</h1>
        <p className="description-1">
          Pour pouvoir vivre de votre future activité professionnelle il faut
          que vous puissiez couvrir vos frais personnels en vous versant une
          rémunération minimum
        </p>
      </div>
      <div className="personal-data">
        {personalExpensesLoading ? (
          <>
            <section aria-labelledby="personal-expenses" className="table">
              <h2 className="table-title" id="personal-expenses">
                Frais personnels aujourd'hui
              </h2>
              <p id="table-caption" className="table-caption">
                Combien je dépense par mois/an pour vivre actuellement
              </p>
              <table aria-labelledby="table-caption">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Mensuel</th>
                    <th>Annuel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°1</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        900,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      10 800,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-70">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°2</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        400,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      4 800,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°3</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        200,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      2 400,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-70">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°4</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        500,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      6 000,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°5</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        300,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      3 600,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°6</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        900,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      10 800,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-70">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°7</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        400,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      4 800,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°8</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        200,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      2 400,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-70">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°9</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        500,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      6 000,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="is-editable is-loading is-l-right is-l-75">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        <h3>Frais personnel n°10</h3>
                      </span>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        300,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      3 600,00 €
                    </td>
                    <td>
                      <button
                        type="button"
                        aria-label="Supprimer Item"
                        className="btn-delete"
                      ></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <figure>
                <figcaption id="personal-expenses-total-annual">
                  Total Frais annuels
                </figcaption>
                <span
                  className="btn-secondary btn-s btn-cancel is-loading is-l-80"
                  aria-labelledby="personal-expenses-total-annual"
                >
                  22 320,00 €
                </span>
              </figure>
              <div className="complementary" role="complementary">
                <button
                  aria-label="Ajouter Item"
                  className="btn-tertiary btn-s"
                >
                  + ajouter un frais
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <FinancialItemsTable
              financialItems={financialData.personalExpenses}
              type="personal-expenses"
              onAddFinancialItem={() => toggleModal("personalExpenses", true)}
              onUpdateFinancialItem={(itemId, fieldKey, newValue) =>
                handleUpdateItem("personalExpenses", itemId, fieldKey, newValue)
              }
              onDeleteFinancialItem={(item) =>
                handleDeleteClick("personalExpenses", item)
              }
              onAnnualTotalChange={(annualTotal) =>
                handleAnnualTotalChange("personalExpenses", annualTotal)
              }
            />
          </>
        )}
        {personalIncomesLoading || salaryTargetsLoading ? (
          <div className="salary-zone">
            <section aria-labelledby="personal-incomes" className="table">
              <h2 className="table-title" id="personal-incomes">
                Salaire aujourd'hui
              </h2>
              <p id="table-caption" className="table-caption">
                Combien je gagne actuellement en salaire net par mois
              </p>
              <table aria-labelledby="table-caption">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Mensuel</th>
                    <th>Annuel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="">
                      <h3>Salaire net</h3>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-50">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        3 000,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      36 000,00 €
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <figure>
                <figcaption id="personal-incomes-total-annual">
                  Salaire annuel
                </figcaption>
                <span
                  className="btn-secondary btn-s btn-cancel is-loading is-l-80"
                  aria-labelledby="personal-incomes-total-annual"
                >
                  36 000,00 €
                </span>
              </figure>
              <div className="complementary" role="complementary">
                <button
                  aria-label="Ajouter Item"
                  className="btn-tertiary btn-s"
                >
                  + ajouter un revenu
                </button>
              </div>
            </section>
            <section
              aria-labelledby="balance-today"
              className="balance-section"
            >
              <div>
                <h2 className="balance-section-title" id="balance-today">
                  Équilibre niveau de vie d'aujourd'hui
                </h2>
                <p className="balance-section-description">
                  = Salaire annuel - frais annuels actuels
                </p>
              </div>
              <span className="btn-primary btn-s btn-success btn-cancel is-loading is-l-80 is-l-80 is-l-www">
                + 13 680,00 €
              </span>
            </section>
            <section aria-labelledby="salary-targets" className="table">
              <h2 className="table-title" id="salary-targets">
                Salaire demain
              </h2>
              <p id="table-caption" className="table-caption">
                Ce que je vise comme rémunération avec ma future activité
              </p>
              <table aria-labelledby="table-caption">
                <thead>
                  <tr>
                    <th>Intitulé</th>
                    <th>Mensuel</th>
                    <th>Annuel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="">
                      <h3>Salaire net envisagé</h3>
                    </td>
                    <td className="is-editable is-loading is-l-right is-l-45">
                      <span tabIndex="0" role="button" aria-label="Edit">
                        600,00 €
                      </span>
                    </td>
                    <td className="is-loading is-l-right is-l-70">
                      7 200,00 €
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="">
                      <h3>Salaire brut</h3>
                    </td>
                    <td className="is-loading is-l-right is-l-50">780,00 €</td>
                    <td className="is-loading is-l-right is-l-75">
                      9 360,00 €
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="">
                      <h3>Cout total entreprise</h3>
                    </td>
                    <td className="is-loading is-l-right is-l-55">881,40 €</td>
                    <td className="is-loading is-l-right is-l-80">
                      10 576,80 €
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <figure>
                <figcaption id="salary-targets-total-annual">
                  Salaire annuel net envisagé
                </figcaption>
                <span
                  className="btn-secondary btn-s btn-cancel is-loading"
                  aria-labelledby="salary-targets-total-annual"
                >
                  7 200,00 €
                </span>
              </figure>
            </section>
            <section
              aria-labelledby="balance-tomorrow"
              className="balance-section"
            >
              <div>
                <h2 className="balance-section-title" id="balance-tomorrow">
                  Équilibre niveau de vie de demain
                </h2>
                <p className="balance-section-description">
                  = Salaire annuel net envisagé - frais annuels actuels
                </p>
              </div>
              <span className="btn-primary btn-s btn-danger btn-cancel is-loading is-l-80 is-l-www">
                - 15 120,00 €
              </span>
            </section>
          </div>
        ) : (
          <>
            <div className="salary-zone">
              <FinancialItemsTable
                financialItems={financialData.personalIncomes}
                type="personal-incomes"
                onAddFinancialItem={() => toggleModal("personalIncomes", true)}
                onUpdateFinancialItem={(itemId, fieldKey, newValue) =>
                  handleUpdateItem(
                    "personalIncomes",
                    itemId,
                    fieldKey,
                    newValue
                  )
                }
                onDeleteFinancialItem={(item) =>
                  handleDeleteClick("personalIncomes", item)
                }
                onAnnualTotalChange={(annualTotal) =>
                  handleAnnualTotalChange("personalIncomes", annualTotal)
                }
              />
              <BalanceSection
                id="balance-today"
                title="Équilibre niveau de vie d'aujourd'hui"
                description="= Salaire annuel - frais annuels actuels"
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
                description="= Salaire annuel net envisagé - frais annuels actuels"
                balanceValue={personalBalanceTomorrow}
              />
            </div>
          </>
        )}
      </div>
      <AddFinancialItemModal
        type="personal-income"
        isOpen={modalState.personalIncomes}
        onClose={() => toggleModal("personalIncomes", false)}
        onSave={(item) => handleAddItemProcess("personalIncomes", item)}
      />
      <AddFinancialItemModal
        type="personal-expense"
        isOpen={modalState.personalExpenses}
        onClose={() => toggleModal("personalExpenses", false)}
        onSave={(item) => handleAddItemProcess("personalExpenses", item)}
      />
      <DeleteFinancialItemConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        itemName={
          itemToDelete && itemToDelete.item ? itemToDelete.item.name : ""
        }
      />
    </>
  );
}

export default PersonalFlowsPage;
