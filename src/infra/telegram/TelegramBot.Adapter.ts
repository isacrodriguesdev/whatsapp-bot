import TelegramBot, { Message, SendMessageOptions, SendLocationOptions, SendPhotoOptions, SendVideoOptions, SendAudioOptions, SendDocumentOptions, SendContactOptions } from "node-telegram-bot-api"
import { BotController } from "../../controllers/Bot.Controller"
import { MsgResponse } from "../../protocols/MsgResponse"
import https from "https"
import fs from "fs"
import { MsgRequest } from "../../protocols/MsgRequest"
import md5 from "md5"

// @ts-ignore
export class TelegramBotControllerAdapter implements BotController {

  private telegramBot: TelegramBot

  // constructor(public readonly session: string) {
  // }
  
  async initialize(session: string) {
    this.telegramBot = new TelegramBot(session, { polling: true })
  }

  public onMessage(callback: any) {
    this.telegramBot.on('message', callback)
  }

  public async getAndDownloadUserPhoto(msgRequest: MsgRequest): Promise<any> {

    let photoData = (
      await this.telegramBot.getUserProfilePhotos(msgRequest.chat.id, { limit: 1 })
    )

    if (photoData.total_count === 0)
      return null

    let photoUrl = await this.telegramBot.getFileLink(photoData.photos[0][2].file_id)
    let photoExtension = `${photoUrl.split("/photos/")[1].split(".")[1]}`
    let photoName = `${md5(msgRequest.chat.id.toString())}.${photoExtension}`

    const file = fs.createWriteStream(`uploads/photos/${photoName}`)
    https.get(photoUrl, function (response) {
      response.pipe(file)
    })

    return photoName
  }

  async downloadFileChat(fileId: string): Promise<string> {
    const fileUrl = await this.telegramBot.getFileLink(fileId)
    const pathUrlParts = fileUrl.split("/")
    const fileExtension = `${pathUrlParts[pathUrlParts.length - 1].split(".")[1]}`
    const fileName = `${md5((Date.now() + Math.random() * 9999).toString())}.${fileExtension}`

    const file = fs.createWriteStream(`uploads/files/${fileName}`)
    const request = https.get(fileUrl, function (response: any) {
      response.pipe(file)
    })

    return fileName
  }

  public getFile(fileId: string): Promise<any> {
    return this.telegramBot.getFile(fileId)
  }

  public getFileLink(fileId: string): Promise<any> {
    return this.telegramBot.getFileLink(fileId)
  }

  public sendText(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendMessageOptions): Promise<Message> {
    return this.telegramBot.sendMessage(chatIdentifier, msgResponse.message, {
      ...options,
      parse_mode: "Markdown",

    })
  }

  public sendPhoto(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendPhotoOptions): Promise<Message> {

    return this.telegramBot.sendPhoto(chatIdentifier, msgResponse.file, {
      caption: msgResponse.message,
      ...options,
      parse_mode: "Markdown"
    })
  }

  public sendAudio(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendAudioOptions): Promise<Message> {
    return this.telegramBot.sendAudio(chatIdentifier, msgResponse.file, {
      caption: msgResponse.message,
      ...options,
      parse_mode: "Markdown"
    })
  }

  public sendVideo(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendVideoOptions): Promise<Message> {
    return this.telegramBot.sendVideo(chatIdentifier, msgResponse.file, {
      caption: msgResponse.message,
      ...options,
      parse_mode: "Markdown"
    })
  }

  public sendLocation(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendLocationOptions): Promise<Message> {
    const locations = msgResponse.location.split(",")
    if (msgResponse.message) {
      this.telegramBot.sendMessage(chatIdentifier, msgResponse.message.replace(/\*/g, ""))
    }

    return this.telegramBot.sendLocation(chatIdentifier, parseInt(locations[0]), parseInt(locations[1]), { ...options })
  }

  public sendDocument(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendDocumentOptions): Promise<Message> {
    return this.telegramBot.sendDocument(chatIdentifier, msgResponse.file, {
      caption: msgResponse.message,
      ...options
    })
  }

  public sendContact(chatIdentifier: string | number, msgResponse: MsgResponse, options?: SendContactOptions): Promise<Message> {
    return this.telegramBot.sendContact(chatIdentifier, msgResponse.phone_number, msgResponse.phone_firstname, { ...options })
  }
}
