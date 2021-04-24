import { BotController } from "../../controllers/Bot.Controller";
import { IBotRepository } from "../../repositories/BotRepository";

export class BotQuestionsUserController {

  constructor(
    private readonly botController: BotController,
    private readonly botRepository: IBotRepository
  ) {}

  async execute(botId: string, userId: string) {
    const response = await this.botRepository.getBotQuestionsUser(botId, userId);

    const questions = response.map((question: any) => ({
      ...question,
      message: question.message.toString()
    }))

    return questions
  }
}