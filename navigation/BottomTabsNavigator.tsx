import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import RequestsScreen from "../screens/RequestsScreen";
import MyPostsScreen from "../screens/MyPostsScreen";
import { useTranslation } from "react-i18next";
import PostsMapScreen from "../screens/PostsMapScreen";
import { SvgXml } from "react-native-svg";
import { tree, treeOutline } from "../assets/treeIcons";

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

const treeIconOptions = () => ({
  tabBarIcon: ({ focused }: { focused: boolean }) =>
    focused ? (
      <SvgXml xml={tree} width="70%" height="70%" />
    ) : (
      <SvgXml xml={treeOutline} width="70%" height="70%" />
    ),
});

const BottomTabsNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator initialRouteName="FindATree" screenOptions={screenOptions}>
      <Tab.Screen
        name="FindATree"
        component={HomeScreen}
        options={{ ...treeIconOptions(), title: t("btnFindATree") }}
      />
      <Tab.Screen
        name="Map"
        component={PostsMapScreen}
        options={{
          ...iconOptions("map-outline", "map"),
          title: t("btnMap"),
        }}
      />
      <Tab.Screen
        name="MyTrees"
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
          title: t("btnMyTrees"),
        })}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          ...iconOptions("chatbubbles-outline", "chatbubbles"),
          title: t("btnRequests"),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
