import {
  getPostRequests,
  approveRequest,
  requestTree,
  getRequestsByUser,
  PostRequest,
  Post,
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
      const previousData = queryClient.getQueryData([
        "userRequests",
        args.userId,
      ]);
      queryClient.setQueryData(
        ["userRequests", args.userId],
        (oldData: PostRequest | undefined) => {
          if (oldData && Array.isArray(oldData)) {
            return oldData.map((request) =>
              request.id === args.requestId
                ? { ...request, approved: "true" }
                : request
            );
          }
          return oldData;
        }
      );

      try {
        return await approveRequest(args.requestId);
      } catch {
        queryClient.setQueryData(["userRequests", args.userId], previousData);
      }
    },
    onSuccess: (data, variables) => {
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
      const previousData = queryClient.getQueryData(["getPosts"]);

      queryClient.setQueryData(["getPosts"], (oldData: Post[] | undefined) => {
        if (oldData) {
          return oldData.map((post) =>
            post.id === args.postId
              ? {
                  ...post,
                  requests: [
                    ...(post.requests || []),
                    {
                      approved: false,
                      profiles: { id: args.requesterUserId },
                      post_id: args.postId,
                    },
                  ],
                }
              : post
          );
        }
        return oldData;
      });

      try {
        return requestTree(args.requesterUserId, args.postId);
      } catch {
        queryClient.setQueryData(["getPosts"], previousData);
      }
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });
  return mutate;
};
