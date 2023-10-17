import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Chats } from './MockData';
import { Route } from '@react-navigation/native';
import { ChatType } from './types';

const Chat = ({ route }: { route: Route<string, { chatId: number }> }) => {
    const { chatId } = route.params

    const DEFAULT_TABBAR_HEIGHT = useBottomTabBarHeight();
    const [messages, setMessages] = useState<IMessage[]>([])
    useEffect(() => {
        // Get messages from supabase database based on some id of the chat?
        // This is mockData
        const thisChat: ChatType = Chats.find( (chat: ChatType) => chat.id === chatId)!;
        setMessages(thisChat?.chatMessages)
    }, [])

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        //Add latest message to the chat in supabase-database
        //This is adding to MockData:
        const thisChatIndex = Chats.findIndex( (chat: ChatType) => chat.id === chatId)!;
        Chats[thisChatIndex].chatMessages.unshift(messages[0]);
    }, [])

    return (
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: 1,
            name: 'user',
            avatar: 'https://picsum.photos/140'
        }}
        bottomOffset={DEFAULT_TABBAR_HEIGHT}
        />
    )
}

export default Chat;