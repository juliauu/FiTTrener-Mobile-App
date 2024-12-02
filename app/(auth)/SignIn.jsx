import { Text, Alert, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { useState } from "react";
import Button from "../../components/Button";
import { Link } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import globalStyles from "../../constants/globalStyles";

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid login credentials. Please check your email and password.";
    case "auth/missing-password":
      return "Password cannot be empty.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

const SignIn = () => {
  const { signIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      Alert.alert("Logged in successfully");
    } catch (error) {
      Alert.alert("Login Error", getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      <Text style={globalStyles.title}>Sign in</Text>
      <View style={globalStyles.container}>
        <FormField
          title="Email"
          testID="email"
          value={email}
          handleChangeText={setEmail}
          keyboardType="email-address"
        />
        <FormField
          title="Password"
          testID="password"
          value={password}
          handleChangeText={setPassword}
        />

        <Button title="SIGN IN" handlePress={handleSignIn} />
        <Link href="/SignUp" style={globalStyles.text}>
          I don't have an account
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
