import React, { useState } from 'react';
import {Text, View, Button, ScrollView, RefreshControl, Image, StyleSheet, Dimensions} from 'react-native';
import { supabase } from '../utils/supabase';
import { useGetPosts } from '../hooks/use-posts';
const deviceWidth = Dimensions.get("window").width;

const HomePage = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { posts } = useGetPosts(refreshing, setRefreshing);
    
    return(
        <ScrollView
        style={{ flex: 1 }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
        }>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="sign out" onPress={() => supabase.auth.signOut()} />
            <Text>{`Number of posts: ${posts.length}`}</Text>
        </View>
        <View style={styles.container}>
            {posts.map((post) => (  
            <Image key={post.created_at.toString()} style={styles.image} source={{uri: post.image_url}}></Image>
            ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: deviceWidth / 2,
        height: deviceWidth / 2,
      },
      container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
      },
})

export default HomePage;