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
