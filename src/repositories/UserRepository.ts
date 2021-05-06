import { Bot } from "../entities/Bot";
import { ChatLog } from "../entities/ChatLog";
import { User } from "../entities/User";

export interface UserRepository {
	save(user: User): Promise<any>
	update(chat: string, branch_id: string, data: any): Promise<any>
	saveData(data: any): Promise<any>
	getOne(chat: string, botId: string): Promise<any>
	saveCurrentMenu(user: User, menu_id: string | null): Promise<any>
	saveChatLog(msg: ChatLog): Promise<ChatLog>
}