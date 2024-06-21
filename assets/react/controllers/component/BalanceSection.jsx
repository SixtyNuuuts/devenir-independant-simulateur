import React from "react";
import f from "../utils/function";

const BalanceSection = ({ id, title, description, balanceValue }) => (
  <section aria-labelledby={id} className="balance-section">
    <div>
      <h2 className="balance-section-title" id={id}>
        {title}
      </h2>
      <p className="balance-section-description">{description}</p>
    </div>
    <span
      className={`btn-primary btn-s btn-${f.getCssClassForValue(
        balanceValue
      )} btn-cancel`}
    >
      {`${f.getSignForValue(balanceValue)} ${f.displayValue(
        Math.abs(balanceValue),
        "financial-value"
      )}`}
    </span>
  </section>
);

export default BalanceSection;
