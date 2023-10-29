import { useEffect, useState } from "react";
import { ChatCardProps, getChats } from "../api/api";

export const useGetChats = (userId: string) => {
  const [chatCards, setChatCards] = useState<ChatCardProps[]>([]);
  useEffect(() => {
    getChats(userId).then((value) => {
      setChatCards(value);
    });
  }, []);
  return { chatCards };
};
