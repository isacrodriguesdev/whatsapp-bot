import { IidProvider } from '../utils/protocols/IidProvider'
import uuid from '../utils/adapters/uuid.Adapter'
interface UserRoles {
    menu_id: string | null // null
    accept_campaings?: boolean | null // null
    //vindo do telegram
    supports_inline_queries?: boolean
}
interface NewUser {
    readonly id?: string
    readonly chat: string
    name: string
    username: string | null
    language_code: string | null
    photo: string | null
    bot_id: string
    menu_id: string | null
    phone?: string | null
    email?: string | null
    cpf?: string | null
}
export class User {
    public disabled: boolean
    readonly created_at: Date
    readonly id: string
    readonly bot_id
    readonly updated_at: Date | null
    public name: string
    public username: string | null
    public photo: string | null
    public phone?: string | null
    public language_code: string | null
    public menu_id: string | null
    public cpf?: string | null
    public email?: string | null
    readonly chat: string

    constructor(params: NewUser) {
        this.id = uuid.newID()
        this.updated_at = null
        this.created_at = new Date()
        this.disabled = false
        this.language_code = params.language_code
        this.photo = params.photo
        this.phone = params.phone
        this.chat = params.chat
        this.bot_id = params.bot_id
        this.menu_id = params.menu_id

        if (!params.email) { this.email = null } else { this.email = params.email }

        if (!params.cpf) { this.cpf = null } else { this.cpf = params.cpf }

        if (!params.photo) { this.photo = null } else { this.photo = params.photo }

        if (!params.username) { this.username = null } else { this.username = params.username }

        if(!params.menu_id) { this.menu_id = null } else { this.menu_id = params.menu_id }
    }
}