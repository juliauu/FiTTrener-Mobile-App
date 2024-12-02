import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import colors from "../../constants/colors";
import globalStyles from "../../constants/globalStyles";
import { useUser } from "../../contexts/UserContext";

const Profile = () => {
  const { user, logOut } = useUser();

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      <Text style={globalStyles.title}>Your profile</Text>
      <View style={globalStyles.container}>
        {user ? (
          <>
            <Text style={styles.username}>
              {user.username || "No username"}
            </Text>
            <Text style={styles.email}>{user.email || "No email"}</Text>
            <Button
              customStyles={{ marginTop: 0 }}
              title="SIGN OUT"
              handlePress={logOut}
            />
          </>
        ) : (
          <Text style={globalStyles.text}>No profile data available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  username: {
    color: colors.text,
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    marginTop: "10%",
  },
  email: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    marginTop: 15,
    marginBottom: "20%",
  },
});
