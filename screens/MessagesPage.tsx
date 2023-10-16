import Chat from '../components/chat/Chat';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesOverview from '../components/chat/MessagesOverview';

type MessagesStackParamList = {
    MessagesOverview: undefined,
    Chat: { chatId: number }; 
  };

const Stack = createStackNavigator<MessagesStackParamList>();

function MessagesStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MessagesOverview" component={MessagesOverview} options={{ title: 'Kø og beskeder' }}/>
        <Stack.Screen name="Chat" component={Chat} options={{ title: 'Beskeder' }} />
      </Stack.Navigator>
    )
  }

export default MessagesStack;