import React, { useState } from "react";
import { Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "../../contexts/UserContext";
import { usePlanForm } from "../../hooks/usePlanForm";
import PlanForm from "../../components/PlanForm";
import { router } from "expo-router";

const CreatePlan = () => {
  const { user } = useUser();
  const userId = user ? user.uid : null;

  const [showExercises, setShowExercises] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    planName,
    setPlanName,
    planDay,
    setPlanDay,
    planMuscleGroup,
    setPlanMuscleGroup,
    selectedExercises,
    setSelectedExercises,
    exercises,
  } = usePlanForm({});

  const handleSave = async () => {
    try {
      if (Object.keys(selectedExercises).length > 0) {
        const plansCollectionRef = collection(db, "users", userId, "plans");
        await addDoc(plansCollectionRef, {
          name: planName,
          day: planDay,
          muscleGroup: planMuscleGroup,
          exercises: selectedExercises,
        });

        Alert.alert("Plan saved!");
        router.push("/Plans");
        setPlanName("");
        setPlanDay("");
        setPlanMuscleGroup("");
        setSelectedExercises({});
        setShowExercises(false);
      } else {
        Alert.alert(
          "No exercises selected",
          "Please select at least one exercise."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save the plan.");
    }
  };

  return (
    <PlanForm
      testID="planForm"
      mode="create"
      planName={planName}
      setPlanName={setPlanName}
      planDay={planDay}
      setPlanDay={setPlanDay}
      planMuscleGroup={planMuscleGroup}
      setPlanMuscleGroup={setPlanMuscleGroup}
      selectedExercises={selectedExercises}
      setSelectedExercises={setSelectedExercises}
      exercises={exercises}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showExercises={showExercises}
      setShowExercises={setShowExercises}
      onSave={handleSave}
    />
  );
};

export default CreatePlan;
