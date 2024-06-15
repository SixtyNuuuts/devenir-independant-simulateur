const useUpdateActivity = () => {
  const updateActivity = async (activity) => {
    try {
      const response = await fetch(`/activity/update/${activity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      return await response.json();
    } catch (err) {
      return `Erreur lors de l\'update de l'activité : ${err.message}`;
    }
  };

  return { updateActivity };
};

export default useUpdateActivity;
