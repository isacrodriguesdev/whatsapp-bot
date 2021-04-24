import { IAttendanceRepository } from "../../../repositories/AttendanceRepository"

export interface IGetWaitingAttendanceClient {
  execute(socketClient: any): void
}

export class GetWaitingAttendanceUseCase {

  constructor(
    private readonly attendanceRepository: IAttendanceRepository
  ) { }

  execute(socketClient: any) {
    socketClient.on("event: captured attendment", async (attendment: any) => {

      try {

        const response = await this.attendanceRepository.updateToOnGoing(attendment.id)

        socketClient.emit("success: captured attendment", { ...attendment, status: "ongoing" })

        console.log("captured attendment", attendment)
      } catch (error) {
        console.log(error)
        socketClient.emit("error: captured attendment", error)
      }
    })
  }
}