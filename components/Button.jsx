import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const Button = ({ title, testID, handlePress, customStyles }) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.button, customStyles]}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF65A3",
    height: "23%",
    borderRadius: 10,
    justifyContent: "center",
    width: "85%",
    marginTop: "5%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Poppins-Medium",
  },
});
