import React, { useState, useEffect, useCallback } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import DeleteFinancialItemConfirmationModal from "./component/DeleteFinancialItemConfirmationModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";
import f from "./utils/function";

function ProfessionalExpensesPage({
  simulationId,
  simulationToken,
  activityData,
}) {
  const {
    financialItems: professionalExpensesData,
    isLoading: professionalExpensesLoading,
    error: professionalExpensesError,
  } = useGetFinancialItems("/professional/expense", simulationId);

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();

  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();

  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [professionalExpenses, setProfessionalExpenses] = useState([]);

  const [
    isModalAddProfessionalExpenseOpen,
    setModalAddProfessionalExpenseOpen,
  ] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const newPath = `/${
      JSON.parse(activityData).slug
    }/charges/${simulationToken}`;

    // Check if the current URL is different from the new one
    if (window.location.pathname !== newPath) {
      // Update the URL without reloading the page
      window.history.pushState(null, "", newPath);
    }
  }, [activityData, simulationToken]);

  useEffect(() => {
    setProfessionalExpenses(professionalExpensesData);
  }, [professionalExpensesData]);

  const onAddFinancialItem = useCallback(() => {
    setModalAddProfessionalExpenseOpen(true);
  }, []);

  const onAddFinancialItemProcess = useCallback(async (item) => {
    const formattedItem = {
      name: f.formatValue(item.name, "text"),
      value: f.formatValue(item.value, "financial-value"),
    };
    const newItem = formatFinancialItemForCreate(
      formattedItem,
      simulationId,
      "professional",
      "expense"
    );
    const result = await createFinancialItem(newItem);
    if (result?.success && result.id) {
      setProfessionalExpenses((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
      // setProfessionalExpenses((currentItems) => {
      //   const salaryItemIndex = currentItems.findIndex(
      //     (item) => item.nature === "salary"
      //   );

      //   if (salaryItemIndex === -1) {
      //     return [...currentItems, { ...newItem, id: currentItems.length + 1 }];
      //   }

      //   return [
      //     ...currentItems.slice(0, salaryItemIndex),
      //     { ...newItem, id: currentItems.length + 1 },
      //     ...currentItems.slice(salaryItemIndex),
      //   ];
      // });
    } else {
      // Gérer l'erreur
    }

    setModalAddProfessionalExpenseOpen(false);
  }, []);

  const onUpdateFinancialItem = useCallback(
    async (itemId, fieldKey, newValue) => {
      setProfessionalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: true } : item
        )
      );
      const originalItem = professionalExpenses.find(
        (item) => item.id === itemId
      );
      const newItem = formatFinancialItemForUpdate(
        originalItem,
        fieldKey,
        newValue
      );
      const result = await updateFinancialItem(newItem);
      if (result?.success) {
        setProfessionalExpenses((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId
              ? { ...item, ...newItem, isLoading: false }
              : item
          )
        );
      } else {
        setProfessionalExpenses((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId ? { ...item, isLoading: false } : item
          )
        );
      }
    },
    [professionalExpenses]
  );

  const onDeleteFinancialItem = useCallback(async (itemId) => {
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result?.success) {
      setProfessionalExpenses((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isDeleting: true } : item
        )
      );
      setTimeout(() => {
        setProfessionalExpenses((currentItems) =>
          currentItems.filter((item) => item.id !== itemId)
        );
      }, 300);
    } else {
      // Gérer l'erreur
    }
    setProfessionalExpenses((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  }, []);

  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (itemToDelete) {
      await onDeleteFinancialItem(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, onDeleteFinancialItem]);

  return (
    <>
      {professionalExpensesLoading ? (
        <>
          <h1 className="title-1 hidden-mobile">Charges</h1>
          <section aria-labelledby="charges" className="table">
            <h2 className="table-title" id="charges">
              Charges par mois
            </h2>
            <p id="table-caption" className="table-caption">
              Combien je vais dépenser par poste et par mois pour mon activité
            </p>
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
                  <td className="is-loading is-l-right is-l-70">12 950,00 €</td>
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
                  <td className="is-loading is-l-right is-l-70">10 350,00 €</td>
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
                  <td className="is-loading is-l-right is-l-70">6 600,00 €</td>
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
                  <td className="is-loading is-l-right is-l-70">5 950,00 €</td>
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
                  <th className="is-loading is-l-right is-l-70">1 400,00 €</th>
                  <th className="is-loading is-l-right is-l-75">1 550,00 €</th>
                  <th className="is-loading is-l-right is-l-70">550,00 €</th>
                  <th className="is-loading is-l-right is-l-75">
                    1 000 199,00 €
                  </th>
                  <th className="is-loading is-l-right is-l-75">
                    1 000 399,00 €
                  </th>
                  <th className="is-loading is-l-right is-l-70">1 600,00 €</th>
                  <th className="is-loading is-l-right is-l-75">1 400,00 €</th>
                  <th className="is-loading is-l-right is-l-70">1 800,00 €</th>
                  <th className="is-loading is-l-right is-l-70">1 900,00 €</th>
                  <th className="is-loading is-l-right is-l-75">1 400,00 €</th>
                  <th className="is-loading is-l-right is-l-70">2 000,00 €</th>
                  <th className="is-loading is-l-right is-l-70">1 300,00 €</th>
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
            <div className="complementary" role="complementary">
              <button aria-label="Ajouter Item" className="btn-tertiary btn-s">
                + ajouter
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <h1 className="title-1 hidden-mobile">Charges</h1>
          <FinancialItemsTable
            financialItems={professionalExpenses}
            type="charges"
            onAddFinancialItem={onAddFinancialItem}
            onUpdateFinancialItem={onUpdateFinancialItem}
            onDeleteFinancialItem={handleDeleteClick}
          />
          <AddFinancialItemModal
            type="charge"
            isOpen={isModalAddProfessionalExpenseOpen}
            onClose={() => setModalAddProfessionalExpenseOpen(false)}
            onSave={onAddFinancialItemProcess}
          />
          <DeleteFinancialItemConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={handleDeleteConfirm}
            itemName={itemToDelete ? itemToDelete.name : ""}
          />
        </>
      )}
    </>
  );
}

export default ProfessionalExpensesPage;
