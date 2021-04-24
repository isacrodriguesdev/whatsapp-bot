import { TransmissionRepository, TransmissionRepositoryStatus } from "../../../repositories/TransmissionRepository"
import { Bot } from "../../../entities/Bot"
import { User } from "../../../entities/User"
import knexConnection from "../knexConnection"
import uuidAdapter from "../../../utils/adapters/uuid.Adapter"

export class TransmissionRepositoryAdapter implements TransmissionRepository {

  getOne(botId: string) {
    return knexConnection("transmission_bots")
      .leftJoin("transmissions", "transmission_bots.transmission_id", "=", "transmissions.id")
      .join("bots", "transmission_bots.bot_id", "=", "bots.id")
      .select(
        "transmissions.*",
        "transmission_bots.max_send",
        "transmission_bots.total_sended",
      )
      .where({ "bots.id": botId, "transmission_bots.status": "waiting" })
      .andWhereNot({ "transmissions.date": null })
      .orderBy("transmissions.date")
      .first()
  }

  getTransmissionUsers(transmissionId: string, botId: string, limit: number): Promise<any> {
    // return knexConnection("users")
    //   .whereNotExists(function () {
    //     this.select("*").from("transmissions_sent")
    //       .join("bots", "transmissions_sent.bot_id", "=", "bots.id")
    //       .whereRaw("users.id = transmissions_sent.user_id")
    //       .where({ transmission_id: transmissionId })
    //   })
    //   .where({ bot_id: botId })
    //   .limit(limit)

    return knexConnection("transmissions_sent")
      .where({ bot_id: botId, transmission_id: transmissionId })
      .limit(limit)
  }

  updateTransmissionBotStatus(transmissionId: string, status: TransmissionRepositoryStatus) {
    return knexConnection("transmission_bots")
      .where({ transmission_id: transmissionId })
      .update("status", status)
  }

  updateTransmissionBotTotalSended(transmissionId: string, totalSended: number) {
    return knexConnection("transmission_bots")
      .where({ transmission_id: transmissionId })
      .update("total_sended", totalSended)
  }

  createTransmissionUser(transmissionId: string, userId: string, botId: string, status: "success" | "failed" = "success") {
    return knexConnection("transmissions_sent")
      .insert({
        id: uuidAdapter.newID(),
        transmission_id: transmissionId,
        user_id: userId,
        bot_id: botId,
        status: status
      })
  }
}



