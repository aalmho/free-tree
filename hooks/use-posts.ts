import { getPosts } from "../api/api";
import { useQuery, QueryKey } from "@tanstack/react-query";

export const usePosts = () => {
  const queryKey: QueryKey = ['posts'];

  return useQuery({queryKey, queryFn: async () => {
    return getPosts();
  }});
}
