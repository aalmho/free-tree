import { Alert } from "react-native";
import { supabase, supabaseUrl } from "../utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { IMessage, User } from "react-native-gifted-chat";

export type Profile = {
  id?: string;
  first_name?: string;
};

export type Request = {
  id: number;
  post_id?: number;
  approved?: string;
  profiles?: Profile;
  created_at?: Date;
};

export type PostRequest = {
  id?: number;
  user_id?: string;
  image_url?: string;
  requests?: Request[];
};

export type RequestMadeByUser = {
  id?: number;
  created_at?: string;
  approved?: string;
  posts?: {
    id?: number;
    image_url?: string;
    user_id?: string;
    profiles?: Profile;
  };
};

export type Post = {
  id: number;
  created_at: Date;
  image_url: string;
  description: string;
  pick_up_date: Date;
  postal_code: string;
  city: string;
  user_id: string;
  lat?: number;
  lon?: number;
  reserved?: string;
  requests?: Request[];
};

export const uploadImage = async (fileName: string, formData: FormData) => {
  await supabase.storage.from("tree_images").upload(fileName, formData);
};

export const createPost = async (
  fileName: string,
  description: string,
  date: Date,
  postalCode: string,
  city: string,
  lat: number,
  lon: number
) => {
  const storagePath = "/storage/v1/object/public/tree_images/";
  const storageUrl = supabaseUrl + storagePath + fileName;
  const { error } = await supabase.from("posts").insert({
    image_url: storageUrl,
    description,
    pick_up_date: date,
    postal_code: postalCode,
    city,
    lat,
    lon
  });
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
      `id, created_at, image_url, description, user_id, pick_up_date, postal_code, city, reserved, lat, lon, requests (id, profiles (id))`
    )
    .order("created_at", { ascending: false });
  handleError(error);
  return data as Post[];
};

export const getPostRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `user_id, image_url, requests (id, approved, post_id, created_at, profiles(id, first_name))`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  handleError(error);
  return data as PostRequest[];
};

export const getRequestsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `id, created_at, approved, posts (id, user_id, image_url, profiles (id, first_name))`
    )
    .eq("requester", userId)
    .order("created_at", { ascending: false });
  handleError(error);
  return data as RequestMadeByUser[];
};

export const requestTree = async (requesterUserId: string, postId: number) => {
  const { error, data } = await supabase
    .from("requests")
    .insert({ requester: requesterUserId, post_id: postId });
  handleError(error);
};

export const approveRequest = async (requestId: number) => {
  const { error, data } = await supabase
    .from("requests")
    .update({ approved: true })
    .eq("id", requestId);
};

export const deleteUserData = async (userId: string) => {
  const { error: postsError } = await supabase
    .from("posts")
    .delete()
    .eq("user_id", userId);
  const { error: requestsError } = await supabase
    .from("requests")
    .delete()
    .eq("requester", userId);
  handleError(postsError || requestsError);
};

export const markPostAsReserved = async (postId: number, mark: boolean) => {
  const { error, data } = await supabase
    .from("posts")
    .update({ reserved: mark })
    .eq("id", postId);
};

export const getMessages = async (request_id: number) => {
  const { data, error } = await supabase
    .from("messages")
    .select(`id, author, content, request_id, created_at`)
    .eq("request_id", request_id)
    .order("created_at", { ascending: false });
  handleError(error);

  if (!data) {
    return [];
  }

  const messages: IMessage[] = await Promise.all(
    data.map((message) => {
      const author: User = {
        _id: message.author,
      };
      return {
        _id: message.id,
        text: message.content,
        user: author,
        createdAt: message.created_at,
      };
    })
  );
  return messages as IMessage[];
};

export const sendMessage = async (
  requestId: number,
  content: string,
  author: string
) => {
  const { error: messageError } = await supabase
    .from("messages")
    .insert({ request_id: requestId, content, author });
  handleError(messageError);
};

export const createNotification = async (userId: string, title: string, message: string) => {
  const { error: messageError } = await supabase
    .from("notifications")
    .insert({ user_id: userId, title, body: message });
  handleError(messageError);
};

export const removeAllNotificationsForUser = async (userId: string) => {
  const { error: messageError } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", userId);
  handleError(messageError);
};

const handleError = (error: PostgrestError | null) => {
  if (error) {
    return Alert.alert("Something went wrong. Please try again");
  }
};
