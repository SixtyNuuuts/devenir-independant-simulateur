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

function HomePage({
  simulationId,
  simulationToken,
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

  const professionalBalanceFutureActivity = useMemo(() => {
    return annualTotals.professionalIncomes - annualTotals.professionalExpenses;
  }, [annualTotals]);

  if (
    salaryCurrentLoading ||
    salaryTargetLoading ||
    personalExpensesLoading ||
    professionalIncomesLoading ||
    professionalExpensesLoading ||
    currentSalaryValue === undefined ||
    targetSalaryValue === undefined
  ) {
    return (
      <>
        <div>Chargement des données en cours...</div>
      </>
    );
  }

  if (
    salaryCurrentError ||
    salaryTargetError ||
    personalExpensesError ||
    professionalIncomesError ||
    professionalExpensesError
  ) {
    return <div>Une erreur est survenue lors du chargement des données.</div>;
  }

  return (
    <>
      {isAdminActivityContext && (
        <AdminActivityModeButton
          activity={activity}
          isAdminActivity={isAdminActivity}
          setToggleAdminActivity={setToggleAdminActivity}
          updateActivity={updateActivity}
          handleSaveActivity={handleAdminActivitySaveActivity}
        />
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
              <h1 className="home-title">{activity.title}</h1>
              <ul className="home-objectives">
                {activity.objectives?.map((objective, index) => (
                  <li key={index}>{objective}</li>
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
            <SalarySection
              id="salary-current"
              title="Combien je gagne aujourd'hui ?"
              salaryInputLabel="Quel est mon salaire net par mois"
              initialMonthlySalary={currentSalaryValue}
              annualPersonalExpenses={annualPersonalExpenses}
              onUpdateSalary={(newValue) =>
                handleUpdateSalary("salaryCurrent", newValue)
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
              activitySlug={activity.slug}
              simulationToken={simulationToken}
            />
          </div>
          <section aria-labelledby="activity-profitability">
            <h2 id="activity-profitability">
              Rentabilité de ma future activité
            </h2>
            <p>
              Quels produits et combien je projette d'en vendre par mois/ans
            </p>
            <a
              className={`btn-primary btn-xl btn-${f.getCssClassForValue(
                professionalBalanceFutureActivity
              )} btn-cancel`}
              href={`/${activity.slug}/profits/${simulationToken}`}
            >
              <span className="btn-financial-value">
                <span className="btn-icon">
                  {" "}
                  {f.getSignForValue(professionalBalanceFutureActivity) === "-"
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
                  ></path>{" "}
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
          />
        ) : (
          <section
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
          />
        ) : (
          <section
            dangerouslySetInnerHTML={{ __html: activity.detailed_description }}
          ></section>
        )}
        <section aria-labelledby="start-simulation">
          <a id="start-simulation" href="">
            Commencer ma simulation
          </a>
          <ol>
            <li>
              <p>Données préremplies pour 5 métiers.</p>
            </li>
            <li>
              <p>
                Saisie facile de votre rémunération actuelle et charges
                mensuelles.
              </p>
            </li>
            <li>
              <p>
                Description détaillée des produits avec les coûts fixes
                associés.
              </p>
            </li>
            <li>
              <p>
                Tableau de type P&L (Profit and Loss) pour une vue d'ensemble de
                votre rentabilité potentielle.
              </p>
            </li>
            <li>
              <p>
                Ajustements instantanés pour visualiser l'impact des changements
                dans votre modèle d'entreprise.
              </p>
            </li>
          </ol>
          <p>
            Avec krizalid, vous avez le pouvoir de prendre des décisions
            éclairées. Anticipez les défis financiers, comprenez les niveaux
            minimum de vente nécessaires et lancez votre entreprise en toute
            confiance.
          </p>
        </section>
      </div>
    </>
  );
}

export default HomePage;
