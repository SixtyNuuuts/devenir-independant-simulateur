import React, { useRef, useMemo, useCallback, useState } from "react";
import f from "../utils/function";

const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

const SalarySection = ({
  id,
  title,
  salaryInputLabel,
  initialMonthlySalary,
  annualPersonalExpenses,
  onUpdateSalary,
  activitySlug,
  simulationToken,
}) => {
  const [monthlySalary, setMonthlySalary] = useState(
    parseFloat(initialMonthlySalary) || 2600.0
  );

  const annualSalary = useMemo(
    () => f.calculateAnnualSalary(monthlySalary),
    [monthlySalary]
  );

  const balanceValue = useMemo(
    () => f.calculateLifeBalanceSalary(annualSalary, annualPersonalExpenses),
    [annualSalary]
  );

  const debouncedUpdateSalary = useDebouncedCallback(onUpdateSalary, 900);

  const handleChange = (e) => {
    setMonthlySalary(parseFloat(e.target.value));
  };

  const handleMouseUpOrTouchEnd = useCallback(
    (e) => {
      debouncedUpdateSalary(e.target.value);
    },
    [debouncedUpdateSalary]
  );

  const handleButtonClick = (increment) => {
    setMonthlySalary((prev) => {
      const newSalary = Math.min(Math.max(prev + increment, 0), 10000);
      debouncedUpdateSalary(newSalary);
      return newSalary;
    });
  };

  return (
    <section className="salary-section">
      <h2 className="salary-section-title" id={id}>
        {title}
      </h2>
      <div className="salary-input">
        <label>{salaryInputLabel}</label>
        <div className="mensual-salary">
          <a
            className="btn-primary btn-l btn-fv"
            href={`/${activitySlug}/niveau-de-vie/${simulationToken}#${
              id === "salary-current" ? "personal-incomes" : "salary-targets"
            }`}
            aria-label={`Modifier le salaire mensuel ${
              id === "salary-current" ? "actuel" : "cible"
            }`}
          >
            <span className="btn-financial-value">
              {f.displayValue(
                Math.abs(monthlySalary),
                "financial-value-rounded"
              )}
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
            <button
              onClick={() => handleButtonClick(-1)}
              aria-label="Retirer 1"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="9999"
              step="1"
              value={monthlySalary}
              onChange={handleChange}
              onMouseUp={handleMouseUpOrTouchEnd}
              onTouchEnd={handleMouseUpOrTouchEnd}
            />
            <button onClick={() => handleButtonClick(1)} aria-label="Ajouter 1">
              +
            </button>
          </div>
        </div>
        <div className="annual-salary">
          <span className="salary-info">net / an</span>
          <span>{f.displayValue(annualSalary, "financial-value")}</span>
        </div>
      </div>
      <div className="personal-expenses">
        <span>Mes frais personnels annuels actuels</span>
        <a
          className="btn-tertiary btn-s"
          href={`/${activitySlug}/niveau-de-vie/${simulationToken}`}
          aria-label="Voir les détails de mes frais personnels annuels actuels"
        >
          - {f.displayValue(annualPersonalExpenses, "financial-value")}
        </a>
      </div>
      <div className="personal-balance">
        <span>Mon équilibre de niveau de vie</span>
        <a
          className={`btn-primary btn-s btn-${f.getCssClassForValue(
            balanceValue
          )}`}
          href={`/${activitySlug}/niveau-de-vie/${simulationToken}`}
          aria-label="Voir les détails de mon équilibre de niveau de vie"
        >
          <span className="btn-financial-value">
            <span className="btn-icon">
              {f.getSignForValue(balanceValue) === "-" ? "👎" : "👍"}
            </span>
            {`${f.getSignForValue(balanceValue)} ${f.displayValue(
              Math.abs(balanceValue),
              "financial-value"
            )}`}
          </span>
        </a>
      </div>
    </section>
  );
};

export default SalarySection;
