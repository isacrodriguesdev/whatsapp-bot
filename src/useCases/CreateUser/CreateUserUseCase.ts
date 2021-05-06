import { BotController } from "../../controllers/Bot.Controller";
import { User } from "../../entities/User";
import { MsgRequest } from "../../protocols/MsgRequest";
import { UserRepository } from "../../repositories/UserRepository";

export class CreateUserUseCase {

  constructor(
    private readonly botController: BotController,
    private readonly userRepository: UserRepository
  ) {}

  async execute(initialUser: any, msg: MsgRequest) {

    // const photo = await this.botController.getAndDownloadUserPhoto(msg)
    
    await this.userRepository.save(
      new User({ ...initialUser, photo: null })
    )
  }
}