import { ChatController } from "../../../infra/controllers/ChatController.Adapter";
import uuidAdapter from "../../../utils/adapters/uuid.Adapter";

export class SendMessageAttendanceUseCase {

  constructor(
    private readonly chatController: ChatController
  ) { }

  execute(socketClient: any, controllers: any[]) {
    socketClient.on("message", async (msg: any) => {

      const index = controllers.findIndex((bot) => bot.id === msg.bot_id)

      if(msg.type === "text") {
        if(msg.text.trim().length === 0) {
          return
        }
      }

      const chatMessage = await this.chatController.execute(msg, {
        id: uuidAdapter.newID(),
        type: msg.type,
        attendment_id: msg.attendment_id,
        text: msg.text,
        sender: msg.sender,
        created_at: new Date()
      })

      if (controllers[index]) {
        controllers[index].messageController.execute(msg.chat, {
          ...chatMessage,
          message: `*${msg.operator_name}*\n${msg.text}`
        })
      }
    })
  }
}