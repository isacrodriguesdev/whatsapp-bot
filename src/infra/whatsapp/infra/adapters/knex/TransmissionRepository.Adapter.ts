import { TransmissionRepository, TransmissionRepositoryStatus } from "../../../../../repositories/TransmissionRepository"
import uuidAdapter from "../../../../../utils/adapters/uuid.Adapter"
import knexConnection from "../../../../knex/knexConnection"

export class TransmissionWhatsappRepositoryAdapter implements TransmissionRepository {

  getOne(botId: string) {
    return knexConnection("transmission_bots")
      .leftJoin("transmissions", "transmission_bots.transmission_id", "=", "transmissions.id")
      .join("bots", "transmission_bots.bot_id", "=", "bots.id")
      .select(
        "transmissions.*",
        "transmission_bots.date_send",
        "transmission_bots.status",
        "transmission_bots.max_send",
        "transmission_bots.total_sended",
      )
      .where({ "bots.id": botId, "transmission_bots.status": "ongoing" })
      .orWhere({ "bots.id": botId, "transmission_bots.status": "waiting" })
      .andWhereNot({ "transmission_bots.date_send": null })
      .orderBy("transmission_bots.date_send")
      .first()
  }

  updateTransmissionBot(transmissionBotId: string, data: any): Promise<any> {
    return knexConnection("transmission_bots")
      .where({ transmission_id: transmissionBotId })
      .update(data)
  }

  getTransmissionUsers(transmissionId: string, botId: string): Promise<any> {
    return knexConnection("transmissions_sent")
      .where({ bot_id: botId, transmission_id: transmissionId })
  }

  updateTransmissionBotStatus(transmissionId: string, status: TransmissionRepositoryStatus) {
    return knexConnection("transmission_bots")
      .where({ transmission_id: transmissionId })
      .update("status", status)
  }

  createTransmissionUser(transmissionId: string, chatId: string, botId: string, status: "success" | "failed" = "success") {
    return knexConnection("transmissions_sent")
      .insert({
        id: uuidAdapter.newID(),
        transmission_id: transmissionId,
        chat_id: chatId,
        bot_id: botId,
        status: status
      })
  }
}



