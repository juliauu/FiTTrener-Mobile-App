import {
  Alert,
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useRoute } from "@react-navigation/native";
import { getDoc } from "firebase/firestore";
import { db, database } from "../../config/FirebaseConfig";
import { ref, get } from "firebase/database";
import globalStyles from "../../constants/globalStyles";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import colors from "../../constants/colors";
import { Modal } from "react-native-modals";
import { useUser } from "../../contexts/UserContext";
import { router } from "expo-router";
import { deleteDoc } from "firebase/firestore";

const PlanDetails = () => {
  const route = useRoute();
  const { planId, planType } = route.params || {};
  const { user } = useUser();
  const [plan, setPlan] = useState(null);
  const [shareWithUsername, setShareWithUsername] = useState("");
  const userId = user ? user.uid : null;
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const fetchPlanData = async () => {
      if (!planId || !userId) return;

      try {
        const planRef = doc(db, "users", userId, planType, planId);
        const planSnapshot = await getDoc(planRef);
        if (planSnapshot.exists()) {
          const planData = planSnapshot.data();
          const sortedExercises = Object.entries(planData.exercises || {})
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          setPlan({ id: planId, ...planData, exercises: sortedExercises });
        } else {
          console.error("Plan does not exist.");
        }
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchPlanData();
  }, [planId, userId]);

  if (!plan) {
    return <Text>Loading...</Text>;
  }

  const sharePlan = async () => {
    if (!shareWithUsername.trim()) {
      Alert.alert("Error", "Please enter a username to share the plan.");
      return;
    }

    try {
      const userIdSnapshot = await get(
        ref(database, `usernames/${shareWithUsername}`)
      );
      if (!userIdSnapshot.exists()) {
        Alert.alert(
          "User not found",
          "The username you entered does not exist."
        );
        return;
      }

      const userIdToShareWith = userIdSnapshot.val();

      if (userIdToShareWith === userId) {
        Alert.alert("You can't share your plan with yourself.");
        return;
      }

      const sharedPlansCollectionRef = collection(
        db,
        "users",
        userIdToShareWith,
        "sharedPlans"
      );
      const querySnapshot = await getDocs(sharedPlansCollectionRef);
      const existingPlanIds = querySnapshot.docs.map((doc) => doc.id);

      if (existingPlanIds.includes(plan.id)) {
        Alert.alert(
          "Already Shared",
          `Plan "${plan.name}" has already been shared with ${shareWithUsername}.`
        );
        return;
      }

      const sharedPlanRef = doc(sharedPlansCollectionRef, plan.id);
      const { id, ...planData } = plan;
      await setDoc(
        sharedPlanRef,
        {
          ...planData,
          sharedBy: user.username,
        },
        { merge: true }
      );

      Alert.alert(
        "Success",
        `Plan "${plan.name}" shared with ${shareWithUsername}!`
      );
      setShareWithUsername("");
    } catch (error) {
      console.error("Error sharing plan:", error);
      Alert.alert("Error", "An error occurred while sharing the plan.");
    }
  };

  const deletePlan = async () => {
    if (!planId || !userId) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const planRef = doc(db, "users", userId, planType, planId);
              await deleteDoc(planRef);
              Alert.alert("Plan deleted successfully.");
              router.push("/Plans");
            } catch (error) {
              console.error("Error deleting plan:", error);
              Alert.alert("Error", "Failed to delete the plan.");
            }
          },
        },
      ]
    );
  };

  if (!plan) {
    return (
      <SafeAreaView style={globalStyles.background}>
        <Text style={globalStyles.text}>Plan data is not available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      <Text style={globalStyles.title}>{plan.name}</Text>

      {plan.day && <Text style={styles.planData}> Day: {plan.day}</Text>}
      {plan.muscleGroup && (
        <Text style={styles.planData}>Muscle Group: {plan.muscleGroup}</Text>
      )}

      <View style={styles.view}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={styles.scrollView}
        >
          {plan.exercises && Object.keys(plan.exercises).length > 0 ? (
            Object.keys(plan.exercises).map((exerciseName, idx) => {
              const exercise = plan.exercises[exerciseName];
              return (
                <Text key={idx} style={styles.exercises}>
                  {exerciseName}: {exercise.series} x {exercise.repetitions}
                </Text>
              );
            })
          ) : (
            <Text style={globalStyles.text}>No exercises in this plan.</Text>
          )}
        </ScrollView>
      </View>

      {planType === "sharedPlans" && (
        <Text style={styles.shareText}>Shared by: {plan.sharedBy}</Text>
      )}

      <Modal visible={visible} onTouchOutside={hideModal}>
        <View style={styles.modal}>
          <TextInput
            placeholder="Enter username to share"
            placeholderTextColor={colors.text}
            style={styles.textInput}
            value={shareWithUsername}
            onChangeText={setShareWithUsername}
          />
          <Button
            testID="Share"
            title="Share"
            customStyles={styles.modalButton}
            handlePress={() => {
              sharePlan();
              setShareWithUsername("");
              hideModal();
            }}
          ></Button>
        </View>
      </Modal>
      {planType === "plans" && (
        <View style={styles.buttons}>
          <Button
            title="Share"
            testID="shareButton"
            handlePress={() => showModal()}
          />
          <Button
            customStyles={styles.editButton}
            title="Edit"
            handlePress={() =>
              router.push({
                pathname: "/screens/EditPlan",
                params: { planId, planType },
              })
            }
          />
          <Button
            customStyles={styles.removeButton}
            title="Remove"
            handlePress={deletePlan}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  planData: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    marginTop: 5,
    alignSelf: "center",
  },
  shareText: {
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginTop: 80,
  },
  exercises: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    marginTop: 6,
    marginBottom: 0,
    alignSelf: "center",
  },
  view: {
    height: "25%",
    marginTop: 25,
  },
  scrollView: { width: "100%", marginTop: 6 },
  textInput: {
    color: colors.text,
    backgroundColor: colors.secondary,
    fontFamily: "Poppins-Regular",
    height: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    textAlign: "center",
  },
  modal: {
    backgroundColor: colors.background,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    height: 170,
  },
  modalButton: {
    height: 40,
    width: 120,
    marginTop: 10,
    marginBottom: 10,
  },
  buttons: { width: "100%", alignItems: "center", height: "35%" },
  editButton: { marginTop: 12 },
  removeButton: { marginTop: 12, backgroundColor: "red" },
});
