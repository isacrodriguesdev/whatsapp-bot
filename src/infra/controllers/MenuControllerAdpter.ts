import TelegramBot from "node-telegram-bot-api"
import { MenuBuilder } from "../../builders/MenuBuilder"
import { BotController } from "../../controllers/Bot.Controller"
import { IMessageController } from "../../controllers/Message.Controller"
import { User } from "../../entities/User"
import { MsgResponse } from "../../protocols/MsgResponse"

export class MenuControllerAdapter {

  constructor(
    private readonly messageController: IMessageController,
    private readonly menuBuilder: MenuBuilder,
  ) { }

  async sendHomeOrSameMenu(user: User) {
    const responseMsg: any = await this.menuBuilder.buildInitialMenuOrSame(user.menu_id, user.bot_id)

    const keyboard = user.menu_id !== null ? {
      reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
          ["Voltar"]
        ]
      })
    } : undefined

    this.messageController.execute(user.chat, responseMsg, keyboard)
  }

  async sendNextMenu(user: User, menuId: string, requestMsg: any[], botId: string) {
    const responseMsg: any = await this.menuBuilder.buildNextMenu(menuId, requestMsg, botId)

    return this.messageController.execute(user.chat, responseMsg, {
      reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
          ["Voltar"]
        ]
      })
    })
  }

}