import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native";
import { useState } from "react";
import colors from "../constants/colors";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  customStyles,
  testID,
  ...props
}) => {
  const [showPassword, setshowPassword] = useState(false);
  return (
    <View style={[styles.view, customStyles]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.formfield}>
        <TextInput
          testID={testID}
          style={styles.textinput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.text}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  view: { width: "90%", marginTop: 1, height: "40%" },
  title: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 30,
    fontFamily: "Poppins-Regular",
  },
  formfield: {
    backgroundColor: colors.secondary,
    height: "50%",
    margin: 8,
    borderRadius: 10,
    justifyContent: "center",
  },
  textinput: {
    flex: 1,
    marginLeft: 25,
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
});
