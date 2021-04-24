
import { MsgRequest } from "../protocols/MsgRequest";

interface ChatBotRepository {
    store(msg: MsgRequest): Promise<any>
}

export class ChatBotControllerAdapter {
    constructor(
        private readonly chatBotRepository: ChatBotRepository
    ) { }

    async execute(): Promise<void> {

    }
}