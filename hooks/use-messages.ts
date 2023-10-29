import { useEffect, useState } from "react";
import { getMessages } from "../api/api";
import { IMessage } from "react-native-gifted-chat";

export const useGetMessages = (chatId: number) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  useEffect(() => {
    getMessages(chatId).then((value) => {
      setMessages(value);
    });
  }, []);
  return { messages, setMessages };
};
