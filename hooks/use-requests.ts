import { useEffect, useState } from "react";
import { PostRequest, getPostRequests } from "../api/api";

export const useGetPostRequests = (userId: string) => {
  const [postRequests, setPostRequests] = useState<PostRequest[]>([]);
  useEffect(() => {
    getPostRequests(userId).then((value) => {
      setPostRequests(value);
    });
  }, []);
  return { requests: postRequests[0]?.requests };
};
