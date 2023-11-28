import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { getFirstName, getMessages, sendMessage } from "../api/api";
import { IMessage } from "react-native-gifted-chat";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetMessages = (requestId: number) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const getAndSetMessages = () =>
    getMessages(requestId).then((value) => {
      setMessages(value);
    });
  useEffect(() => {
    getAndSetMessages();
    const messageChannel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          getAndSetMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, []);
  return { messages, setMessages };
};

export const useGetFirstName = (userId: string) => {
    const [firstName, setFirstName] = useState<string>('');
    useEffect(() => {
      getFirstName(userId).then((value) => {
        setFirstName(value);
      });
    }, []);
    return firstName;
}