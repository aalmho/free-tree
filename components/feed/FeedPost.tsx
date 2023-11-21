import { FC } from "react";
import { Post } from "../../api/api";
import { View, Image } from "react-native";
import { Information } from "./components/Information";
import { Location } from "./components/Location";

interface FeedPost {
  post: Post;
}

export const FeedPost: FC<FeedPost> = ({ post }) => {
  return (
    <View style={{ marginHorizontal: 15, margin: 10 }}>
      <View>
        <View
          style={{ width: "100%", height: 450 }}
          key={post.created_at.toString()}
        >
          <Image
            style={{
              height: "100%",
              resizeMode: "cover",
              borderRadius: 10,
            }}
            source={{ uri: post.image_url }}
          />
          <Location post={post} />
          <Information post={post} />
        </View>
      </View>
    </View>
  );
};
