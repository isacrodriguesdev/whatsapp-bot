import { BotController } from "../controllers/Bot.Controller";
import { MessageControllerAdapter } from "../infra/controllers/MessageController.Adapter";
import { MenuBuilder } from "../builders/MenuBuilder";
import { MenuControllerAdapter } from "../infra/controllers/MenuControllerAdpter";
import { MenuRepositoryAdapter } from "../infra/knex/adapters/MenuRepository.Adapter";
import { BotRepositoryAdapter } from "../infra/knex/adapters/BotRepository.Adapter";

export function MenuFactory (botController: BotController) {

  const messageController = new MessageControllerAdapter(botController)
  const menuRepository = new MenuRepositoryAdapter()
  const botRepository = new BotRepositoryAdapter()
  const menuBuilder = new MenuBuilder(menuRepository, botRepository)

  return new MenuControllerAdapter(messageController, menuBuilder)
}