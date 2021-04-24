import md5 from "md5";
import { BotController } from "../../../controllers/Bot.Controller";
import { IMessageController } from "../../../controllers/Message.Controller";
import { generateProtocol } from "../../../helpers/generateProtocol";
import { text } from "../../../helpers/replaceText";
import { socket } from "../../../infra/socketio/SocketConnection";
import { MsgRequest } from "../../../protocols/MsgRequest";
import { IAttendanceRepository } from "../../../repositories/AttendanceRepository";
import uuidAdapter from "../../../utils/adapters/uuid.Adapter";

export class OpenAttendanceClientUseCase {

  constructor(
    private readonly messageController: IMessageController,
    private readonly attendanceRepository: IAttendanceRepository
  ) { }

  async execute(menu: any, msg: MsgRequest, departmentId: string) {
    let operator: any = {}

    const randomOperator = await this.attendanceRepository.getRandomOperator(departmentId)
    operator = { ...operator, ...randomOperator }

    if (randomOperator === undefined) {
      const firstAttendant = await this.attendanceRepository.getLastOperator(departmentId)
      operator = { ...operator, ...firstAttendant }
    }

    const attendance = {
      id: uuidAdapter.newID(),
      department_id: departmentId,
      bot_id: msg.user.bot_id,
      user_id: msg.user.id,
      status: "waiting",
      protocol: generateProtocol(),
      chat_channel: md5((Date.now() + Math.random() * 999999).toString()),
      operator_id: operator.operator_id,
      created_at: new Date()
    }

    try {
      await this.attendanceRepository.createAttendance(attendance)

      if (operator.socket_id) {
        socket.sockets.to(operator.socket_id).emit("an attendment was opened", {
          id: attendance.id,
          bot_id: attendance.bot_id,
          chat_channel: attendance.chat_channel,
          created_at: attendance.created_at,
          operator_id: attendance.operator_id,
          user_id: attendance.user_id,
          department_id: attendance.department_id,
          chat: msg.user.chat,
          cpf: msg.user.cpf,
          email: msg.user.email,
          name: msg.user.name?.toString(),
          photo: msg.user.photo,
          phone: msg.user.phone,
          last_message_created_at: new Date(),
          last_message_file: null,
          last_message_text: null,
          last_message_type: "text",
          unread_messages: 0,
          messages: []
        })

        const existsSocketId = socket.sockets.sockets[operator.socket_id]

        if (existsSocketId) {
          socket.sockets.sockets[operator.socket_id].join(attendance.chat_channel)
        }
      }

      this.messageController.execute(msg.user.chat, {
        ...menu[0],
        message: text(menu[0].message, {
          protocol: attendance.protocol,
          name: msg.user.name,
          operator: operator.first_name
        })
      })

    } catch (error) {
      // @ts-ignore
      this.messageController.execute(msg.user.chat, {
        type: "text",
        message: "*Erro*\n\nOcorreu um problema ao abrir seu atendimento, desculpe-nós por isso vamos corrigir em breve"
      })
      console.log(error)
    }
  }
}