import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import colors from "../constants/colors";

const ExerciseList = ({
  exercises,
  selectedExercises,
  setSelectedExercises,
  searchQuery,
}) => {
  const toggleExerciseSelection = (exercise) => {
    if (selectedExercises[exercise.name]) {
      const updatedExercises = { ...selectedExercises };
      delete updatedExercises[exercise.name];
      setSelectedExercises(updatedExercises);
    } else {
      setSelectedExercises((prev) => ({
        ...prev,
        [exercise.name]: { series: 1, repetitions: 1 },
      }));
    }
  };
  const renderCategoryItem = ({ item }) => (
    <View style={styles.view}>
      <Text style={styles.categoryText}>{item.category}</Text>
      <FlatList
        data={item.exercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderExerciseItem}
        keyExtractor={(exercise) => exercise.name}
      />
    </View>
  );
  const handleSeriesChange = (exerciseName, change) => {
    setSelectedExercises((prev) => {
      const currentSeries = prev[exerciseName]?.series || 1;
      return {
        ...prev,
        [exerciseName]: {
          ...prev[exerciseName],
          series: Math.max(1, currentSeries + change),
        },
      };
    });
  };

  const handleRepetitionsChange = (exerciseName, change) => {
    setSelectedExercises((prev) => {
      const currentRepetitions = prev[exerciseName]?.repetitions || 1;
      return {
        ...prev,
        [exerciseName]: {
          ...prev[exerciseName],
          repetitions: Math.max(1, currentRepetitions + change),
        },
      };
    });
  };
  const renderExerciseItem = ({ item }) => {
    const isSelected = !!selectedExercises[item.name];
    return (
      <View style={styles.exerciseItem}>
        <TouchableOpacity
          onPress={() => toggleExerciseSelection(item)}
          style={[
            styles.exerciseButton,
            { backgroundColor: isSelected ? colors.primary : colors.secondary },
          ]}
        >
          <Text style={styles.exerciseText}>{item.name}</Text>
        </TouchableOpacity>
        {isSelected && (
          <View style={styles.inputContainer}>
            <Text style={styles.serText}>Series:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                testID="decrementSeries"
                onPress={() => handleSeriesChange(item.name, -1)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.input}>
                {selectedExercises[item.name]?.series}
              </Text>
              <TouchableOpacity
                style={styles.adjustButton}
                testID="incrementSeries"
                onPress={() => handleSeriesChange(item.name, 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.repText}>Repetitions:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                testID="decrementRepetitions"
                onPress={() => handleRepetitionsChange(item.name, -1)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.input}>
                {selectedExercises[item.name]?.repetitions}
              </Text>
              <TouchableOpacity
                style={styles.adjustButton}
                testID="incrementRepetitions"
                onPress={() => handleRepetitionsChange(item.name, 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };
  return (
    <FlatList
      data={exercises}
      renderItem={renderCategoryItem}
      keyExtractor={(item) => item.category}
      style={{ width: "100%" }}
    />
  );
};

export default ExerciseList;

const styles = StyleSheet.create({
  view: {
    marginVertical: 10,
  },
  exerciseItem: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
  },
  exerciseButton: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  exerciseText: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
  },
  serText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  adjustButton: {
    backgroundColor: colors.primary,
    width: 25,
    height: 25,
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 20,
  },
  input: {
    backgroundColor: colors.text,
    borderRadius: 10,
    padding: 5,
    width: 50,
    textAlign: "center",
  },
  categoryText: {
    color: colors.primary,
    fontFamily: "Poppins-Regular",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  repText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
});
