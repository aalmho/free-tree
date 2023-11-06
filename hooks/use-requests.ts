import {
  getPostRequests,
  approveRequest,
  requestTree,
  unrequestTree,
  getRequestsByUser,
} from "../api/api";
import {
  useQuery,
  QueryKey,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

export type RequestWithImg = {
  id?: number;
  image_url?: string;
  post_id?: number;
  approved?: string;
  profiles?: {
    id?: string;
    first_name?: string;
  };
  created_at?: Date;
};

export const useRequests = (userId: string) => {
  const queryKey: QueryKey = ["userRequests", userId];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const postRequests = await getPostRequests(userId);
      const postsWithRequests = postRequests.filter(
        (post) => post.requests && post.requests.length > 0
      );
      const requestsWithImageUrls = postsWithRequests.flatMap((post) => {
        return post.requests!.map((request) => ({
          ...request,
          image_url: post.image_url || "",
        }));
      });

      return requestsWithImageUrls;
    },
  });
};

export const useRequestsByUser = (userId: string) => {
  const queryKey: QueryKey = ["requestsByUser", userId];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const requests = await getRequestsByUser(userId);
      return requests;
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
      return queryClient.invalidateQueries({ queryKey });
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
      return queryClient.invalidateQueries({ queryKey: ["posts"] });
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
