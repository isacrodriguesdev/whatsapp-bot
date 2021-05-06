import { UserRepository } from "../../../repositories/UserRepository"
import { ChatLog } from "../../../entities/ChatLog"
import { User } from "../../../entities/User"
import knexConnection from '../knexConnection'

export class UserRepositoryAdapter implements UserRepository {

  save(userData: User): Promise<void> {
    return knexConnection("contacts")
      .insert({ ...userData })
  }

  update(chat: string, branch_id: string, data: any): Promise<any> {
    return knexConnection("contacts").update(data).where({ chat, branch_id })
  }

  saveData(data: any): Promise<any> {
    return knexConnection("contacts_data")
      .insert(data)
  }

  getOne(chat: string, branch_id: string): Promise<any> {
    return knexConnection("contacts").where({
      chat, branch_id
    }).first()
  }

  saveCurrentMenu(user: User, menu_id: string): Promise<any> {
    return knexConnection("contacts")
      .update("menu_id", menu_id)
      .where({
        chat: user.chat,
        branch_id: user.branch_id
      })
  }

  saveChatLog(msg: ChatLog): Promise<any> {
    return knexConnection("chat_messages")
      .insert(msg)
  }

  saveChatOrderLog(user_id: string, branch_id: string, msg: ChatLog): Promise<any> {
    return knexConnection("chat_order_messages")
      .insert({
        ...msg,
        user_id,
        branch_id
      })
  }
}