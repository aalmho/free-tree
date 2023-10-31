import { createPost, getPosts } from "../api/api";
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
    }) => {
      return createPost(args.fileName, args.description, args.date);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};
