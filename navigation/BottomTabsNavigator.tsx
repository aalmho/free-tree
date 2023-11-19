import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import RequestsScreen from "../screens/RequestsScreen";
import MyPostsScreen from "../screens/MyPostsScreen";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarActiveTintColor: "green",
  tabBarInactiveTintColor: "green",
  headerShown: true,
};

// Using icons from https://ionic.io/ionicons. More fitting icons are needed. Check other libraries: https://icons.expo.fyi/Index
const iconOptions = (
  iconName: keyof typeof Ionicons.glyphMap,
  focusedIcon: keyof typeof Ionicons.glyphMap
) => ({
  tabBarIcon: ({
    color,
    size,
    focused,
  }: {
    color: string;
    size: number;
    focused: boolean;
  }) => (
    <Ionicons
      name={focused ? focusedIcon : iconName}
      color={color}
      size={size}
    />
  ),
});

const BottomTabsNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={t("btnFindATree")}
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name={t("btnFindATree")}
        component={HomeScreen}
        options={{
          ...iconOptions("home-outline", "home"),
        }}
      />
      <Tab.Screen
        name={t("btnMyTrees")}
        component={MyPostsScreen}
        options={({ navigation, route }) => ({
          ...iconOptions("person-outline", "person"),
          headerRight: () => (
            <Ionicons
              name="menu-outline"
              color="green"
              size={30}
              style={{ paddingRight: 10 }}
            />
          ),
        })}
      />
      <Tab.Screen
        name={t("btnRequests")}
        component={RequestsScreen}
        options={iconOptions("filter-outline", "filter")}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
