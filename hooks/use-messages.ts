import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { getMessages, sendMessage } from "../api/api";
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

// export const useMessagesByRequest = (requestId: number) => {
//   const queryKey: QueryKey = ["messagesByRequest", requestId];
//   return useQuery({
//     queryKey,
//     queryFn: async () => {
//       const messagesByRequestId = await getMessages(requestId);
//       return messagesByRequestId;
//     },
//   });
// };

// export const useSendMessage = () => {
//   const queryClient = useQueryClient();
//   const mutate = useMutation({
//     mutationFn: async (args: {
//       requestId: number;
//       content: string;
//       author: string;
//     }) => {
//       return sendMessage(args.requestId, args.content, args.author);
//     },
//     onSuccess: async (data, variables) => {
//       const queryKey: QueryKey = ["messagesByRequest", variables.requestId];
//       return queryClient.invalidateQueries({ queryKey });
//     },
//   });
//   return mutate;
// };
