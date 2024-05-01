import { useState, useEffect } from 'react';

const useGetFinancialItems = (financialItemsPath, simulationId) => {
  const [financialItems, setFinancialItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/financial-item/list/${simulationId}${financialItemsPath}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFinancialItems(data);
      } catch (err) {
        setError(`Erreur lors de la récupération des financial items : ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialItems();
  }, [simulationId, financialItemsPath]);

  return { financialItems, isLoading, error };
};

export default useGetFinancialItems;
