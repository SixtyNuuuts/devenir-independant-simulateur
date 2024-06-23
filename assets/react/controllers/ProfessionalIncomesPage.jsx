import React, { useState, useEffect, useCallback } from "react";
import FinancialItemsTable from "./component/FinancialItemsTable";
import AddFinancialItemModal from "./component/AddFinancialItemModal";
import useGetFinancialItems from "./hook/useGetFinancialItems";
import useCreateFinancialItem from "./hook/useCreateFinancialItem";
import useUpdateFinancialItem from "./hook/useUpdateFinancialItem";
import useDeleteFinancialItem from "./hook/useDeleteFinancialItem";
import f from "./utils/function";

function ProfessionalIncomesPage({ simulationId }) {
  const {
    financialItems: professionalIncomesData,
    isLoading: professionalIncomesLoading,
    error: professionalIncomesError,
  } = useGetFinancialItems("/professional/income", simulationId);

  const { createFinancialItem, formatFinancialItemForCreate } =
    useCreateFinancialItem();

  const { updateFinancialItem, formatFinancialItemForUpdate } =
    useUpdateFinancialItem();

  const { deleteFinancialItem } = useDeleteFinancialItem();

  const [professionalIncomes, setProfessionalIncomes] = useState([]);

  const [isModalAddProfessionalIncomeOpen, setModalAddProfessionalIncomeOpen] =
    useState(false);

  useEffect(() => {
    setProfessionalIncomes(professionalIncomesData);
  }, [professionalIncomesData]);

  const onAddFinancialItem = useCallback(() => {
    setModalAddProfessionalIncomeOpen(true);
  }, []);

  const onAddFinancialItemProcess = useCallback(async (item) => {
    const formattedItem = {
      name: f.formatValue(item.name, "text"),
      value: f.formatValue(item.value, "financial-value"),
      manufacturing_cost: f.formatValue(
        item.manufacturing_cost,
        "financial-value"
      ),
    };
    const newItem = formatFinancialItemForCreate(
      formattedItem,
      simulationId,
      "professional",
      "income"
    );
    const result = await createFinancialItem(newItem);
    if (result?.success && result.id) {
      setProfessionalIncomes((currentItems) => [
        ...currentItems,
        { ...newItem, id: result.id },
      ]);
    } else {
      // Gérer l'erreur
    }

    setModalAddProfessionalIncomeOpen(false);
  }, []);

  const onUpdateFinancialItem = useCallback(
    async (itemId, fieldKey, newValue) => {
      setProfessionalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isLoading: true } : item
        )
      );
      const originalItem = professionalIncomes.find(
        (item) => item.id === itemId
      );
      const newItem = formatFinancialItemForUpdate(
        originalItem,
        fieldKey,
        newValue
      );
      const result = await updateFinancialItem(newItem);
      if (result?.success) {
        setProfessionalIncomes((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId
              ? { ...item, ...newItem, isLoading: false }
              : item
          )
        );
      } else {
        setProfessionalIncomes((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId ? { ...item, isLoading: false } : item
          )
        );
      }
    },
    [professionalIncomes]
  );

  const onDeleteFinancialItem = useCallback(async (itemId) => {
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );
    const result = await deleteFinancialItem(itemId);
    if (result?.success) {
      setProfessionalIncomes((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId ? { ...item, isDeleting: true } : item
        )
      );
      setTimeout(() => {
        setProfessionalIncomes((currentItems) =>
          currentItems.filter((item) => item.id !== itemId)
        );
      }, 300);
    } else {
      // Gérer l'erreur
    }
    setProfessionalIncomes((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isLoading: false } : item
      )
    );
  }, []);

  return (
    <>
      {professionalIncomesLoading ? (
        <>
          <h1 className="title-1 hidden-mobile">Profits</h1>
          <section aria-labelledby="profits" className="table">
            <h2 className="table-title" id="profits">
              Profits par mois
            </h2>
            <p id="table-caption" className="table-caption">
              Combien je vais vendre de produits ou services par mois
            </p>
            <table aria-labelledby="table-caption">
              <thead>
                <tr>
                  <th>Produit</th>
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
                      <h3>Produit ou service n°1</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      50
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      65
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      70
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      82
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      90
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      100
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      110
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      120
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      130
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      140
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      150
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      160
                    </span>
                  </td>
                  <td className="is-loading is-l-right is-l-50">1267</td>
                  <td>
                    <button
                      type="button"
                      aria-label="Supprimer Item"
                      className="btn-delete"
                    ></button>
                  </td>
                </tr>
                <tr>
                  <td className="is-editable is-loading is-l-65">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      <h3>Produit ou service n°2</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      40
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      50
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      60
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      70
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      80
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      90
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      100
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      110
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      120
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      130
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      140
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      150
                    </span>
                  </td>
                  <td className="is-loading is-l-right is-l-50">1510</td>
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
                      <h3>Produit ou service n°3</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      30
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      40
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      50
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      60
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      70
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      80
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      90
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      100
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      110
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      120
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      130
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      140
                    </span>
                  </td>
                  <td className="is-loading is-l-right is-l-50">1020</td>
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
                      <h3>Produit ou service n°4</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      20
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      30
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      40
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      50
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      60
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      70
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      80
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      90
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      100
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      110
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      120
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      130
                    </span>
                  </td>
                  <td className="is-loading is-l-right is-l-50">780</td>
                  <td>
                    <button
                      type="button"
                      aria-label="Supprimer Item"
                      className="btn-delete"
                    ></button>
                  </td>
                </tr>
                <tr>
                  <td className="is-editable is-loading is-l-60">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      <h3>Produit ou service n°5</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      10
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      20
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      30
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      40
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      50
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      60
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      70
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      80
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      90
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      100
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      110
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      120
                    </span>
                  </td>
                  <td className="is-loading is-l-right is-l-50">690</td>
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
                  <th>CA HT</th>
                  <th className="is-loading is-l-right is-l-70">1 300,00 €</th>
                  <th className="is-loading is-l-right is-l-75">1 680,00 €</th>
                  <th className="is-loading is-l-right is-l-70">1 960,00 €</th>
                  <th className="is-loading is-l-right is-l-70">2 310,00 €</th>
                  <th className="is-loading is-l-right is-l-75">2 620,00 €</th>
                  <th className="is-loading is-l-right is-l-75">2 950,00 €</th>
                  <th className="is-loading is-l-right is-l-70">3 280,00 €</th>
                  <th className="is-loading is-l-right is-l-75">3 610,00 €</th>
                  <th className="is-loading is-l-right is-l-70">3 940,00 €</th>
                  <th className="is-loading is-l-right is-l-75">8 340,00 €</th>
                  <th className="is-loading is-l-right is-l-70">4 600,00 €</th>
                  <th className="is-loading is-l-right is-l-75">4 930,00 €</th>
                  <th className="is-loading is-l-right is-l-80">41 520,00 €</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
            <figure>
              <figcaption id="profits-total-annual">
                CA HT total Année 1
              </figcaption>
              <span
                className="btn-secondary btn-s btn-cancel is-loading is-l-80"
                aria-labelledby="profits-total-annual"
              >
                + 41 520,00 €
              </span>
            </figure>
          </section>
          <section aria-labelledby="products" className="table">
            <h2 className="table-title" id="products">
              Prix de mes produits
            </h2>
            <p id="table-caption" className="table-caption">
              À quel prix vais-je vendre chacun de ces produits ou services ?
            </p>
            <table aria-labelledby="table-caption">
              <thead>
                <tr>
                  <th>Intitulé</th>
                  <th>Coût unitaire*</th>
                  <th>Prix de vente HT</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="is-editable is-loading is-l-65">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      <h3>Produit ou service n°1</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      4,00 €
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      10,00 €
                    </span>
                  </td>
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
                      <h3>Produit ou service n°2</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      5,00 €
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      11,00 €
                    </span>
                  </td>
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
                      <h3>Produit ou service n°3</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      6,00 €
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      12,00 €
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label="Supprimer Item"
                      className="btn-delete"
                    ></button>
                  </td>
                </tr>
                <tr>
                  <td className="is-editable is-loading is-l-60">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      <h3>Produit ou service n°4</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      7,00 €
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      13,00 €
                    </span>
                  </td>
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
                      <h3>Produit ou service n°5</h3>
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-30">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      8,00 €
                    </span>
                  </td>
                  <td className="is-editable is-loading is-l-right is-l-35">
                    <span tabIndex="0" role="button" aria-label="Edit">
                      14,00 €
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      aria-label="Supprimer Item"
                      className="btn-delete"
                    ></button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="complementary" role="complementary">
              <p
                className="asterisk-legend-text"
                aria-label="Explication de l'astérisque"
              >
                * Facultatif :
                <br />
                Précisez ici le montant HT coutant la réalisation de ce produit
                ou service
              </p>
              <button aria-label="Ajouter Item" className="btn-tertiary btn-s">
                + ajouter
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <h1 className="title-1 hidden-mobile">Profits</h1>
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
          <AddFinancialItemModal
            type="product"
            isOpen={isModalAddProfessionalIncomeOpen}
            onClose={() => setModalAddProfessionalIncomeOpen(false)}
            onSave={onAddFinancialItemProcess}
          />
        </>
      )}
    </>
  );
}

export default ProfessionalIncomesPage;
