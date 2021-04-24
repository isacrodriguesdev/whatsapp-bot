
import { CloseAttendanceOperatorUseCase } from "../../../attendance/OperatorUseCases/CloseAttendanceOperator/CloseAttendanceOperatorUseCase"
import { AttendanceRepositoryAdapter } from "../../knex/adapters/AttendanceRepository.Adpter"

export function CloseAttendanceOperatorFactory() {

  const attendanceRepository = new AttendanceRepositoryAdapter()

  return new CloseAttendanceOperatorUseCase(attendanceRepository)
}