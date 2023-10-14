import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'

const MessagesPage = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    useEffect(() => {
        // Get messages from supabase database
        setMessages([
        {
            _id: 1,
            text: 'Hej. Denne besked skal i fremtden hentes fra supabase database',
            createdAt: new Date(),
            user: {
            _id: 2,
            name: 'Boris',
            avatar: 'https://picsum.photos/140'
            },
        },
        ])
    }, [])

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        //Send latest message to supabase-database
    }, [])

    return (
        <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages)}
        user={{
            _id: 1,
            name: 'user',
            avatar: 'https://picsum.photos/140'
        }}
        />
    )
}

export default MessagesPage;