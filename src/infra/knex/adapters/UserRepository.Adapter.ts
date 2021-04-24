import { UserRepository } from "../../../repositories/UserRepository"
import { ChatLog } from "../../../entities/ChatLog"
import { User } from "../../../entities/User"
import knexConnection from '../knexConnection'

export class UserRepositoryAdapter implements UserRepository {

  save(userData: User): Promise<void> {
    return knexConnection("users")
      .insert({ ...userData })
  }

  update(chat: string, bot_id: string, data: any): Promise<any> {
    return knexConnection("users").update(data).where({ chat, bot_id })
  }

  saveData(data: any): Promise<any> {
    return knexConnection("users_data")
      .insert(data)
  }

  getOne(chat: string, bot_id: string): Promise<any> {
    return knexConnection("users").where({
      chat, bot_id
    }).first()
  }

  saveCurrentMenu(user: User, menu_id: string): Promise<any> {
    return knexConnection("users")
      .update("menu_id", menu_id)
      .where({
        chat: user.chat,
        bot_id: user.bot_id
      })
  }

  saveChatLog(msg: ChatLog): Promise<any> {
    return knexConnection("chat_messages")
      .insert(msg)
  }

  saveChatOrderLog(user_id: string, bot_id: string, msg: ChatLog): Promise<any> {
    return knexConnection("chat_order_messages")
      .insert({
        ...msg,
        user_id,
        bot_id
      })
  }
}