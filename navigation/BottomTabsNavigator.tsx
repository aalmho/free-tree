import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessagesScreen";
import RequestsScreen from "../screens/RequestsScreen";
import MyPostsScreen from "../screens/MyPostsScreen";

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
  return (
    <Tab.Navigator initialRouteName="Find et træ" screenOptions={screenOptions}>
      <Tab.Screen
        name="Find et træ"
        component={HomeScreen}
        options={{
          ...iconOptions("home-outline", "home"),
        }}
      />
      <Tab.Screen
        name="Kø og beskeder"
        component={MessageScreen}
        options={{
          ...iconOptions("chatbox-outline", "chatbox"),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Mine træer"
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
        name="Requests"
        component={RequestsScreen}
        options={iconOptions("filter-outline", "filter")}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
