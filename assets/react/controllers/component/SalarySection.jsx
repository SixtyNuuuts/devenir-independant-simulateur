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
      <h2 id={id}>{title}</h2>
      <div className="salary-input">
        <label>{salaryInputLabel}</label>
        <div className="salary-controls">
          <button onClick={() => handleButtonClick(-1)}>- 1</button>
          <input
            type="range"
            min="0"
            max="10000"
            step="1"
            value={monthlySalary}
            onChange={handleChange}
            onMouseUp={handleMouseUpOrTouchEnd}
            onTouchEnd={handleMouseUpOrTouchEnd}
          />
          <button onClick={() => handleButtonClick(1)}>+ 1</button>
        </div>
        <span>
          {f.displayValue(Math.abs(monthlySalary), "financial-value-rounded")}
          <span className="salary-devise">€</span>
          <span className="salary-info">net / mois</span>
        </span>
        <div className="annual-salary">
          <span className="salary-info">net / an</span>
          <span>{f.displayValue(annualSalary, "financial-value")}</span>
        </div>
      </div>
      <div className="personal-expenses">
        <span>Mes frais personnels annuels actuels</span>
        <span>
          - {f.displayValue(annualPersonalExpenses, "financial-value")}
        </span>
      </div>
      <div className={f.getCssClassForValue(balanceValue)}>
        <span>Mon équilibre de niveau de vie</span>
        <span>
          {`${f.getSignForValue(balanceValue)} ${f.displayValue(
            Math.abs(balanceValue),
            "financial-value"
          )}`}
        </span>
      </div>
    </section>
  );
};

export default SalarySection;
