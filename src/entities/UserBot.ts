import uuid from "../Adapters/Uuid.Adapter";

export class UserBot {
    constructor(
        readonly id: string,
        readonly bot_id: string,
        readonly user_id: string,
    ){
      this.id = uuid.newID()
    }
}