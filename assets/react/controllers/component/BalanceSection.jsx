import React from "react";

const BalanceSection = ({
  id,
  title,
  description,
  balanceClass,
  balanceValue,
}) => (
  <section aria-labelledby={id} className="balance-section">
    <h2 id={id}>{title}</h2>
    <p>{description}</p>
    <div className={balanceClass}>{balanceValue}</div>
  </section>
);

export default BalanceSection;
