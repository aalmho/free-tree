import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { peopelIWriteWith } from './MockData';
import { ChatCardProps } from './types';

const MessagesPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [chatCards, setChatCards] = useState<ChatCardProps[]>([]);

    useEffect( () => {
        // Fetch messageCards from supaBase. This is mockData.
        setChatCards(peopelIWriteWith)
    }, [])

    const onCardPress = (chatId: number) => {
        navigation.navigate('Chat', {chatId: chatId})
    }

    const renderChatCard = (chatCardProps: ChatCardProps) => {
        return(
            <TouchableOpacity onPress={() => onCardPress(chatCardProps.chatId)} style={styles.chatCard}>
                <View style={{flexDirection:'row'}}>
                    <Image source={{uri: 'https://picsum.photos/140'}} style={{ width: 40, height: 40 }} />
                    <View>
                        <Text>
                            {chatCardProps.name}
                        </Text>
                        <Text>
                            {chatCardProps.lastMessageTeaser}
                        </Text>
                    </View>
                </View>
        </TouchableOpacity>
        )
    }
       
    return (
        <View>
            {chatCards.map( (chatCard: ChatCardProps) => renderChatCard(chatCard))}
        </View>
    )
}

const styles = StyleSheet.create({
    chatCard: {
      backgroundColor: '#fff',
      margin: 4
    },
  });

export default MessagesPage;