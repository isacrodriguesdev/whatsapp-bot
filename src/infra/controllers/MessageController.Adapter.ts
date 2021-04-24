import TelegramBot from "node-telegram-bot-api"
import { MenuBuilder } from "../../builders/MenuBuilder"
import { BotController } from "../../controllers/Bot.Controller"
import { IMessageController } from "../../controllers/Message.Controller"
import { User } from "../../entities/User"
import { MsgResponse } from "../../protocols/MsgResponse"

export class MessageControllerAdapter implements IMessageController {

  constructor(
    private readonly botController: BotController,
  ) { }

  execute(chatId: string, msg: MsgResponse, options = {}): Promise<any> {

    const sender = {
      "text": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendText(chatId, msg, options)
      },
      "voice": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendAudio(chatId, msg, options)
      },
      "location": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendLocation(chatId, msg, options)
      },
      "video": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendVideo(chatId, msg, options)
      },
      "photo": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendPhoto(chatId, msg, options)
      },
      "document": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendDocument(chatId, msg, options)
      },
      "contact": (chatId: string, msg: MsgResponse, options: any) => {
        return this.botController.sendContact(chatId, msg, options)
      },
    }

    if(sender[msg.type]) {
      return sender[msg.type](chatId, msg, options)
    } else {
      return sender["text"](chatId, msg, options)
    }

  }

}