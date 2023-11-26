import React, { useCallback, useContext, useEffect } from "react";
import {
  Bubble,
  Day,
  GiftedChat,
  IMessage,
  Time,
} from "react-native-gifted-chat";
import { Route } from "@react-navigation/native";
import { SessionContext } from "../../context/SessionContext";
import { createNotification, sendMessage } from "../../api/api";
import { useGetMessages } from "../../hooks/use-messages";
import { LogBox, View } from "react-native";
import { locale } from "../../dayjsWithLocale";
import da from "dayjs/locale/da";
import { ChatParams } from "../../navigation/StackNavigator";

const Chat = ({
  route,
  navigation,
}: {
  route: Route<string, ChatParams>;
  navigation: any;
}) => {
  const { requestId, recipientProfile } = route.params;
  const { session } = useContext(SessionContext);
  const { messages, setMessages } = useGetMessages(requestId);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    sendMessage(requestId, messages[0].text, session?.user?.id!);
    createNotification(
      recipientProfile.id!,
      recipientProfile.first_name!,
      messages[0].text
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: recipientProfile.first_name,
    });
  }, []);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{
        left: {
          color: "black",
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "lightgrey",
        },
      }}
    />
  );

  const renderDay = (props: any) => {
    return <Day {...props} textStyle={{ color: "grey" }} />;
  };

  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: "black",
          },
        }}
      />
    );
  };

  LogBox.ignoreLogs([
    "Warning: Failed prop type: Invalid prop `locale` of type `object` supplied to `GiftedChat`",
  ]);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <GiftedChat
        messages={messages}
        locale={locale.substring(0, 2) === "da" ? da : undefined}
        renderBubble={renderBubble}
        renderDay={renderDay}
        renderTime={renderTime}
        renderAvatar={null}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: session?.user?.id!,
        }}
      />
    </View>
  );
};

export default Chat;
