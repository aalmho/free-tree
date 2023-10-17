import { Alert } from "react-native"
import { supabase, supabaseUrl } from "../utils/supabase"
import { PostgrestError } from "@supabase/supabase-js"

export interface Post {
    created_at: Date;
    image_url: string;
    description: string;
}

export const uploadImage = async (fileName: string, formData: FormData) => {
    await supabase.storage
    .from("tree_images")
    .upload(fileName, formData);
}

export const createPost = async (
    fileName: string,
    description: string
) => {
    const storagePath = "/storage/v1/object/public/tree_images/";
    const storageUrl =
      supabaseUrl + storagePath + fileName;
    const {error} = await supabase.from("posts").insert({image_url: storageUrl, description})
    handleError(error);
}

export const getPosts = async () => {
    const {data, error} = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    handleError(error)
    return data as Post[];
}

const handleError = (error: PostgrestError | null) => {
    if(error) {
        Alert.alert('Something went wrong. Please try again');
    }
}