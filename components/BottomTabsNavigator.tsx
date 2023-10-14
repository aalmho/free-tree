import {Ionicons} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Pages/HomePage'
import MessagesPage from './Pages/MessagesPage';
import CreateTreePage from './Pages/CreateTreePage';
import FilterPage from './Pages/FilterPage';
import AboutUsPage from './Pages/AboutUsPage';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'pink',
    headerShown: true,
}

// Using icons from https://ionic.io/ionicons. More fitting icons are needed. Check other libraries: https://icons.expo.fyi/Index
const iconOptions = (iconName: keyof typeof Ionicons.glyphMap) => ({
    tabBarIcon: ({ color, size }: { color: string, size: number }) => (
        <Ionicons name={iconName} color={color} size={size} />
    )
    });

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Hent et træ" screenOptions={screenOptions}>
        <Tab.Screen name="Hent et træ" component={HomePage} options={iconOptions("home")} />
        <Tab.Screen name="Kø og beskeder" component={MessagesPage} options={iconOptions("chatbox-outline")}/>
        <Tab.Screen name="Giv et træ" component={CreateTreePage} options={iconOptions("add-circle-outline")} />
        <Tab.Screen name="Om os" component={AboutUsPage} options={iconOptions("filter")}/>
        <Tab.Screen name="Filter" component={FilterPage} options={iconOptions("options-outline")}/>
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
