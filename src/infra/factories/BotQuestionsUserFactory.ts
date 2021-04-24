import { BotController } from "../../controllers/Bot.Controller";
import { BotQuestionsUserController } from "../controllers/BotQuestionsUserController";
import { BotRepositoryAdapter } from "../knex/adapters/BotRepository.Adapter";

export function BotQuestionsUserFactory (botController: BotController) {

  const botRepository = new BotRepositoryAdapter()

  return new BotQuestionsUserController(botController, botRepository)
}