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
    mutationFn: async (args: { fileName: string; description: string }) => {
      return createPost(args.fileName, args.description);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return mutate;
};
