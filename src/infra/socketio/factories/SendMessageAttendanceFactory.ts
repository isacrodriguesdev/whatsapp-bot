import { SendMessageAttendanceUseCase } from "../../../attendance/OperatorUseCases/SendMessageAttendance/SendMessageAttendanceUseCase"
import { BotController } from "../../../controllers/Bot.Controller"
import { ChatControllerAdapter } from "../../controllers/ChatController.Adapter"
import { ChatRepositoryAdapter } from "../../knex/adapters/ChatRepository.Adapter"

export function SendMessageAttendanceFactory() {

  const chatRepositoryAdapter = new ChatRepositoryAdapter()
  const chatControllerAdapter = new ChatControllerAdapter(chatRepositoryAdapter)

  return new SendMessageAttendanceUseCase(chatControllerAdapter)
}