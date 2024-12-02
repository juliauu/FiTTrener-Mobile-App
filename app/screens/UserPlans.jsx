import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import Button from "../../components/Button";
import { router } from "expo-router";
import globalStyles from "../../constants/globalStyles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { TouchableOpacity } from "react-native";
import colors from "../../constants/colors";

const UserPlans = ({ planType }) => {
  const { user } = useUser();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user ? user.uid : null;

  useEffect(() => {
    if (!userId) return;
    const fetchPlans = async () => {
      try {
        const plansCollectionRef = collection(db, "users", userId, planType);
        const querySnapshot = await getDocs(plansCollectionRef);
        const plansData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setPlans(plansData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, [userId, planType]);

  if (!user) {
    return <Text style={globalStyles.text}>User not logged in</Text>;
  }

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      {planType === "plans" && (
        <Text style={globalStyles.title}>Your workout plans</Text>
      )}
      {planType === "sharedPlans" && (
        <Text style={globalStyles.title}>Shared plans</Text>
      )}

      <View style={styles.scrollView}>
        <ScrollView>
          {loading ? (
            <Text style={globalStyles.text}>loading</Text>
          ) : plans.length === 0 ? (
            <Text style={globalStyles.text}>No workout plans found.</Text>
          ) : (
            plans.map((plan) => (
              <View key={plan.id} style={styles.planView}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: `/screens/PlanDetails`,
                      params: {
                        planId: plan.id,
                        planType: planType,
                      },
                    })
                  }
                >
                  <Text style={styles.planTitle}>{plan.name}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        {planType === "plans" && (
          <Button
            customStyles={styles.button}
            title="+"
            handlePress={() => router.push("/screens/CreatePlan")}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserPlans;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "76%",
  },
  planView: {
    backgroundColor: colors.primary,
    alignItems: "center",
    borderRadius: 10,
    height: 62,
    marginBottom: 14,
    marginLeft: 50,
    marginRight: 50,
    justifyContent: "center",
    textWrap: "wrap",
  },
  planTitle: {
    color: colors.text,
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    flexWrap: "wrap",
  },
  button: {
    height: 62,
    width: 62,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 31,
    alignSelf: "center",
  },
});
