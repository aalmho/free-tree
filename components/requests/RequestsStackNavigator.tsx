import Chat from '../chat/Chat';
import { createStackNavigator } from '@react-navigation/stack';
import { RequestsPage } from '../../screens/RequestsPage';

type RequestsStackParamList = {
  RequestsPage: undefined,
    Chat: { chatId: number }; 
  };

const Stack = createStackNavigator<RequestsStackParamList>();

function RequestsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="RequestsPage" component={RequestsPage} options={{ title: 'Requests' }}/>
        <Stack.Screen name="Chat" component={Chat} options={{ title: 'Beskeder' }} />
      </Stack.Navigator>
    )
  }

export default RequestsStack;