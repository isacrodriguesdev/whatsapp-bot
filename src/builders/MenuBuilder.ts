import { Menu } from "../entities/Menu"
import { IBotRepository } from "../repositories/BotRepository"
import { MenuRepository } from "../repositories/MenuRespository"

export class MenuBuilder {

  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly botRepository: IBotRepository
  ) { }

  async buildInitialMenuOrSame(menuId: string | null, botId: string) {

    let sameMenu = await this.menuRepository.getByChildren(menuId, botId)
    let context: any = {}

    console.log("!!!!", sameMenu)

    if (menuId === null) {
      const childlessMenu = await this.buildChildlessMenu(botId)
      context = { ...childlessMenu }
    }
    else {
      if (sameMenu.length === 0) {
        sameMenu = await this.menuRepository.getById(menuId, botId)
      }
      context = {
        title: sameMenu[0].title,
        message: sameMenu[0].message,
        type: sameMenu[0].type,
        file: sameMenu[0].file
      }
    }

    if (sameMenu.length === 1) {
      const message = this.buildSingleMenu(context)

      return {
        type: context.type,
        file: context.file,
        message: message
      }
    }
    else if (sameMenu.length > 1) {
      const header = {
        description: context.message
      }

      const message = this.buildFullMenu(header, sameMenu)

      return {
        type: context.type,
        file: context.file,
        message: message
      }
    }
  }

  async buildNextMenu(menuId: string | null, reponseMsg: Menu[], botId: string) {

    if (reponseMsg.length > 1) {
      const messages = { description: reponseMsg[0].title }
      const message = this.buildFullMenu(messages, reponseMsg)
      return { ...reponseMsg[0], message }
    }
    else if (reponseMsg.length === 1) {
      const message = this.buildSingleMenu(reponseMsg[0])
      return { ...reponseMsg[0], message }
    }
    else if (reponseMsg.length === 0) {
      reponseMsg = await this.menuRepository.getById(menuId, botId)
      const message = this.buildSingleMenu(reponseMsg[0])
      return { ...reponseMsg[0], message }
    }
  }

  // construir menu sem filhos
  private async buildChildlessMenu(botId: string) {
    const botConfig = await this.botRepository.getInitialMessages(botId)
    return {
      message: botConfig.initial_message,
      type: botConfig.initial_message_type,
      file: botConfig.initial_message_file
    }
  }

  private buildFullMenu(header: { description?: string, title?: string }, menus: Menu[]): string {

    let message = ""

    if (header.description) {
      message = message.concat(`${header.description}\n\n`)
    }

    menus.forEach((menu) => {
      message = message.concat(`*${menu.order}.* ${menu.title} \n`)
    })

    return message
  }

  private buildSingleMenu(singleMenu: any): string {

    let message = ""

    if (singleMenu.title) {
      message = message.concat(`*${singleMenu.title}*\n\n`)
    }
    if (singleMenu.message) {
      message = message.concat(singleMenu.message.toString())
    }

    return message
  }
}