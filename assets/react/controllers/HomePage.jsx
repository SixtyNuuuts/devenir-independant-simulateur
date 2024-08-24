import React, { useState, useEffect, useMemo, useCallback } from "react";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useUpdateActivity from "./hook/useUpdateActivity";
import FinancialItemsTable from "./component/FinancialItemsTable";
import SalarySection from "./component/SalarySection";
import BalanceSection from "./component/BalanceSection";
import AdminActivityModeButton from "./component/Admin/Activity/AdminActivityModeButton";
import AdminActivityHeader from "./component/Admin/Activity/AdminActivityHeader";
import AdminActivityWysiwyg from "./component/Admin/Activity/AdminActivityWysiwyg";
import {
  handleAdminActivityInputChange,
  handleAdminActivityObjectiveChange,
  handleAdminActivityAddObjective,
  handleAdminActivityRemoveObjective,
  handleAdminActivitySaveActivity,
} from "./component/Admin/Activity/adminActivityHandlers";
import f from "./utils/function";
import classNames from "classnames";

function HomePage({
  simulationId,
  simulationToken,
  countActivities,
  activityData,
  isAdminActivityContext,
}) {
  const {
    financialItems: salaryCurrentData,
    isLoading: salaryCurrentLoading,
    error: salaryCurrentError,
  } = useGetFinancialItems("/salary/current", simulationId);
  const {
    financialItems: salaryTargetData,
    isLoading: salaryTargetLoading,
    error: salaryTargetError,
  } = useGetFinancialItems("/salary/target", simulationId);
  const {
    financialItems: personalExpensesData,
    isLoading: personalExpensesLoading,
    error: personalExpensesError,
  } = useGetFinancialItems("/personal/expense", simulationId);
  const {
    financialItems: professionalIncomesData,
    isLoading: professionalIncomesLoading,
    error: professionalIncomesError,
  } = useGetFinancialItems("/professional/income", simulationId);
  const {
    financialItems: professionalExpensesData,
    isLoading: professionalExpensesLoading,
    error: professionalExpensesError,
  } = useGetFinancialItems("/professional/expense", simulationId);

  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();
  const { updateActivity } = useUpdateActivity();

  const [isAdminActivity, setToggleAdminActivity] = useState(false);

  const [financialData, setFinancialData] = useState({
    salaryCurrent: [],
    salaryTarget: [],
    personalExpenses: [],
    professionalIncomes: [],
    professionalExpenses: [],
  });

  const [annualTotals, setAnnualTotals] = useState({
    professionalIncomes: "0.00",
    professionalExpenses: "0.00",
  });

  const [currentSalaryValue, setCurrentSalaryValue] = useState("2600.00");
  const [targetSalaryValue, setTargetSalaryValue] = useState("2000.00");

  const [activity, setActivity] = useState(JSON.parse(activityData));

  useEffect(() => {
    const newPath = `/${activity.slug}/${simulationToken}`;

    // Check if the current URL is different from the new one
    if (window.location.pathname !== newPath) {
      // Update the URL without reloading the page
      window.history.pushState(null, "", newPath);
    }
  }, [activity.slug, simulationToken]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      salaryCurrent: salaryCurrentData,
    }));
    setCurrentSalaryValue(
      salaryCurrentData.find(
        (i) => i.nature === "salary" && i.type === "current"
      )?.value
    );
  }, [salaryCurrentData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      salaryTarget: salaryTargetData,
    }));
    setTargetSalaryValue(
      salaryTargetData.find((i) => i.nature === "salary" && i.type === "target")
        ?.value
    );
  }, [salaryTargetData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      personalExpenses: personalExpensesData,
    }));
  }, [personalExpensesData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      professionalIncomes: professionalIncomesData,
    }));
  }, [professionalIncomesData]);

  useEffect(() => {
    setFinancialData((prevState) => ({
      ...prevState,
      professionalExpenses: professionalExpensesData,
    }));
  }, [professionalExpensesData]);

  const annualPersonalExpenses = useMemo(
    () => f.calculateAnnualTotalFinancialItems(financialData.personalExpenses),
    [financialData.personalExpenses]
  );

  const handleAnnualTotalChange = useCallback((type, annualTotal) => {
    setAnnualTotals((prevTotals) => ({
      ...prevTotals,
      [type]: annualTotal,
    }));
  }, []);

  const handleUpdateSalary = useCallback(
    async (type, newValue) => {
      const originalItem = financialData[type]?.find(
        (i) =>
          i.nature === "salary" &&
          i.type ===
            (type === "salaryCurrent"
              ? "current"
              : type === "salaryTarget"
              ? "target"
              : "")
      );
      const newItem = formatFinancialItemForUpdate(
        originalItem,
        "value",
        newValue
      );
      updateFinancialItem(newItem);
    },
    [financialData]
  );

  const handleUpdateTargetSalaryForUpdateProfitability = useCallback(
    (type, newValue) => {
      if (type === "salaryTarget") {
        const netSalary = parseFloat(newValue) || 0.0;
        const employeeContributionRate = 0.3; // 30% to calculate brut salary
        const employerContributionRate = 0.13; // 13% to calculate total cost

        const brutSalary = netSalary * employeeContributionRate + netSalary;
        const totalCompanyCost =
          brutSalary * employerContributionRate + brutSalary;

        const updatedProfessionalExpenses =
          financialData.professionalExpenses.map((expense) =>
            expense.id === "total-company-cost"
              ? { ...expense, value: totalCompanyCost }
              : expense
          );

        setFinancialData((prevState) => ({
          ...prevState,
          professionalExpenses: updatedProfessionalExpenses,
        }));
      }
    },
    [financialData]
  );

  const professionalBalanceFutureActivity = useMemo(() => {
    return annualTotals.professionalIncomes - annualTotals.professionalExpenses;
  }, [annualTotals]);

  return (
    <>
      {isAdminActivityContext && (
        <>
          <AdminActivityModeButton
            activity={activity}
            isAdminActivity={isAdminActivity}
            setToggleAdminActivity={setToggleAdminActivity}
            updateActivity={updateActivity}
            handleSaveActivity={handleAdminActivitySaveActivity}
            setActivity={setActivity}
          />
          {isAdminActivity && (
            <div className="admin-home">
              <label className="input">
                <input
                  type="text"
                  name="slug"
                  value={activity.slug}
                  className={classNames({
                    filled: activity.slug,
                  })}
                  onChange={(e) =>
                    handleAdminActivityInputChange(e, setActivity)
                  }
                />
                <span className="label">Slug</span>
              </label>
              <label className="input">
                <input
                  type="text"
                  name="goal"
                  value={activity.goal}
                  className={classNames({
                    filled: activity.goal,
                  })}
                  onChange={(e) =>
                    handleAdminActivityInputChange(e, setActivity)
                  }
                />
                <span className="label">Goal</span>
              </label>
            </div>
          )}
        </>
      )}
      <header>
        {isAdminActivity ? (
          <AdminActivityHeader
            activity={activity}
            handleInputChange={handleAdminActivityInputChange}
            handleAddObjective={handleAdminActivityAddObjective}
            handleObjectiveChange={handleAdminActivityObjectiveChange}
            handleRemoveObjective={handleAdminActivityRemoveObjective}
            setActivity={setActivity}
          />
        ) : (
          <>
            <div>
              <h1
                className="home-title"
                dangerouslySetInnerHTML={{ __html: activity.title }}
              ></h1>
              <ul className="home-objectives">
                {activity.objectives?.map((objective, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{ __html: objective }}
                  ></li>
                ))}
              </ul>
            </div>
            <figure>
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={activity.mobileImage}
                />
                <source
                  media="(min-width: 769px)"
                  srcSet={activity.desktopImage}
                />
                <img
                  src={activity.desktopImage}
                  alt={`Image de l'activité ${activity.name}`}
                  title={`Image de l'activité ${activity.name}`}
                />
              </picture>
            </figure>
          </>
        )}
      </header>
      <div className="home-main">
        <div className="home-main-header">
          <div className="home-main-header-salary">
            {salaryCurrentLoading ||
            salaryTargetLoading ||
            personalExpensesLoading ||
            currentSalaryValue === undefined ||
            targetSalaryValue === undefined ? (
              <>
                <section className="salary-section">
                  <h2 className="salary-section-title" id="salary-current">
                    Combien je gagne aujourd'hui ?
                  </h2>
                  <div className="salary-input">
                    <label>Quel est mon salaire net par mois</label>
                    <div className="mensual-salary">
                      <a
                        className="btn-primary btn-l btn-fv"
                        href="/pizzeria/niveau-de-vie/xFJyD2kE#personal-incomes"
                        aria-label="Modifier le salaire mensuel actuel"
                      >
                        <span className="btn-financial-value is-loading is-l-right is-l-95">
                          2 488
                        </span>
                        <span className="btn-financial-currency">€</span>
                        <span className="btn-financial-period">net / mois</span>
                        <span className="btn-arrow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 50"
                            width="50px"
                            height="50px"
                          >
                            <path
                              d="M36.8,23.2l-20-20c-0.5-0.5-1.1-0.8-1.8-0.8c-1,0-1.9,0.6-2.3,1.6c-0.4,0.9-0.2,2,0.6,2.7L31.5,25L13.2,43.2
                                      c-0.7,0.6-0.9,1.6-0.7,2.4c0.2,0.9,0.9,1.6,1.8,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.7,0,1.3-0.3,1.8-0.8l20-20
                                      C37.7,25.8,37.7,24.2,36.8,23.2z"
                            ></path>
                          </svg>
                        </span>
                      </a>
                      <div className="salary-controls">
                        <input
                          type="range"
                          min="0"
                          max="9999"
                          step="1"
                          defaultValue="2600"
                          aria-label="Indiquer le salaire mensuel actuel"
                        />
                      </div>
                    </div>
                    <div className="annual-salary">
                      <span className="salary-info">net / an</span>
                      <span className="is-loading is-l-right is-l-75">
                        29 856,00 €
                      </span>
                    </div>
                  </div>
                  <div className="personal-expenses">
                    <span>Mes frais personnels annuels actuels</span>
                    <a
                      className="btn-tertiary btn-s is-loading is-l-right is-l-75"
                      href="/pizzeria/niveau-de-vie/xFJyD2kE"
                      aria-label="Voir les détails de mes frais personnels annuels actuels"
                    >
                      - 26 985,24 €
                    </a>
                  </div>
                  <div className="personal-balance">
                    <span>Mon équilibre de niveau de vie</span>
                    <a
                      className="btn-primary btn-s is-loading is-l-80 is-l-www"
                      href="/pizzeria/niveau-de-vie/xFJyD2kE"
                      aria-label="Voir les détails de mon équilibre de niveau de vie"
                    >
                      <span className="btn-financial-value">
                        <span className="btn-icon">👍</span>+ 2 870,76 €
                      </span>
                    </a>
                  </div>
                </section>
                <section className="salary-section">
                  <h2 className="salary-section-title" id="salary-current">
                    Combien je veux gagner demain
                  </h2>
                  <div className="salary-input">
                    <label>
                      Ce que je vise comme rémunération avec ma future activité
                    </label>
                    <div className="mensual-salary">
                      <a
                        className="btn-primary btn-l btn-fv"
                        href="/pizzeria/niveau-de-vie/xFJyD2kE#personal-incomes"
                        aria-label="Modifier le salaire mensuel actuel"
                      >
                        <span className="btn-financial-value is-loading is-l-right is-l-95">
                          2 488
                        </span>
                        <span className="btn-financial-currency">€</span>
                        <span className="btn-financial-period">net / mois</span>
                        <span className="btn-arrow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 50"
                            width="50px"
                            height="50px"
                          >
                            <path
                              d="M36.8,23.2l-20-20c-0.5-0.5-1.1-0.8-1.8-0.8c-1,0-1.9,0.6-2.3,1.6c-0.4,0.9-0.2,2,0.6,2.7L31.5,25L13.2,43.2
                                      c-0.7,0.6-0.9,1.6-0.7,2.4c0.2,0.9,0.9,1.6,1.8,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.7,0,1.3-0.3,1.8-0.8l20-20
                                      C37.7,25.8,37.7,24.2,36.8,23.2z"
                            ></path>
                          </svg>
                        </span>
                      </a>
                      <div className="salary-controls">
                        <input
                          type="range"
                          min="0"
                          max="9999"
                          step="1"
                          defaultValue="2600"
                          aria-label="Indiquer le salaire mensuel souhaité"
                        />
                      </div>
                    </div>
                    <div className="annual-salary">
                      <span className="salary-info">net / an</span>
                      <span className="is-loading is-l-right is-l-75">
                        29 856,00 €
                      </span>
                    </div>
                  </div>
                  <div className="personal-expenses">
                    <span>Mes frais personnels annuels actuels</span>
                    <a
                      className="btn-tertiary btn-s is-loading is-l-right is-l-75"
                      href="/pizzeria/niveau-de-vie/xFJyD2kE"
                      aria-label="Voir les détails de mes frais personnels annuels actuels"
                    >
                      - 26 985,24 €
                    </a>
                  </div>
                  <div className="personal-balance">
                    <span>Mon équilibre de niveau de vie</span>
                    <a
                      className="btn-primary btn-s is-loading is-l-80 is-l-www"
                      href="/pizzeria/niveau-de-vie/xFJyD2kE"
                      aria-label="Voir les détails de mon équilibre de niveau de vie"
                    >
                      <span className="btn-financial-value">
                        <span className="btn-icon">👍</span>+ 2 870,76 €
                      </span>
                    </a>
                  </div>
                </section>
              </>
            ) : (
              <>
                <SalarySection
                  id="salary-current"
                  title="Combien je gagne aujourd'hui ?"
                  salaryInputLabel="Quel est mon salaire net par mois"
                  initialMonthlySalary={currentSalaryValue}
                  annualPersonalExpenses={annualPersonalExpenses}
                  onUpdateSalary={(newValue) =>
                    handleUpdateSalary("salaryCurrent", newValue)
                  }
                  onUpdateSalaryWithoutDebounce={(newValue) =>
                    handleUpdateTargetSalaryForUpdateProfitability(
                      "salaryCurrent",
                      newValue
                    )
                  }
                  activitySlug={activity.slug}
                  simulationToken={simulationToken}
                />
                <SalarySection
                  id="salary-target"
                  title="Combien je veux gagner demain"
                  salaryInputLabel="Ce que je vise comme rémunération avec ma future activité"
                  initialMonthlySalary={targetSalaryValue}
                  annualPersonalExpenses={annualPersonalExpenses}
                  onUpdateSalary={(newValue) =>
                    handleUpdateSalary("salaryTarget", newValue)
                  }
                  onUpdateSalaryWithoutDebounce={(newValue) =>
                    handleUpdateTargetSalaryForUpdateProfitability(
                      "salaryTarget",
                      newValue
                    )
                  }
                  activitySlug={activity.slug}
                  simulationToken={simulationToken}
                />
              </>
            )}
          </div>
          <section aria-labelledby="activity-profitability">
            {professionalIncomesLoading || professionalExpensesLoading ? (
              <>
                <h2 id="activity-profitability">
                  Rentabilité de ma future activité
                </h2>
                <p>
                  Quels produits et combien je projette d'en vendre par mois/ans
                </p>
                <a
                  className="btn-primary btn-xl is-loading is-l-80 is-l-www"
                  href="/pizzeria/profits/xFJyD2kE"
                  aria-label="Voir la rentabilité de l'activité Pizzéria"
                >
                  <span className="btn-financial-value">
                    <span className="btn-icon">👎</span>- 1 815 988
                  </span>
                  <span className="btn-financial-currency">€</span>
                  <span className="btn-financial-period">/ an</span>
                  <span className="btn-arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50 50"
                      width="50px"
                      height="50px"
                    >
                      <path
                        d="M36.8,23.2l-20-20c-0.5-0.5-1.1-0.8-1.8-0.8c-1,0-1.9,0.6-2.3,1.6c-0.4,0.9-0.2,2,0.6,2.7L31.5,25L13.2,43.2
                              c-0.7,0.6-0.9,1.6-0.7,2.4c0.2,0.9,0.9,1.6,1.8,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.7,0,1.3-0.3,1.8-0.8l20-20
                              C37.7,25.8,37.7,24.2,36.8,23.2z"
                      ></path>
                    </svg>
                  </span>
                </a>
                <section aria-labelledby="profits-view" className="table">
                  <p id="table-caption" className="table-caption"></p>
                  <table aria-labelledby="table-caption">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>janv.</th>
                        <th>févr.</th>
                        <th>mars</th>
                        <th>avr.</th>
                        <th>mai</th>
                        <th>juin</th>
                        <th>juil.</th>
                        <th>août</th>
                        <th>sept.</th>
                        <th>oct.</th>
                        <th>nov.</th>
                        <th>déc.</th>
                        <th>Total ANNUEL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="is-editable is-loading is-l-70">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Produit ou service n°1</h3>
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            50
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            65
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            70
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            82
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            90
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            100
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            110
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            120
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            130
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            140
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            150
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            160
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-50">1267</td>
                        <td>
                          <button
                            type="button"
                            aria-label="Supprimer Item"
                            className="btn-delete"
                          ></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="is-editable is-loading is-l-65">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Produit ou service n°2</h3>
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            40
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            50
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            60
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            70
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            80
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            90
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            100
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            110
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            120
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            130
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            140
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            150
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-50">1510</td>
                        <td>
                          <button
                            type="button"
                            aria-label="Supprimer Item"
                            className="btn-delete"
                          ></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="is-editable is-loading is-l-70">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Produit ou service n°3</h3>
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            30
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            40
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            50
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            60
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            70
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            80
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            90
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            100
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            110
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            120
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            130
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            140
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-50">1020</td>
                        <td>
                          <button
                            type="button"
                            aria-label="Supprimer Item"
                            className="btn-delete"
                          ></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="is-editable is-loading is-l-75">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Produit ou service n°4</h3>
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            20
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            30
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            40
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            50
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            60
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            70
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            80
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            90
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            100
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            110
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            120
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            130
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-50">780</td>
                        <td>
                          <button
                            type="button"
                            aria-label="Supprimer Item"
                            className="btn-delete"
                          ></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="is-editable is-loading is-l-60">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Produit ou service n°5</h3>
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            10
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            20
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            30
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            40
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            50
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            60
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            70
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            80
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            90
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            100
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-35">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            110
                          </span>
                        </td>
                        <td className="is-editable is-loading is-l-right is-l-30">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            120
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-50">690</td>
                        <td>
                          <button
                            type="button"
                            aria-label="Supprimer Item"
                            className="btn-delete"
                          ></button>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>CA HT</th>
                        <th className="is-loading is-l-right is-l-70">
                          1 300,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 680,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          1 960,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          2 310,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          2 620,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          2 950,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          3 280,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          3 610,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          3 940,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          8 340,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          4 600,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          4 930,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-80">
                          41 520,00 €
                        </th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                  <figure>
                    <figcaption id="profits-total-annual">
                      CA HT total Année 1
                    </figcaption>
                    <span
                      className="btn-secondary btn-s btn-cancel is-loading is-l-80"
                      aria-labelledby="profits-total-annual"
                    >
                      + 41 520,00 €
                    </span>
                  </figure>
                </section>
                <section aria-labelledby="charges-view" className="table">
                  <p id="table-caption" className="table-caption"></p>
                  <table aria-labelledby="table-caption">
                    <thead>
                      <tr>
                        <th>Intitulé</th>
                        <th>janv.</th>
                        <th>févr.</th>
                        <th>mars</th>
                        <th>avr.</th>
                        <th>mai</th>
                        <th>juin</th>
                        <th>juil.</th>
                        <th>août</th>
                        <th>sept.</th>
                        <th>oct.</th>
                        <th>nov.</th>
                        <th>déc.</th>
                        <th>Total ANNUEL</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="is-editable is-loading is-l-70">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Charge professionnelle n°1</h3>
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            999 999,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            999 999,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            300,00 €
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-70">
                          2 010 098,00 €
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <td className="is-editable is-loading is-l-75">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Charge professionnelle n°2</h3>
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            800,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            850,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            900,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            950,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 000,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 050,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 100,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 150,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 250,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 300,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 350,00 €
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-70">
                          12 950,00 €
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
                        <td className="is-editable is-loading is-l-70">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Charge professionnelle n°3</h3>
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            500,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            550,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            600,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            650,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            700,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            750,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            800,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            850,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            900,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            950,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 000,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            1 050,00 €
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-70">
                          10 350,00 €
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
                        <td className="is-editable is-loading is-l-75">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Charge professionnelle n°4</h3>
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            300,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            350,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            400,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            450,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            500,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            550,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            600,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            650,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            700,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            750,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            800,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            850,00 €
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-70">
                          6 600,00 €
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
                        <td className="is-editable is-loading is-l-70">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            <h3>Charge professionnelle n°5</h3>
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            200,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            250,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            300,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            350,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            400,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            450,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            500,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            550,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            600,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-55">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            650,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            700,00 €
                          </span>
                        </td>
                        <td className="editable is-loading is-l-right is-l-50">
                          <span tabIndex="0" role="button" aria-label="Edit">
                            750,00 €
                          </span>
                        </td>
                        <td className="is-loading is-l-right is-l-70">
                          5 950,00 €
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
                    <tfoot>
                      <tr>
                        <th>Sous total HT</th>
                        <th className="is-loading is-l-right is-l-70">
                          1 400,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 550,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          550,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 000 199,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 000 399,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          1 600,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 400,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          1 800,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          1 900,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-75">
                          1 400,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          2 000,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-70">
                          1 300,00 €
                        </th>
                        <th className="is-loading is-l-right is-l-80">
                          2 015 498,00 €
                        </th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                  <figure>
                    <figcaption id="charges-total-annual">
                      Charges totales Année 1
                    </figcaption>
                    <span
                      className="btn-secondary btn-s btn-cancel is-loading is-l-80"
                      aria-labelledby="charges-total-annual"
                    >
                      - 2 015 498,00 €
                    </span>
                  </figure>
                </section>
                <section
                  aria-labelledby="balance-future-activity"
                  className="balance-section"
                >
                  <div>
                    <h2
                      className="balance-section-title"
                      id="balance-future-activity"
                    ></h2>
                    <p className="balance-section-description">
                      Profits annuels - charges annuelles =
                    </p>
                  </div>
                  <a
                    className="btn-primary btn-s btn-danger is-loading is-l-80 is-l-www"
                    href="/pizzeria/profits/xFJyD2kE"
                    aria-label="Voir les détails de null"
                  >
                    - 1 815 988,00 €
                  </a>
                </section>
              </>
            ) : (
              <>
                <h2 id="activity-profitability">
                  Rentabilité de ma future activité
                </h2>
                <p>
                  Quels produits et combien je projette d'en vendre par mois/ans
                </p>
                <a
                  className={`btn-primary btn-xl btn-${f.getCssClassForValue(
                    professionalBalanceFutureActivity
                  )}`}
                  href={`/${activity.slug}/profits/${simulationToken}`}
                  aria-label={`Voir la rentabilité de l'activité ${activity.name}`}
                >
                  <span className="btn-financial-value">
                    <span className="btn-icon">
                      {f.getSignForValue(professionalBalanceFutureActivity) ===
                      "-"
                        ? "👎"
                        : "👍"}
                    </span>

                    {`${f.getSignForValue(
                      professionalBalanceFutureActivity
                    )} ${f.displayValue(
                      Math.abs(professionalBalanceFutureActivity),
                      "financial-value-rounded"
                    )}`}
                  </span>
                  <span className="btn-financial-currency">€</span>
                  <span className="btn-financial-period">/ an</span>
                  <span className="btn-arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50 50"
                      width="50px"
                      height="50px"
                    >
                      <path
                        d="M36.8,23.2l-20-20c-0.5-0.5-1.1-0.8-1.8-0.8c-1,0-1.9,0.6-2.3,1.6c-0.4,0.9-0.2,2,0.6,2.7L31.5,25L13.2,43.2
	c-0.7,0.6-0.9,1.6-0.7,2.4c0.2,0.9,0.9,1.6,1.8,1.8c0.2,0.1,0.4,0.1,0.6,0.1c0.7,0,1.3-0.3,1.8-0.8l20-20
	C37.7,25.8,37.7,24.2,36.8,23.2z"
                      ></path>
                    </svg>
                  </span>
                </a>
                <FinancialItemsTable
                  financialItems={financialData.professionalIncomes}
                  type="profits-view"
                  onAddFinancialItem={null}
                  onUpdateFinancialItem={null}
                  onDeleteFinancialItem={null}
                  onAnnualTotalChange={(annualTotal) =>
                    handleAnnualTotalChange("professionalIncomes", annualTotal)
                  }
                  activitySlug={activity.slug}
                  simulationToken={simulationToken}
                />
                <FinancialItemsTable
                  financialItems={financialData.professionalExpenses}
                  type="charges-view"
                  onAddFinancialItem={null}
                  onUpdateFinancialItem={null}
                  onDeleteFinancialItem={null}
                  onAnnualTotalChange={(annualTotal) =>
                    handleAnnualTotalChange("professionalExpenses", annualTotal)
                  }
                  activitySlug={activity.slug}
                  simulationToken={simulationToken}
                />
                <BalanceSection
                  id="balance-future-activity"
                  title={null}
                  description="Profits annuels - charges annuelles ="
                  balanceValue={professionalBalanceFutureActivity}
                  activitySlug={activity.slug}
                  simulationToken={simulationToken}
                />
              </>
            )}
          </section>
        </div>
        {isAdminActivity ? (
          <AdminActivityWysiwyg
            value={activity.description}
            onChange={(value) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
                description: value,
              }))
            }
            className="home-description admin-wysiwyg"
          />
        ) : (
          <section
            className="home-description"
            dangerouslySetInnerHTML={{ __html: activity.description }}
          ></section>
        )}
        {isAdminActivity ? (
          <AdminActivityWysiwyg
            value={activity.detailed_description}
            onChange={(value) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
                detailed_description: value,
              }))
            }
            className="home-detailed-description admin-wysiwyg"
          />
        ) : (
          <section
            className="home-detailed-description"
            dangerouslySetInnerHTML={{ __html: activity.detailed_description }}
          ></section>
        )}
        <section aria-labelledby="start-simulation">
          <a
            className="btn-primary btn-l"
            id="start-simulation"
            href={`/${activity.slug}/profits/${simulationToken}`}
            aria-label={`Commencer la simulation pour ${activity.name}`}
          >
            Commencer ma simulation
          </a>
          <ul>
            <li>Données préremplies pour {countActivities} métiers.</li>
            <li>
              Saisie facile de votre rémunération actuelle et charges
              mensuelles.
            </li>
            <li>
              Description détaillée des produits avec les coûts fixes associés.
            </li>
            <li>
              Tableau de type P&L (Profit and Loss) pour une vue d'ensemble de
              votre rentabilité potentielle.
            </li>
            <li>
              Ajustements instantanés pour visualiser l'impact des changements
              dans votre modèle d'entreprise.
            </li>
          </ul>
          <p>
            Avec <strong>krizalid</strong>, vous avez le pouvoir de prendre des
            décisions éclairées. Anticipez les défis financiers, comprenez les
            niveaux minimum de vente nécessaires et lancez votre entreprise en
            toute confiance.
          </p>
        </section>
      </div>
    </>
  );
}

export default HomePage;
