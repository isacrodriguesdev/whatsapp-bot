import { GetWaitingAttendanceUseCase } from "../../../attendance/OperatorUseCases/GetWaitingAttendance/GetWaitingAttendanceUseCase"
import { AttendanceRepositoryAdapter } from "../../knex/adapters/AttendanceRepository.Adpter"

export function GetWaitingAttendanceClientFactory() {

  const attendanceRepository = new AttendanceRepositoryAdapter()

  return new GetWaitingAttendanceUseCase(attendanceRepository)
}