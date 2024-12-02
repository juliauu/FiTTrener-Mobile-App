import { View, Text, Alert } from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import { Link } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import globalStyles from "../../constants/globalStyles";

const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
      return "Invalid login credentials. Please check your email and password.";
    case "auth/missing-email":
      return "Email cannot be empty.";
    case "auth/missing-username":
      return "Username cannot be empty.";
    case "auth/missing-password":
      return "Password cannot be empty.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

const SignUp = () => {
  const { signUp } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const accountCreated = await signUp(email, password, { username });
      if (accountCreated) {
        Alert.alert("Account created successfully");
      }
    } catch (error) {
      Alert.alert("Signup Error", getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.background}>
      <Text style={globalStyles.logo}>FitTrener</Text>
      <Text style={globalStyles.title}>Sign up</Text>
      <View style={globalStyles.container}>
        <FormField
          title="Email"
          testID="email"
          value={email}
          handleChangeText={setEmail}
          keyboardType="email-address"
        />
        <FormField
          testID="username"
          title="Username"
          value={username}
          handleChangeText={setUsername}
        />
        <FormField
          testID="password"
          title="Password"
          value={password}
          handleChangeText={setPassword}
        />

        <Button title="SIGN UP" handlePress={handleSignUp} />
        <Link href="/SignIn" style={globalStyles.text}>
          I already have an account
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
