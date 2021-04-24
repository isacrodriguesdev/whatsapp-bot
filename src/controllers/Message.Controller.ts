import { Menu } from "../entities/Menu";
import { User } from "../entities/User";
import { MsgResponse } from "../protocols/MsgResponse"

export interface IMessageController {
  execute(chatId: string, msgResponse: any, options?: any): Promise<any>
}