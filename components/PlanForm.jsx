import React from "react";
import { Text, TextInput, SafeAreaView, StyleSheet, View } from "react-native";
import FormField from "./FormField";
import DropdownComponent from "./DropdownComponent";
import Button from "./Button";
import ExerciseList from "./ExerciseList";
import globalStyles from "../constants/globalStyles";
import colors from "../constants/colors";

const PlanForm = ({
  testID,
  mode,
  planName,
  setPlanName,
  planDay,
  setPlanDay,
  planMuscleGroup,
  setPlanMuscleGroup,
  selectedExercises,
  setSelectedExercises,
  exercises,
  searchQuery,
  setSearchQuery,
  setShowExercises,
  onSave,
  showExercises,
}) => {
  const isCreateMode = mode === "create";
  return (
    <SafeAreaView testID={testID} style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      {!showExercises ? (
        <>
          <Text style={globalStyles.title}>
            {isCreateMode ? "Create Plan" : "Edit Plan"}
          </Text>
          <View style={styles.container}>
            <FormField
              testID="planNameInput"
              title="Name:"
              value={planName}
              handleChangeText={setPlanName}
              customStyles={styles.formfield}
            />
            <DropdownComponent planDay={planDay} setPlanDay={setPlanDay} />
            <FormField
              testID="muscleGroupInput"
              title="Muscle group:"
              value={planMuscleGroup}
              handleChangeText={setPlanMuscleGroup}
              customStyles={styles.formfield}
            />
            <Button
              title={isCreateMode ? "Choose Exercises" : "Edit Exercises"}
              handlePress={() => setShowExercises(true)}
              customStyles={{ height: "15%" }}
            />
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises"
            placeholderTextColor={colors.text}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ExerciseList
            exercises={exercises}
            selectedExercises={selectedExercises}
            setSelectedExercises={setSelectedExercises}
            searchQuery={searchQuery}
          />
          <Button
            testID="saveButton"
            title={isCreateMode ? "Save Plan" : "Save Changes"}
            handlePress={onSave}
            customStyles={{ height: "8%" }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formfield: { height: "30%", marginTop: 10 },
  searchInput: {
    backgroundColor: colors.secondary,
    color: colors.text,
    padding: 15,
    marginTop: 25,
    marginBottom: 10,
    borderRadius: 10,
    width: "85%",
    alignSelf: "center",
  },
  container: { width: "100%", alignItems: "center", height: "50%" },
});

export default PlanForm;
