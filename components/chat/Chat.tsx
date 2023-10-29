import React, { useState, useCallback, useEffect, useContext } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Route } from '@react-navigation/native';
import { useGetMessages } from '../../hooks/use-messages';
import { SessionContext } from '../../context/SessionContext';
import { sendMessage } from '../../api/api';

const Chat = ({ route }: { route: Route<string, { chatId: number }> }) => {
    const { chatId } = route.params
    const { session } = useContext(SessionContext);
    const DEFAULT_TABBAR_HEIGHT = useBottomTabBarHeight();
    const { messages, setMessages } = useGetMessages(chatId)

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        sendMessage(chatId, messages[0].text, session?.user?.id!)
    }, [])

    return (
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: session?.user?.id!,
        }}
        bottomOffset={DEFAULT_TABBAR_HEIGHT}
        />
    )
}

export default Chat;