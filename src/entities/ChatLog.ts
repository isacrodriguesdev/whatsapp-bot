import uuid from "../utils/adapters/uuid.Adapter"
export interface ChatLogObjct {
    id: string
    text: string
    created_at: string
    file: string
    type: string
    branch_id: string
    user_id: string
    chat_id: string
}

export class ChatLog {
    readonly id?: string
    constructor(
        readonly text: string | null,
        readonly created_at: Date,
        readonly file: string, // url de onde esta o arquivo
        readonly type: string,
        readonly branch_id: string,
        readonly user_id: string,
        readonly chat_id: string
    ) {
        this.id = uuid.newID()
    }
}