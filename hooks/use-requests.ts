import { getPostRequests, approveRequest, Request } from "../api/api";
import {
  useQuery,
  QueryKey,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

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

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { requestId: number; userId: string }) => {
      return approveRequest(args.requestId);
    },
    onSuccess: async (data, variables) => {
      const queryKey: QueryKey = ["userRequests", variables.userId];
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};
