export const handleAdminActivityInputChange = (e, setActivity) => {
    const { name, value } = e.target;
    setActivity((prevActivity) => ({
        ...prevActivity,
        [name]: value,
    }));
};

export const handleAdminActivityObjectiveChange = (index, value, setActivity) => {
    setActivity((prevActivity) => {
        const updatedObjectives = prevActivity.objectives.map((obj, i) =>
            i === index ? value : obj
        );
        return {
            ...prevActivity,
            objectives: updatedObjectives,
        };
    });
};

export const handleAdminActivityAddObjective = (setActivity) => {
    setActivity((prevActivity) => ({
        ...prevActivity,
        objectives: [...prevActivity.objectives, ""],
    }));
};

export const handleAdminActivityRemoveObjective = (index, setActivity) => {
    setActivity((prevActivity) => {
        const updatedObjectives = prevActivity.objectives.filter((_, i) => i !== index);
        return {
            ...prevActivity,
            objectives: updatedObjectives,
        };
    });
};

export const handleAdminActivitySaveActivity = async (activity, updateActivity, setToggleAdminActivity) => {
    const filteredObjectives = activity.objectives.filter(objective => objective.trim() !== "");

    const updatedActivity = {
        ...activity,
        objectives: filteredObjectives
    };

    const result = await updateActivity(activity);
    if (result?.success) {
        setToggleAdminActivity(false)
    } else {
        // handle error
    }
};
