import { BotController } from "../../controllers/Bot.Controller";
import { IMessageController } from "../../controllers/Message.Controller";
import { User } from "../../entities/User";
import { isNumber } from "../../helpers/MsgHelper";
import { UserRepository } from "../../repositories/UserRepository";
import uuidAdapter from "../../utils/adapters/uuid.Adapter";

export class UpdateUserRegisterUseCase {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly messageController: IMessageController,
    private readonly menuController: any
  ) { }

  async execute(currentRegistrationSteps: any[], msg: any, user: User) {

    if (currentRegistrationSteps[0] === null) {
      currentRegistrationSteps.shift()
      await this.messageController.execute(msg.chatId, { message: currentRegistrationSteps[0].message.toString() })
      return
    }

    // dados sensiveis [VALIDAÇÃO]
    if (currentRegistrationSteps[0].name === "email") {
      if (!msg.text?.match(/@/g)) {
        await this.messageController.execute(msg.chatId, { message: "E-mail inválido, exemplo: joao@gmail.com" })
        return
      }
    } else if (currentRegistrationSteps[0].name === "cpf") {
      if (msg.text && isNumber(msg.text)) {
        await this.messageController.execute(msg.chatId, { message: "CPF inválido, exemplo: 00000000000" })
        return
      }
    } else if (currentRegistrationSteps[0].name === "phone") {
      if (msg.text && msg.split(" ").length == 2 && msg.split("-").length == 2) {
        await this.messageController.execute(msg.chatId, { message: "Telefone inválido, exemplo: +55 11 90000-0000" })
        return
      }
    }

    try {
      await this.userRepository.saveData({
        id: uuidAdapter.newID(),
        question_id: currentRegistrationSteps[0].id,
        message: msg.text,
        user_id: user.id
      })
    } catch (error) {
      console.log(error)
    }

    console.log(`${currentRegistrationSteps[0].name} foi gravado`)
    currentRegistrationSteps.shift()

    if (currentRegistrationSteps.length > 0) {
      await this.messageController.execute(msg.chatId, { message: currentRegistrationSteps[0].message.toString() })
    } else {
      this.menuController.sendHomeOrSameMenu(user)
      return "finish"
    }


  }
}