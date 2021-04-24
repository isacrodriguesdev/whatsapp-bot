import { User } from "../entities/User";

export interface MsgRequest {
    from: {
        user_id: string,
        bot_id: string,
        is_bot: boolean | null,
        first_name: string
        last_name: string | null
        username: string | null
        language_code: string | null
    }
    can_join_groups: boolean
    can_read_all_group_messages: boolean
    chat: {
        id: number
    },
    caption: string | null,
    attendance: any,
    user: User,
    type: "photo" | "voice" | "video" | "video_note" | "document" | "contact" | "audio" | "game" | "sticker" | "location" | "text" | "image"
    text: string | null
    voice?: any
    photo: telegramPhoto[]
    document?: any
    location?: any
    video?: any
    video_note?: any
    contact?: any
    audio?: any
    game?: any
    sticker?: any
    message_id: number
}
type telegramPhoto = {
    file_id: string
}