import { ChatType } from "./types"

export const peopelIWriteWith = [
    {
        avatar: 'https://picsum.photos/140',
        name: 'Allan',
        lastMessageTeaser: 'Hej Allan. Tak for sidst...',
        chatId: 1
    },
    {
    avatar: 'https://picsum.photos/140',
    name: 'Karin',
    lastMessageTeaser: 'Kom forbi og hent på torsdag...',
    chatId: 2
}]

export const Chats: ChatType[] = 
[
    {
        id: 1,
        chatMessages: [
            {
                _id: 1,
                text: 'Hej Allan. Tak for sidst... Denne besked skal i fremtden hentes fra supabase database',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: 'Boris',
                avatar: 'https://picsum.photos/140'
                },
            },
        ]
    },
    {
        id: 2,
        chatMessages: [
            {
                _id: 1,
                text: 'Kom forbi og hent på torsdag... Så giver jeg kaffe og kage.',
                createdAt: new Date(),
                user: {
                _id: 2,
                name: 'Boris',
                avatar: 'https://picsum.photos/140'
                },
            },
        ]
    }
]

