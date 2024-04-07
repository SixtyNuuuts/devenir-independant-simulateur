import React, { useState, useEffect } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";

function ProfitPage({ simulationId }) {
  const [professionalIncomes, setProfessionalIncomes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProfessionalIncomes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/financial-item/list/${simulationId}/professional/income`
        );
        const result = await response.json();
        setProfessionalIncomes(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    getProfessionalIncomes();
  }, [simulationId]);

  // const handleQuantityChange = async (itemId, month, newQuantity) => {
  // const handleCellValueChange = async (value, itemId, fieldId) => {
  // Logique pour envoyer la mise à jour à l'API et mettre à jour l'état parent
  // Exemple: updateProductAPI(itemId, {[fieldId]: value});
  // Assurez-vous de mettre à jour l'état dans ProfitPage pour refléter les changements
  // setProfessionalIncomes((currentIncomes) =>
  //     currentIncomes.map((item) =>
  //       item.id === itemId
  //         ? {
  //             ...item,
  //             attributes: {
  //               ...item.attributes,
  //               sale_per_month: item.attributes.sale_per_month.map((sale) =>
  //                 sale.month === month
  //                   ? { ...sale, quantity: parseInt(newQuantity, 10) }
  //                   : sale
  //               ),
  //             },
  //           }
  //         : item
  //     )
  //   );
  // };

  // const handleAddFinancialItem = async (newItem) => {
  //   // Ajout sur l'API
  //   // Exemple: await addFinancialItemAPI(newItem);
  //   setProfessionalIncomes((currentIncomes) => [...currentIncomes, newItem]);
  // };

  const onUpdateFinancialItem = (itemId, updatedFields) => {
    // Logique pour mettre à jour l'item via API puis mettre à jour l'état local
  };

  const onAddFinancialItem = (newItem) => {
    // Logique pour ajouter un nouvel item via API puis mettre à jour l'état local
  };

  const onDeleteFinancialItem = (itemId) => {
    // Logique pour supprimer l'item via API puis mettre à jour l'état local
  };

  return (
    <div className={loading ? "loading" : ""}>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <main>
          <h1>Profits</h1>
          <FinancialItemsTable
            financialItems={professionalIncomes}
            type="profits"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={onDeleteFinancialItem}
          />
          <FinancialItemsTable
            financialItems={professionalIncomes}
            type="products"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={onDeleteFinancialItem}
          />
        </main>
      )}
    </div>
  );
}

export default ProfitPage;
