const useUpdateFinancialItem = () => {
  const updateFinancialItem = async (item) => {
    try {
      const response = await fetch(`/financial-item/update/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Failed to update financial item');
      }
      return await response.json();
    } catch (err) {
      return `Erreur lors de l\'update du financial item : ${err.message}`;
    }
  };

  const formatFinancialItemForUpdate = (item, valuePath, value) => {
    const newItem = { ...item };

    // Si attributes est vide, on inalise avec valeurs defaut
    const validKeys = ["value_per_month", "sale_per_month", "manufacturing_cost"];
    const targetKey = valuePath.split(".")[1];
    if (validKeys.includes(targetKey) && newItem.attributes && !newItem.attributes[targetKey]) {
      console.log('newItem.attributes', targetKey);
      if (Array.isArray(newItem.attributes) && newItem.attributes.length === 0) {
        newItem.attributes = {};
      }

      switch (targetKey) {
        case "sale_per_month":
        case "manufacturing_cost":
          newItem.attributes["sale_per_month"] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            quantity: 100
          }));
          newItem.attributes["manufacturing_cost"] = newItem.attributes["manufacturing_cost"] ?? "00.00";
          break;
        case "value_per_month":
          newItem.attributes["value_per_month"] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            value: item.value
          }));
          break;
      }
    }

    if (valuePath.includes(".")) {
      const keys = valuePath.split(".");
      const lastKey = keys.pop();
      const lastObj = keys.reduce(
        (o, key) => (o[key] = o[key] || {}),
        newItem
      );
      lastObj[lastKey] = value;
    } else {
      newItem[valuePath] = value;
    }
    return newItem;
  }

  return { updateFinancialItem, formatFinancialItemForUpdate };
};

export default useUpdateFinancialItem;
