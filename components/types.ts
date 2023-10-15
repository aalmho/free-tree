import { IMessage } from "react-native-gifted-chat"

export type ChatCardProps = {
    avatar: string,
    name: string,
    lastMessageTeaser: string,
    chatId: number
}

export type ChatType = {
    id: number,
    chatMessages: IMessage[]
}