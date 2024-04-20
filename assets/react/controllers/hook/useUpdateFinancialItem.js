import { useState } from 'react';

const useUpdateFinancialItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFinancialItem = async (item) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/financial-item/update/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Failed to update financial item');
      }
      return response.json();
    } catch (err) {
      setError('Erreur lors de l\'update des données : ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateFinancialItem, isLoading, error };
};

export default useUpdateFinancialItem;
