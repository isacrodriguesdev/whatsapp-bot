import uuid from "../utils/adapters/uuid.Adapter"

export class Bot {
    constructor(
        public readonly id: string,
        public readonly company_uid: string,
        public readonly created_at: Date,
        public token: string,
        public name: string,
        public username: string,
        public password: string,
        public has_menu: boolean,
        public has_menu_message: Buffer,
        public has_menu_type: string,
        public has_menu_file: string,
        public init_menu: boolean,
        public init_menu_message: null,
        public init_menu_type: string,
        public init_menu_file: null,
        public updated_at: null,
        public location: null,
        public limit_campaigns_users: number,
        public campaigns_occurred: number,
        public limit_campaigns: number,
        public campaigns_occurred_users: number, //
    ){
        this.id = uuid.newID()
        if(!limit_campaigns_users) this.limit_campaigns_users = 1000
    }
}

