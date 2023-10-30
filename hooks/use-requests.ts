import { getPostRequests, Request } from "../api/api";
import { useQuery, QueryKey } from "@tanstack/react-query";

export const useRequests = (userId: string) => {
  const queryKey: QueryKey = ["userRequests", userId];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const postRequests = await getPostRequests(userId);
      return postRequests.flatMap((post) => post?.requests as Request[]);
    },
  });
};
