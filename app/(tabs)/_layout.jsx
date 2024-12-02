import { StyleSheet, Text, View, Image } from "react-native";
import { Tabs } from "expo-router";
import plans from "../../assets/icons/plans.png";
import shared from "../../assets/icons/shared.png";
import camera from "../../assets/icons/camera.png";
import profile from "../../assets/icons/profile.png";
import colors from "../../constants/colors";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabView}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={styles.icon}
        testID={`${name}-icon`}
      />
      <Text
        style={[
          styles.iconName,
          { fontFamily: focused ? "Poppins-SemiBold" : "Poppins-Light" },
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="Plans"
          options={{
            title: "Plans",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={plans}
                color={color}
                name="Plans"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="SharedPlans"
          options={{
            title: "Shared plans",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={shared}
                color={color}
                name="Shared plans"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Camera"
          options={{
            title: "Camera",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={camera}
                color={color}
                name="Camera"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 25,
  },
  iconName: {
    fontSize: 12,
    color: colors.text,
  },
  tabView: {
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  tabBar: {
    backgroundColor: colors.background,
    height: 70,
    borderTopColor: colors.background,
    paddingTop: 10,
  },
});
