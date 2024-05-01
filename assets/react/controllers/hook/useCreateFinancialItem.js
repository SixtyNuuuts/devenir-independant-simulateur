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

  return { createFinancialItem };
};

export default useCreateFinancialItem;
