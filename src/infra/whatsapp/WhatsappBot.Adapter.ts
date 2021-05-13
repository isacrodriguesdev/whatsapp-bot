import { create, Message, Whatsapp } from 'venom-bot';
import { BotController } from "../../controllers/Bot.Controller"
import { MsgResponse } from "../../protocols/MsgResponse"
import fs from "fs"
import mime from 'mime-types'
import md5 from 'md5';

// @ts-ignore
export class WhatsappBotControllerAdapter implements BotController {

  private whatsappBot: Whatsapp

  async initialize(session: string) {
    this.whatsappBot = await create({ session })
  }

  public async onMessage(callback: any) {
    this.whatsappBot.onMessage(async (message) => {
      // console.log(message)

      const props = {
        chatId: message.chat.id,
        name: message.sender.pushname,
        text: message.body,
        caption: message.caption,
        type: message.type,
        isMedia: message.isMedia,
        isMMS: message.isMMS,
        mimetype: message.mimetype,
        to: message.to,
        message: message
      }

      callback(props)
    })
  }

  async downloadFileChat(message: any): Promise<any>{
    if (message.isMedia === true || message.isMMS === true) {
      const buffer = await this.whatsappBot.decryptFile(message.message)
      const fileName = `${md5((Date.now() + Math.random() * 9999).toString())}.${mime.extension(message.mimetype)}`
      fs.writeFile(`uploads/files/${fileName}`, buffer, (err) => {
        if(err) 
          console.log("Erro ao gravar arquivo enviado do cliente que está em atendimento", message.to, err)
      })

      return fileName
    }
  }

  async getTransmissionUsers(): Promise<any[]> {
    const chats = await this.whatsappBot.getAllChatsTransmission()
    return chats.map(chat => {
      return { id: chat.id.user + "@broadcast" }
    })
  }

  public sendText(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendText(chat, msg.message)
  }

  public sendPhoto(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendImage(chat, msg.file, "name", msg.message)
  }

  public sendAudio(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendFile(chat, msg.file)
  }

  public sendVideo(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendFile(chat, msg.file)
  }

  public sendLocation(chat: string, msg: MsgResponse): Promise<any> {
    const locations = msg.location.split(" ")
    if (msg.message) {
      this.whatsappBot.sendText(chat, msg.message)
    }

    return this.whatsappBot.sendLocation(chat, locations[0], locations[1], "title")
  }

  public sendDocument(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendFile(chat, msg.file)
  }

  public sendContact(chat: string, msg: MsgResponse): Promise<any> {
    return this.whatsappBot.sendContactVcard(chat, msg.phone_number, msg.phone_firstname)
  }

  public isConnected() {
    return this.whatsappBot.isConnected()
  }
}
