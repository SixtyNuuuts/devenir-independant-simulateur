const useDeleteFinancialItem = () => {
  const deleteFinancialItem = async (itemId) => {
    try {
      const response = await fetch(`/financial-item/delete/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to delete financial item');
      }
      return await response.json();
    } catch (err) {
      return `Erreur lors de la suppression du financial item: ${err.message}`;
    }
  };

  return { deleteFinancialItem };
};

export default useDeleteFinancialItem;
