import { TransmissionRepository, TransmissionRepositoryStatus } from "../../../../../repositories/TransmissionRepository"
import uuidAdapter from "../../../../../utils/adapters/uuid.Adapter"
import knexConnection from "../../../../knex/knexConnection"

//@ts-ignore
export class TransmissionWhatsappRepositoryAdapter implements TransmissionRepository {

  getOne(botId: string) {
    return knexConnection("transmission_branches")
      .leftJoin("transmissions", "transmission_branches.transmission_id", "=", "transmissions.id")
      .join("branches", "transmission_branches.branch_id", "=", "branches.id")
      .select(
        "transmissions.*",
        "transmission_branches.date_send",
        "transmission_branches.status",
        "transmission_branches.max_send",
        "transmission_branches.total_sended",
      )
      .where({ "branches.id": botId, "transmission_branches.status": "ongoing" })
      .orWhere({ "branches.id": botId, "transmission_branches.status": "waiting" })
      .andWhereNot({ "transmission_branches.date_send": null })
      .orderBy("transmission_branches.date_send")
      .first()
  }

  updateTransmissionBot(transmissionBotId: string, data: any): Promise<any> {
    return knexConnection("transmission_branches")
      .where({ transmission_id: transmissionBotId })
      .update(data)
  }

  getTransmissionUsers(transmissionId: string, botId: string): Promise<any> {
    return knexConnection("transmissions_sent")
      .where({ branch_id: botId, transmission_id: transmissionId })
  }

  updateTransmissionBotStatus(transmissionId: string, status: TransmissionRepositoryStatus) {
    return knexConnection("transmission_branches")
      .where({ transmission_id: transmissionId })
      .update("status", status)
  }

  createTransmissionUser(transmissionId: string, chatId: string, botId: string, status: "success" | "failed" = "success") {
    return knexConnection("transmissions_sent")
      .insert({
        transmission_id: transmissionId,
        chat_id: chatId,
        branch_id: botId,
        status: status
      })
  }
}



