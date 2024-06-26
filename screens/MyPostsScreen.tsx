import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { usePostsByUser } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { SessionContext } from "../context/SessionContext";
import { Ionicons } from "@expo/vector-icons";
import { SignOutDropdown } from "../components/SignOutDropdown";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

const MyPostsScreen = ({ navigation }: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { session } = useContext(SessionContext);
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = usePostsByUser(session?.user?.id!);

  const { t } = useTranslation();

  const userPosts = useMemo(() => posts, [posts, session]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          name="menu-outline"
          color="green"
          size={30}
          style={{ paddingRight: 10 }}
        />
      ),
    });
  }, [navigation, isDropdownOpen]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isRefetching}
          onRefresh={refetch}
        />
      }
    >
      <View style={{ gap: 20 }}>
        {isDropdownOpen && <SignOutDropdown userId={session?.user?.id!} />}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 30,
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            onPress={() => navigation.navigate("CreatePostScreen")}
          >
            <Ionicons
              name="add-circle"
              color="green"
              size={70}
              style={{ position: "absolute" }}
            />
          </TouchableOpacity>
        </View>
        {userPosts?.length === 0 && (
          <View
            style={{
              justifyContent: "center",
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text>{t("youHaveNoTreesPlaceholder")}</Text>
          </View>
        )}
        <View style={{ gap: 20 }}>
          {userPosts?.map((post) => (
            <FeedPost key={post.id.toString()} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MyPostsScreen;
