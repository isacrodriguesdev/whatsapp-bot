import { BotController } from "../../controllers/Bot.Controller"
import { MsgRequest } from "../../protocols/MsgRequest"

export interface Chat {
  id?: string
  attendment_id?: string
  message_id?: number
  type: "photo" | "voice" | "video" | "video_note" | "document" | "contact" | "audio" | "game" | "sticker" | "location" | "text" | "chat"
  text: string | null
  file?: string
  sender?: "client" | "attendant",
  contact_phone_number?: string
  contact_first_name?: string
  contact_user_id?: string
  created_at: Date
}

export interface ChatController {
  execute(msg: MsgRequest, chat: Chat): Promise<any>
}

export class ChatControllerAdapter {
  constructor(
    private readonly chatRepository: any
  ) { }

  async execute(msg: MsgRequest, chat: Chat): Promise<any> {

    switch (chat.type) {
      case "text":
        await this.chatRepository.store(chat)
        return chat
      case "chat":
        await this.chatRepository.store(chat)
        return chat
      case "photo":
        const storePhoto = { ...chat, text: msg.caption }
        await this.chatRepository.store(storePhoto)
        return storePhoto
      case "contact":
        const storeContact = {
          ...chat,
          file: null,
          text: msg.caption,
          contact_phone_number: msg.contact.phone_number,
          contact_first_name: msg.contact.first_name,
          contact_user_id: msg.contact.user_id,
        }
        await this.chatRepository.store(storeContact)
        return storeContact
      default:
        const storeFile = { ...chat, text: msg.caption }
        await this.chatRepository.store(storeFile)
        return storeFile
    }
  }
}