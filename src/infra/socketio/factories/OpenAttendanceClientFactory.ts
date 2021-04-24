import { OpenAttendanceClientUseCase } from "../../../attendance/ClientUseCases/OpenAttendanceClient/OpenAttendanceClientUseCase"
import { IMessageController } from "../../../controllers/Message.Controller"
import { AttendanceRepositoryAdapter } from "../../knex/adapters/AttendanceRepository.Adpter"

export function OpenAttendanceClientFactory(messageController: IMessageController) {

  const attendanceRepository = new AttendanceRepositoryAdapter()

  return new OpenAttendanceClientUseCase(messageController, attendanceRepository)
}