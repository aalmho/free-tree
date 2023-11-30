import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { StackParamList } from "./StackNavigator";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { FC } from "react";

interface NavigationContainerComponentProps {
  children: JSX.Element;
}

const NavigationContainerComponent: FC<NavigationContainerComponentProps> = ({
  children,
}) => {
  const linking: LinkingOptions<StackParamList> = {
    prefixes: ["juletraet://"],
    config: {
      screens: {
        Home: {
          screens: {
            Requests: "requests",
          },
        },
      },
    },
    async getInitialURL() {
      const response = await Notifications.getLastNotificationResponseAsync();
      return response?.notification.request.content.data.url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url);
      const eventListenerSubscription = Linking.addEventListener(
        "url",
        onReceiveURL
      );
      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const url = response.notification.request.content.data.url;
          listener(url);
        });
      return () => {
        eventListenerSubscription.remove();
        subscription.remove();
      };
    },
  };

  return (
    <NavigationContainer linking={linking}>{children}</NavigationContainer>
  );
};

export default NavigationContainerComponent;
