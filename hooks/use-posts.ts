import { useState, useEffect } from "react";
import { Post, getPosts } from "../api/api";

export const useGetPosts = (refreshing: boolean, setRefreshing: (refreshing: boolean) => void) => {
    const [posts, setPosts] = useState<Post[]>([])
    useEffect(() => {
        getPosts().then((val) => {
            setPosts(val)
            setRefreshing(false);
        });
    }, [refreshing])

    return {posts}
}