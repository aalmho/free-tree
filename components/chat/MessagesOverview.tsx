import React, { useState, useEffect, useContext } from 'react'
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useGetChats } from '../../hooks/use-chats';
import { SessionContext } from '../../context/SessionContext';
import { ChatCardProps } from '../../api/api';

const MessagesPage = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const { session } = useContext(SessionContext);
    const { chatCards } = useGetChats(session?.user?.id!)
    
    const onCardPress = (chatId: number) => {
        navigation.navigate('Chat', {chatId: chatId})
    }

    const renderChatCard = (chatCardProps: ChatCardProps) => {
        return(
            <TouchableOpacity onPress={() => onCardPress(chatCardProps.Id)} style={styles.chatCard}>
                <View style={{flexDirection:'row'}}>
                    {/* <Image source={{uri: 'https://picsum.photos/140'}} style={{ width: 40, height: 40 }} /> */}
                    <View>
                        <Text>
                            {chatCardProps.nameOfCorrespondent}
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