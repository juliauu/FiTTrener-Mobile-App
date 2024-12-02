import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../constants/colors";

const DropdownComponent = ({ planDay, setPlanDay }) => {
  const dayData = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];

  return (
    <View style={{ width: "85%", height: "35%" }}>
      <Text style={styles.title}>Day:</Text>

      <View style={styles.view}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          inputSearchStyle={styles.inputSearch}
          itemTextStyle={styles.itemText}
          containerStyle={styles.container}
          iconStyle={styles.icon}
          data={dayData}
          labelField="label"
          valueField="value"
          placeholder="Select day"
          searchPlaceholder="Search day..."
          value={planDay}
          onChange={(item) => {
            setPlanDay(item.value);
          }}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 30,
    fontFamily: "Poppins-Regular",
    marginTop: 8,
    marginLeft: 20,
  },
  view: {
    backgroundColor: colors.secondary,
    marginTop: 8,
    borderRadius: 10,
    justifyContent: "center",
    height: "45%",
  },
  dropdown: {
    margin: 16,
  },
  placeholder: {
    fontSize: 16,
    color: colors.text,
    fontFamily: "Poppins-Regular",
    backgroundColor: colors.secondary,
    marginLeft: 8,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: colors.text,
    marginLeft: 8,
    backgroundColor: colors.secondary,
  },
  inputSearch: {
    height: 40,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: colors.secondary,
  },
  container: {
    backgroundColor: colors.text,
    borderRadius: 10,
  },
  icon: { width: 20, height: 20 },
});
