
import { BotController } from "../../../controllers/Bot.Controller";
import { JwtControllerAdpter } from "../../../helpers/jwt/JwtControllerAdpter";
import { AttendantRepositoryAdapter } from "../../knex/adapters/AttendantRepository.Adpter";
import { SocketControllerAdapter } from "../adapters/SocketControllerAdapter";
import { CloseAttendanceOperatorFactory } from "./CloseAttendanceOperatorFactory";
import { GetWaitingAttendanceClientFactory } from "./GetWaitingAttendanceFactory"
import { SendMessageAttendanceFactory } from "./SendMessageAttendanceFactory"

export function SocketControllerFactory() {

  const attendantRepository = new AttendantRepositoryAdapter()
  const jwtController = new JwtControllerAdpter()

  const getWaitingAttendanceClientFactory = GetWaitingAttendanceClientFactory()
  const sendMessageAttendanceFactory = SendMessageAttendanceFactory()
  const closeAttendanceOperatorFactory = CloseAttendanceOperatorFactory()

  return new SocketControllerAdapter(
    attendantRepository,
    jwtController,
    getWaitingAttendanceClientFactory,
    sendMessageAttendanceFactory,
    closeAttendanceOperatorFactory
  )
}