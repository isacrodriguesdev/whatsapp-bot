import { MenuBuilder } from "../builders/MenuBuilder";
import { BotController } from "../controllers/Bot.Controller";
import { Menu } from "../entities/Menu";
import { MenuControllerAdapter } from "../infra/controllers/MenuControllerAdpter";
import { MessageControllerAdapter } from "../infra/controllers/MessageController.Adapter";
import { BotRepositoryAdapter } from "../infra/knex/adapters/BotRepository.Adapter";
import { MenuRepositoryAdapter } from "../infra/knex/adapters/MenuRepository.Adapter";
import { UserRepositoryAdapter } from "../infra/knex/adapters/UserRepository.Adapter";
import { UpdateUserRegisterUseCase } from "../useCases/UpdateUserRegister/UpdateUserRegisterUseCase";

export function UpdateUserRegisterFactory (botController: BotController) {

  const userRepository = new UserRepositoryAdapter()
  const messageController = new MessageControllerAdapter(botController)
  const menuRepository = new MenuRepositoryAdapter()
  const botRepository = new BotRepositoryAdapter()
  const menuBuilder = new MenuBuilder(menuRepository, botRepository)
  const menuController = new MenuControllerAdapter(messageController, menuBuilder)

  return new UpdateUserRegisterUseCase(userRepository, messageController, menuController)
}