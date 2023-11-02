import { Alert } from "react-native";
import { supabase, supabaseUrl } from "../utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export type Request = {
  id: number;
  post_id?: number;
  approved?: string;
  requester?: string;
};

export type PostRequest = {
  user_id: string;
  requests?: Request[];
};

export type Post = {
  id: number;
  created_at: Date;
  image_url: string;
  description: string;
  pick_up_date: Date;
  user_id: string;
  requests?: Request[];
};

export const uploadImage = async (fileName: string, formData: FormData) => {
  await supabase.storage.from("tree_images").upload(fileName, formData);
};

export const createPost = async (
  fileName: string,
  description: string,
  date: Date
) => {
  const storagePath = "/storage/v1/object/public/tree_images/";
  const storageUrl = supabaseUrl + storagePath + fileName;
  const { error } = await supabase
    .from("posts")
    .insert({ image_url: storageUrl, description, pick_up_date: date });
  handleError(error);
};

export const deletePost = async (postId: number) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  handleError(error);
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, created_at, image_url, description, user_id, pick_up_date, requests (requester, id)`
    )
    .order("created_at", { ascending: false });
  handleError(error);
  return data as Post[];
};

export const getPostRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`user_id, requests (id, approved, post_id)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  handleError(error);
  return data as PostRequest[];
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

export const approveRequest = async (requestId: number) => {
  const { error, data } = await supabase
    .from("requests")
    .update({ approved: true })
    .eq("id", requestId);
};

const handleError = (error: PostgrestError | null) => {
  if (error) {
    return Alert.alert("Something went wrong. Please try again");
  }
};
