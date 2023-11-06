import { Alert } from "react-native";
import { supabase, supabaseUrl } from "../utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { IMessage, User } from "react-native-gifted-chat";

export type Request = {
  id: number;
  post_id?: number;
  approved?: string;
  profiles?: {
    id?: string;
    first_name?: string;
  };
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
    profiles?: {
      id?: string;
      first_name?: string;
    };
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
  requests?: Request[];
};

export type ChatCardProps = {
  Id: number,
  nameOfCorrespondent: string,
  lastMessageTeaser: string,
  updated_at: Date
}

export const uploadImage = async (fileName: string, formData: FormData) => {
  await supabase.storage.from("tree_images").upload(fileName, formData);
};

export const createPost = async (
  fileName: string,
  description: string,
  date: Date,
  postalCode: string,
  city: string
) => {
  const storagePath = "/storage/v1/object/public/tree_images/";
  const storageUrl = supabaseUrl + storagePath + fileName;
  const { error } = await supabase.from("posts").insert({
    image_url: storageUrl,
    description,
    pick_up_date: date,
    postal_code: postalCode,
    city,
  });
  handleError(error);
};

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `id, created_at, image_url, description, user_id, pick_up_date, postal_code, city, requests (id, profiles (id))`
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

export const getFirstName = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`id, first_name`)
    .eq("id", userId)
  handleError(error);
  if (data && data.length > 0) {
    return data[0].first_name as string;
  }
  else {
    return ''
  }
};

export const getChats = async (userId: string) => {
  const { data, error } = await supabase
    .from("chats")
    .select(
      `id, updated_at, requester_id, donator_id, is_last_message_read_by_donator, is_last_message_read_by_requester, teaser`
    )
    .or(`requester_id.eq.${userId}, donator_id.eq.${userId}`)
    .order("updated_at", { ascending: false });
  handleError(error);

  if (!data) {
    return [];
  }

  const chatCards: ChatCardProps[] = await Promise.all(data.map(async (chat) => {
    const correspondentId = chat.requester_id === userId ? chat.donator_id : chat.requester_id; 
    const nameOfCorrespondent = await getFirstName(correspondentId);
    return {
      Id: chat.id,
      nameOfCorrespondent,
      lastMessageTeaser: chat.teaser,
      updated_at: chat.updated_at,
    };
  }));

  return chatCards as ChatCardProps[];
};

export const getMessages = async (chatId: number) => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `id, author, content, chat_id, created_at`
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false });
  handleError(error);

  if (!data) {
    return [];
  }

  const messages: IMessage[] = await Promise.all(data.map(async (message) => {
    const author: User = {
      _id: message.author,
      name: await getFirstName(message.author)
    }
    return {
      _id: message.id,
      text: message.content,
      user: author,
      createdAt: message.created_at,
    };
  }));
  return messages as IMessage[];
};

export const sendMessage = async (chatId: number, content: string, author: string ) => {
  const { error: messageError } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, content, author });
  handleError(messageError);
  //PROBLEM: UPDATE virker ikke på denne... noget med rettigheder og sikkerhed?
  const { error: chatError } = await supabase
  .from("chats")
  .update({ teaser: content.slice(0, 20) })
  .eq("id", chatId);
  handleError(chatError);
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
