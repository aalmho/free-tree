import { FC } from "react";
import { View, Text } from "react-native";
import { Post } from "../../../api/api";

interface LocationProps {
  post: Post;
}

export const Location: FC<LocationProps> = ({ post }) => (
  <View
    style={{
      position: "absolute",
      top: "2%",
      right: "2%",
      padding: 10,
      backgroundColor: "rgba(255,255,255, 0.7)",
      borderRadius: 20,
    }}
  >
    <Text style={{ color: "black", fontWeight: "600" }}>
      {`${post.postal_code}, ${post.city}`}
    </Text>
  </View>
);
