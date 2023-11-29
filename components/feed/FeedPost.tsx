import { FC } from "react";
import { Post } from "../../api/api";
import { View, ActivityIndicator } from "react-native";
import { Information } from "./components/Information";
import { Location } from "./components/Location";
import { Image } from "@rneui/themed";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  return (
    <View style={{ marginHorizontal: 15, margin: 10 }}>
      <View
        style={{ width: "100%", height: 350 }}
        key={post.created_at.toString()}
      >
        <Image
          style={{
            height: "100%",
            resizeMode: "cover",
            borderRadius: 20,
          }}
          source={{ uri: `${post.image_url}?height=700&width=700` }}
          PlaceholderContent={<ActivityIndicator />}
        />
        <Location post={post} />
      </View>
      <Information post={post} />
    </View>
  );
};
