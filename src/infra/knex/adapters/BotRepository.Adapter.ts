import { IBotRepository } from "../../../repositories/BotRepository"
import { Bot } from "../../../entities/Bot"
import knexConnection from "../knexConnection"
import { cloudId } from "../../../../cloud"

export class BotRepositoryAdapter implements IBotRepository {

  async getOne(): Promise<Bot> {
    // AQUI SO PODE PEGAR SE O BOT TIVER ATIVO ( CORRIJA AGORA )
    const bot = await knexConnection("branches")
      .join("branches_config", { "branches.id": "branches_config.branch_id" })
      .where({ "branches_config.active": 1 })
      .first()
    return bot
  }

  async getInitialMessages(botId: string): Promise<any> {
    const initialMessages = await knexConnection("branches_config")
      .where("branch_id", botId)
      .select(
        "initial_message_active",
        "initial_message_type",
        "initial_message_file",
        "initial_message_file_size",
        "initial_message",
      )
      .where("active", 1).first()
    return initialMessages
  }

  // AQUI
  getBotQuestionsUser(botId: string, userId: string): Promise<any> {
    return knexConnection('branch_questions').whereNotExists(function () {
      this.select('*').from('contacts_data').whereRaw('branch_questions.id = contacts_data.question_id').andWhere({
        "contacts_data.user_id": userId
      })
    }).andWhere({ branch_id: botId })
  }

  getAll(): Promise<Bot[]> {
    return knexConnection("branches")
      .select("branches.*")
      //.where("branches_config.active", 1)
      .where("branches.id", cloudId)
      //.join("branches_config", { "branches.id": "branches_config.branch_id" })
  }
}