import { createPost, deletePost, getPosts } from "../api/api";
import {
  useQuery,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const queryKey: QueryKey = ["posts"];

export const usePosts = () => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      return getPosts();
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
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (args: { postId: number }) => {
      return deletePost(args.postId);
    },
    onSuccess: async () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};
