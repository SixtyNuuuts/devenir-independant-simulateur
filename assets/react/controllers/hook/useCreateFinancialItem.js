const useCreateFinancialItem = () => {
  const createFinancialItem = async (item) => {
    try {
      const response = await fetch(`/financial-item/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Failed to create financial item');
      }
      return await response.json();
    } catch (err) {
      return `Erreur lors de la création du financial item : ${err.message}`;
    }
  };

  const formatFinancialItem = (item, simulationId, itemNature = "default", itemType = "default", quantityDefault = 50) => {
    return {
      simulation_id: simulationId,
      name: item.name,
      value: item.value,
      nature: itemNature,
      type: itemType,
      attributes: {
        sale_per_month: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          quantity: quantityDefault
        })),
        manufacturing_cost: item.manufacturing_cost
      }
    };
  };

  return { createFinancialItem, formatFinancialItem };
};

export default useCreateFinancialItem;
