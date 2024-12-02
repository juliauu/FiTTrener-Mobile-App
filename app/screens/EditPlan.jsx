import React, { useState } from "react";
import { Alert } from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "../../contexts/UserContext";
import { usePlanForm } from "../../hooks/usePlanForm";
import PlanForm from "../../components/PlanForm";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";

const EditPlan = () => {
  const route = useRoute();
  const { planId, planType } = route.params || {};
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

  React.useEffect(() => {
    const loadPlan = async () => {
      if (planId && userId) {
        const planRef = doc(db, "users", userId, planType, planId);
        const snapshot = await getDoc(planRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPlanName(data.name);
          setPlanDay(data.day);
          setPlanMuscleGroup(data.muscleGroup);
          setSelectedExercises(data.exercises || {});
        }
      }
    };
    loadPlan();
  }, [planId, userId, planType]);

  const handleSave = async () => {
    try {
      if (Object.keys(selectedExercises).length > 0) {
        const planRef = doc(db, "users", userId, planType, planId);
        await setDoc(planRef, {
          name: planName,
          day: planDay,
          muscleGroup: planMuscleGroup,
          exercises: selectedExercises,
        });
        router.push("/Plans");
        Alert.alert("Plan updated!");
        setShowExercises(false);
      } else {
        Alert.alert(
          "No exercises selected",
          "Please select at least one exercise."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update the plan.");
    }
  };

  return (
    <PlanForm
      testID="planForm"
      mode="edit"
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

export default EditPlan;
