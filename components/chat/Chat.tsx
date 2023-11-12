import React, { useState, useCallback, useEffect, useContext } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { Route } from '@react-navigation/native';
import { SessionContext } from '../../context/SessionContext';
import { sendMessage } from '../../api/api';
import { useGetMessages, useMessagesByRequest, useSendMessage } from '../../hooks/use-messages';

const Chat = ({ route }: { route: Route<string, { requestId: number }> }) => {
    const { requestId } = route.params
    const { session } = useContext(SessionContext);
    const { mutate } = useSendMessage();
    const { messages, setMessages } = useGetMessages(requestId);
    // const {
    //     data: messagesByRequestId
    //   } = useMessagesByRequest(requestId);

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        sendMessage(requestId, messages[0].text, session?.user?.id!)

        // GiftedChat.append(messagesByRequestId, messages);
        // mutate({ requestId, content: messages[0].text, author: session?.user?.id! })
    }, [])

    return (
        <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
            _id: session?.user?.id!,
        }}
        />
    )
}

export default Chat;