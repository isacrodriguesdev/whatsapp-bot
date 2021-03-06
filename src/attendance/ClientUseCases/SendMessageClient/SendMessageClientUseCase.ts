import { BotController } from "../../../controllers/Bot.Controller"
import { socket } from "../../../infra/socketio/SocketConnection"
import { MsgRequest } from "../../../protocols/MsgRequest"
import uuidAdapter from "../../../utils/adapters/uuid.Adapter"

export class SendMessageClientUseCase {

  constructor(
    private readonly botController: BotController,
    private readonly chatController: any
  ) { }

  async execute(message: MsgRequest) {

    let fileName: string | undefined = undefined

    // outra plataforma message.photo[message.photo.length - 1].file_id // message[message.type].file_id
    if (message.type === "photo" || message.type === "image") {
      fileName = await this.botController.downloadFileChat(message)
      message = { ...message, text: message.caption }
    }
    else if (message.type === "document") {
      fileName = await this.botController.downloadFileChat(message)
      message = { ...message, text: message.caption }
    }
    else if (message.type === "ptt") {
      fileName = await this.botController.downloadFileChat(message)
    }

    const chatMessage = await this.chatController.execute(message, {
      type: message.type,
      attendment_id: message.attendance.id,
      text: message.text,
      sender: "client",
      file: fileName,
      read: 1,
      created_at: new Date()
    })

    socket.sockets.emit("message", chatMessage)
  }

}