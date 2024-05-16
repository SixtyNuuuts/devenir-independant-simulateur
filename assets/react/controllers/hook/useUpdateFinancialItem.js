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
    const targetKey = valuePath.split(".")[1];

    if ((targetKey === "value_per_month" || targetKey === "sale_per_month") && newItem.attributes && !newItem.attributes.length) {
      newItem.attributes = {};
      newItem.attributes[targetKey] = Array.from({ length: 12 }, (_, i) => {
        return targetKey === "sale_per_month" ?
          { month: i + 1, quantity: 100 } :
          { month: i + 1, value: item.value };
      });
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
