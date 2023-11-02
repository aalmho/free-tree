import {
  getPostRequests,
  approveRequest,
  Request,
  requestTree,
  unrequestTree,
  Post,
  getPosts,
} from "../api/api";
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

export const useRequestTree = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { requesterUserId: string; postId: number }) => {
      return requestTree(args.requesterUserId, args.postId);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  return mutate;
};

export const useUnrequestTree = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { requestId: number }) => {
      return unrequestTree(args.requestId);
    },
    onSuccess: async () => {
      const queryKey: QueryKey = ["posts"];
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};
