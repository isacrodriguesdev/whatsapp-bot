import { IBotRepository } from "../../../repositories/BotRepository"
import { Bot } from "../../../entities/Bot"
import knexConnection from "../knexConnection"

export class BotRepositoryAdapter implements IBotRepository {

  async getOne(): Promise<Bot> {
    // AQUI SO PODE PEGAR SE O BOT TIVER ATIVO ( CORRIJA AGORA )
    const bot = await knexConnection("bots")
      .join("bots_config", { "bots.id": "bots_config.bot_id" })
      .where({ "bots_config.active": true })
      .first()
    return bot
  }

  async getInitialMessages(botId: string): Promise<any> {
    const initialMessages = await knexConnection("bots_config")
      .where("bot_id", botId)
      .select(
        "initial_message_active",
        "initial_message_type",
        "initial_message_file",
        "initial_message_file_size",
        "initial_message",
      )
      .where("active", true).first()
    return initialMessages
  }

  // AQUI
  getBotQuestionsUser(botId: string, userId: string): Promise<any> {
    return knexConnection('bot_questions_user').whereNotExists(function () {
      this.select('*').from('users_data').whereRaw('bot_questions_user.id = users_data.question_id').andWhere({
        "users_data.user_id": userId
      })
    }).andWhere({ bot_id: botId })
  }

  getAll(): Promise<Bot[]> {
    return knexConnection("bots")
      .select("bots.*")
      .where("bots_config.active", true)
      .join("bots_config", { "bots.id": "bots_config.bot_id" })
  }
}