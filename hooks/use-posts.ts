import {
  Post,
  PostRequest,
  Request,
  createPost,
  deletePost,
  getPosts,
  getPostsByUser,
  markPostAsReserved,
} from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequests } from "./use-requests";

export const usePosts = () => {
  return useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      return await getPosts();
    },
  });
};

export const usePostsByUser = (userId: string) => {
  return useQuery({
    queryKey: ["getPostsByUser"],
    queryFn: async () => {
      return await getPostsByUser(userId);
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: {
      fileName: string;
      description: string;
      date: Date;
      postalCode: string;
      city: string;
      lat: number;
      lon: number;
    }) => {
      return createPost(
        args.fileName,
        args.description,
        args.date,
        args.postalCode,
        args.city,
        args.lat,
        args.lon
      );
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey: ["getPostsByUser"] });
    },
  });
  return mutate;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { postId: number; userId: string }) => {
      const previousData = queryClient.ensureQueryData({
        queryKey: ["getPostsByUser"],
        queryFn: () => getPostsByUser(args.userId),
      });
      const previousPostData = queryClient.ensureQueryData({
        queryKey: ["getPosts"],
        queryFn: () => usePosts(),
      });

      const previousRequestData = queryClient.ensureQueryData({
        queryKey: ["requestsByUser", args.userId],
        queryFn: () => getRequests(args.userId),
      });

      queryClient.setQueryData(
        ["userRequests", args.userId],
        (oldData: PostRequest | undefined) => {
          if (oldData && Array.isArray(oldData)) {
            return oldData.filter(
              (request: Request) => request.post_id !== args.postId
            );
          }
          return oldData;
        }
      );

      queryClient.setQueryData(
        ["getPostsByUser"],
        (oldData: Post[] | undefined) => {
          if (oldData) {
            return oldData.filter((post) => post.id !== args.postId);
          }
          return oldData;
        }
      );

      queryClient.setQueryData(["getPosts"], (oldData: Post[] | undefined) => {
        if (oldData) {
          return oldData.filter((post) => post.id !== args.postId);
        }
        return oldData;
      });

      try {
        return deletePost(args.postId);
      } catch {
        queryClient.setQueryData(["getPostsByUser"], previousData);
        queryClient.setQueryData(["getPosts"], previousPostData);
        queryClient.setQueryData(
          ["requestsByUser", args.userId],
          previousRequestData
        );
      }
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });
  return mutate;
};

export const useMarkPostAsReserved = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async (args: {
      postId: number;
      mark: boolean;
      userId: string;
    }) => {
      const previousUserPostData = queryClient.ensureQueryData({
        queryKey: ["getPostsByUser"],
        queryFn: () => getPostsByUser(args.userId),
      });

      const previousPostData = queryClient.ensureQueryData({
        queryKey: ["getPosts"],
        queryFn: () => getPosts(),
      });

      const updatePostData = (oldData: Post[] | undefined) => {
        if (oldData) {
          return oldData.map((post) =>
            post.id === args.postId ? { ...post, reserved: args.mark } : post
          );
        }
      };

      queryClient.setQueryData(["getPostsByUser"], updatePostData);
      queryClient.setQueryData(["getPosts"], updatePostData);

      try {
        return await markPostAsReserved(args.postId, args.mark);
      } catch {
        queryClient.setQueryData(["getPostsByUser"], previousUserPostData);
        queryClient.setQueryData(["getPosts"], previousPostData);
      }
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });

  return mutate;
};
