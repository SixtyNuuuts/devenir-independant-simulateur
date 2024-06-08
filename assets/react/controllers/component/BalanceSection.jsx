import React from "react";
import f from "../utils/function";

const BalanceSection = ({ id, title, description, balanceValue }) => (
  <section aria-labelledby={id} className="balance-section">
    <h2 id={id}>{title}</h2>
    <p>{description}</p>
    <div className={f.getCssClassForValue(balanceValue)}>{`${f.getSignForValue(
      balanceValue
    )} ${f.displayValue(Math.abs(balanceValue), "financial-value")}`}</div>
  </section>
);

export default BalanceSection;
