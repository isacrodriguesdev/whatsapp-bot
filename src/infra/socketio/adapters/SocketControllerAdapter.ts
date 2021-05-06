import { IJwtControllerAdpter } from "../../../helpers/jwt/JwtControllerAdpter"
import { ISocketIO } from "../../../protocols/Http"
import { socket } from "../SocketConnection"
import { IAttendantRepository } from "../../../repositories/AttendantRepository"
import { IGetWaitingAttendanceClient } from "../../../attendance/OperatorUseCases/GetWaitingAttendance/GetWaitingAttendanceUseCase"
import { BotController } from "../../../controllers/Bot.Controller"

export interface ISocketControllerAdapter {
  execute(botControllers: BotController[]): void
}

export class SocketControllerAdapter implements ISocketControllerAdapter {

  constructor(
    private readonly attendantRepository: IAttendantRepository,
    private readonly jwtControllerAdpter: IJwtControllerAdpter,
    private readonly getWaitingAttendanceClient: IGetWaitingAttendanceClient,
    private readonly sendMessageAttendance: any,
    private readonly closeAttendanceOperator: any
  ) { }

  execute(botControllers: any[]) {
    socket.use(async (socket: ISocketIO, next) => {

      try {
        const userDecoded = await this.jwtControllerAdpter.verifyToken(socket.handshake.query.authorization)
        await this.attendantRepository.update(userDecoded.id, {
          socket_id: socket.id
        })
        socket.user = userDecoded
        next()
      } catch (error) {
        next(new Error("not authorized"))
      }
    })
      .on("connection", (socket: ISocketIO) => {

        console.log("Connected", socket.id)

        this.getWaitingAttendanceClient.execute(socket)
        this.sendMessageAttendance.execute(socket, botControllers)
        this.closeAttendanceOperator.execute(socket)

        socket.on("disconnect", () => { })
      })

    return socket
  }
}