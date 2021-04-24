import { BotController } from "../controllers/Bot.Controller";
import { UserRepositoryAdapter } from "../infra/knex/adapters/UserRepository.Adapter";
import { CreateUserUseCase } from "../useCases/CreateUser/CreateUserUseCase";

export function CreateUserFactory (botController: BotController) {

  const userRepository = new UserRepositoryAdapter()

  return new CreateUserUseCase(botController, userRepository)
}