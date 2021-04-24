import { SendMessageClientUseCase } from "../../../attendance/ClientUseCases/SendMessageClient/SendMessageClientUseCase"
import { BotController } from "../../../controllers/Bot.Controller"
import { IMessageController } from "../../../controllers/Message.Controller"
import { ChatControllerAdapter } from "../../controllers/ChatController.Adapter"

import { ChatRepositoryAdapter } from "../../knex/adapters/ChatRepository.Adapter"

export function SendMessageClientFactory(botController: BotController) {

  const chatRepository = new ChatRepositoryAdapter()
  const chatController = new ChatControllerAdapter(chatRepository)

  return new SendMessageClientUseCase(botController, chatController)
}