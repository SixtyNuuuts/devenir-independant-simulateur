import React from "react";

const BalanceSection = ({
  id,
  title,
  description,
  balanceClass,
  balanceValue,
}) => (
  <section aria-labelledby={id} className="balance-section">
    <h4 id={id}>{title}</h4>
    <p>{description}</p>
    <div className={balanceClass}>{balanceValue}</div>
  </section>
);

export default BalanceSection;
