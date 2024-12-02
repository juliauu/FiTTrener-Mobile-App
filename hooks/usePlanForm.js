import { useState, useEffect } from "react";
import { fetchExercises } from "../services/exerciseService";

export const usePlanForm = (initialValues) => {
  const [planName, setPlanName] = useState(initialValues.name || "");
  const [planDay, setPlanDay] = useState(initialValues.day || "");
  const [planMuscleGroup, setPlanMuscleGroup] = useState(
    initialValues.muscleGroup || ""
  );
  const [selectedExercises, setSelectedExercises] = useState(
    initialValues.exercises || {}
  );
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const exercisesData = await fetchExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  return {
    planName,
    setPlanName,
    planDay,
    setPlanDay,
    planMuscleGroup,
    setPlanMuscleGroup,
    selectedExercises,
    setSelectedExercises,
    exercises,
    loading,
  };
};
