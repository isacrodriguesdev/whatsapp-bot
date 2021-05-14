import { User } from "../entities/User";

export interface MsgRequest {
    from: {
        user_id: string,
        branch_id: string,
        is_bot: boolean | null,
        name: string
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
    type: "photo" | "voice" | "video" | "video_note" | "document" | "contact" | "audio" | "game" | "sticker" | "location" | "text" | "image" | "ptt"
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
}
type telegramPhoto = {
    file_id: string
}