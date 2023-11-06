import {Ionicons} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage'
import MessagesPage from '../screens/MessagesPage';
import CreateTreePage from '../screens/CreateTreePage';
import RequestsStack from '../components/requests/RequestsStackNavigator';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarActiveTintColor: 'red',
    tabBarInactiveTintColor: 'green',
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
        <Tab.Screen name="Kø og beskeder" component={MessagesPage} options={{...iconOptions("chatbox-outline"), headerShown: false }} />
        <Tab.Screen name="Giv et træ" component={CreateTreePage} options={iconOptions("add-circle-outline")} />
        <Tab.Screen name="Requests" component={RequestsStack} options={{...iconOptions("filter"), headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
