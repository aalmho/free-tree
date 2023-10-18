import { Alert } from "react-native";
import { supabase, supabaseUrl } from "../utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export interface Post {
  id: number;
  created_at: Date;
  image_url: string;
  description: string;
  user_id: string;
  requests?: {
    id: number;
    post_id: number;
    requester: string;
  }[];
}

export const uploadImage = async (fileName: string, formData: FormData) => {
  await supabase.storage.from("tree_images").upload(fileName, formData);
};

export const createPost = async (fileName: string, description: string) => {
  const storagePath = "/storage/v1/object/public/tree_images/";
  const storageUrl = supabaseUrl + storagePath + fileName;
  const { error } = await supabase
    .from("posts")
    .insert({ image_url: storageUrl, description });
  handleError(error);
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, created_at, image_url, description, user_id, requests (requester, id, post_id)`
    )
    .order("created_at", { ascending: false });
  handleError(error);
  return data as Post[];
};

export const requestTree = async (requesterUserId: string, postId: number) => {
  const { error } = await supabase
    .from("requests")
    .insert({ requester: requesterUserId, post_id: postId });
  handleError(error);
};

export const unrequestTree = async (requestId: number) => {
  const { error, data } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);
  handleError(error);
};

const handleError = (error: PostgrestError | null) => {
  if (error) {
    return Alert.alert("Something went wrong. Please try again");
  }
};
