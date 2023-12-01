import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from "react-native";
import { usePosts } from "../hooks/use-posts";
import { FeedPost } from "../components/feed/FeedPost";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { focusManager } from "@tanstack/react-query";

const HomeScreen = () => {
  const { data: posts, isLoading, refetch, isRefetching } = usePosts();
  const { t } = useTranslation();
  const [offset, setOffset] = useState(4);
  const firstTimeRef = React.useRef(true);

  const onAppStateChange = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const postList = posts?.slice(0, offset);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  const onEndReached = () => {
    setOffset((prev) => prev + 4);
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View>
        {postList?.length === 0 && (
          <View
            style={{
              justifyContent: "center",
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text>{t("noTreesPlaceholder")}</Text>
          </View>
        )}
      </View>
      <View>
        <FlatList
          data={postList}
          renderItem={({ item }) => (
            <FeedPost key={item.created_at.toString()} post={item} />
          )}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          onRefresh={refetch}
          refreshing={isRefetching}
        />
      </View>
    </>
  );
};

export default HomeScreen;
