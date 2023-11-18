import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Bubble,
  Day,
  GiftedChat,
  IMessage,
  Time,
} from "react-native-gifted-chat";
import { Route } from "@react-navigation/native";
import { SessionContext } from "../../context/SessionContext";
import { sendMessage } from "../../api/api";
import {
  useGetMessages,
  useMessagesByRequest,
  useSendMessage,
} from "../../hooks/use-messages";
import { View } from "react-native";
import da from "dayjs/locale/da";

const Chat = ({ route }: { route: Route<string, { requestId: number }> }) => {
  const { requestId } = route.params;
  const { session } = useContext(SessionContext);
  const { mutate } = useSendMessage();
  const { messages, setMessages } = useGetMessages(requestId);
  // const {
  //     data: messagesByRequestId
  //   } = useMessagesByRequest(requestId);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    sendMessage(requestId, messages[0].text, session?.user?.id!);

    // GiftedChat.append(messagesByRequestId, messages);
    // mutate({ requestId, content: messages[0].text, author: session?.user?.id! })
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

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <GiftedChat
        messages={messages}
        locale={da}
        renderBubble={renderBubble}
        renderDay={renderDay}
        renderTime={renderTime}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: session?.user?.id!,
        }}
      />
    </View>
  );
};

export default Chat;
