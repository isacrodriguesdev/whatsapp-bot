import { IidProvider } from '../utils/protocols/IidProvider'
import uuid from '../utils/adapters/uuid.Adapter'
interface UserRoles {
    menu_id: string | null // null
    accept_campaings?: boolean | null // null
    //vindo do telegram
    supports_inline_queries?: boolean
}
interface NewUser {
    readonly chat: string
    name: string
    username: string | null
    photo: string | null
    branch_id: string
    number?: string | null
    menu_id: string | null
}
export class User {
    readonly created_at: Date
    readonly id: string
    readonly branch_id
    readonly updated_at: Date | null
    public name: string
    public chat: string
    public photo: string | null
    public number?: string | null
    public menu_id: string | null

    constructor(params: NewUser) {
        this.updated_at = null
        this.created_at = new Date()
        this.photo = params.photo
        this.number = params.chat
        this.chat = params.chat
        this.branch_id = params.branch_id
        this.menu_id = params.menu_id

        if (!params.photo) { this.photo = null } else { this.photo = params.photo }
        if(!params.menu_id) { this.menu_id = null } else { this.menu_id = params.menu_id }
    }
}