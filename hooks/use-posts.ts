import {
  Post,
  createPost,
  deletePost,
  getPosts,
  markPostAsReserved,
} from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePosts = () => {
  return useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const posts = await getPosts();
      return posts;
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
    }) => {
      return createPost(
        args.fileName,
        args.description,
        args.date,
        args.postalCode,
        args.city
      );
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey: ["getPosts"] });
    },
  });
  return mutate;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { postId: number }) => {
      const previousData = queryClient.getQueryData(["getPosts"]);

      queryClient.setQueryData(["getPosts"], (oldData: Post[] | undefined) => {
        if (oldData) {
          return oldData.filter((post) => post.id !== args.postId);
        }
        return oldData;
      });

      try {
        return deletePost(args.postId);
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

export const useMarkPostAsReserved = () => {
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async (args: { postId: number; mark: boolean }) => {
      const previousData = queryClient.getQueryData(["getPosts"]);
      queryClient.setQueryData(["getPosts"], (oldData: Post[] | undefined) => {
        if (oldData) {
          return oldData.map((post) =>
            post.id === args.postId ? { ...post, reserved: args.mark } : post
          );
        }
        return oldData;
      });

      try {
        return await markPostAsReserved(args.postId, args.mark);
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
