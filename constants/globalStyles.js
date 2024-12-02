import { StyleSheet } from "react-native";
import colors from "./colors";
import { Platform } from "react-native";

const globalStyles = StyleSheet.create({
  logo: {
    color: colors.primary,
    fontFamily: "Poppins-Regular",
    fontSize: 50,
    marginTop: 20,
  },
  background: {
    backgroundColor: colors.background,
    height: "100%",
    alignItems: "center",
    paddingBottom: Platform.OS === "android" ? 40 : 0,
  },
  title: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 24,
    marginTop: Platform.OS === "android" ? 0 : 40,
    marginBottom: 15,
    textAlign: "center",
  },
  container: { width: "100%", alignItems: "center", height: "40%" },
  text: {
    color: colors.text,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginTop: 15,
    alignSelf: "center",
  },
});

export default globalStyles;
