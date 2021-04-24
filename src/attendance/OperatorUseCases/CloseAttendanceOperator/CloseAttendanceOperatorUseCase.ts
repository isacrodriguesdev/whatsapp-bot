import { IAttendanceRepository } from "../../../repositories/AttendanceRepository"


export class CloseAttendanceOperatorUseCase {

  constructor(
    private readonly attendanceRepository: IAttendanceRepository
  ) {

  }

  execute(socketClient: any) {
    socketClient.on("event: operator ended attendance", async (attendance: any) => {
  
      try {

        await this.attendanceRepository.updateToClosed(attendance.id)
        console.log("event: operator ended attendance")
        socketClient.emit("success: operator ended attendance")

      } catch (error) {

        console.log(error)
        
        socketClient.emit("error: operator ended attendance", error)
      }

    })
  }
}