import React from "react";
import f from "../utils/function";

const BalanceSection = ({
  id,
  title,
  description,
  balanceValue,
  activitySlug,
  simulationToken,
}) => (
  <section aria-labelledby={id} className="balance-section">
    <div>
      <h2 className="balance-section-title" id={id}>
        {title}
      </h2>
      <p className="balance-section-description">{description}</p>
    </div>
    {activitySlug && simulationToken ? (
      <a
        className={`btn-primary btn-s btn-${f.getCssClassForValue(
          balanceValue
        )}`}
        href={`/${activitySlug}/profits/${simulationToken}`}
        aria-label={`Voir les détails de ${title}`}
      >
        {`${f.getSignForValue(balanceValue)} ${f.displayValue(
          Math.abs(balanceValue),
          "financial-value"
        )}`}
      </a>
    ) : (
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
    )}
  </section>
);

export default BalanceSection;
