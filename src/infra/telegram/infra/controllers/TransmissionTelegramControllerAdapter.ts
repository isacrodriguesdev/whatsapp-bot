
import { BotController } from "../../../../controllers/Bot.Controller"
import { TransmissionController } from "../../../../controllers/Transmission.Controller"
import { IMessageController } from "../../../../controllers/Message.Controller"
import { TransmissionRepository } from "../../../../repositories/TransmissionRepository"
import { User } from "../../../../entities/User"
import { ConfigTransmission } from "../../../../../config"

export class TransmissionTelegramControllerAdapter implements TransmissionController {

  async execute(
    botController: BotController,
    transmissionRepository: TransmissionRepository,
    messageController: IMessageController,
    botId: string
  ): Promise<void> {

    const loopTime = 1000 * ConfigTransmission.loop_time_transmission

    const transmission = await transmissionRepository.getOne(botId)
    const sendTransmissionNow = transmission && Date.now() >= new Date(transmission.date).getTime()

    if (sendTransmissionNow) {

      const totalLimit = transmission.max_send - transmission.total_sended

      const transmissionsUsers = await transmissionRepository.getTransmissionUsers(transmission.id, botId, Math.round(totalLimit))

      if (transmissionsUsers.length > 0) {
        const requests = transmissionsUsers.map(async (user: User, index: number) => {
          return new Promise((resolve, reject) => {

            setTimeout(async () => {
              if (user.chat !== null) {

                console.log("chat", user.chat)
                try {

                  messageController.execute(user.chat, {
                    type: transmission.message_type,
                    message: transmission.message_text?.toString(),
                    file: transmission.message_file,
                    location: transmission.message_location,
                    phone_firstname: transmission.message_phone_firstname,
                    phone_number: transmission.message_phone_number
                  })

                  resolve(
                    transmissionRepository.createTransmissionUser(transmission.id, user.id, botId)
                  )

                } catch (error) {
                  resolve(
                    transmissionRepository.createTransmissionUser(transmission.id, user.id, botId, "failed"
                    ))
                }
              }
            }, index * ConfigTransmission.loop_time_transmission_user)
          })
        })

        try {

          await Promise.all(requests)
          await transmissionRepository.updateTransmissionBotTotalSended(transmission.id, transmission.total_sended + requests.length)

        } catch (error) {

        } finally {
          console.log("Enviei a mensagem para", requests.length)
          setTimeout(() => this.execute(botController, transmissionRepository, messageController, botId), loopTime)
        }

      } else {

        console.log("Transmissão concluida com sucesso")

        transmissionRepository.updateTransmissionBotStatus(transmission.id, "completed")
          .finally(() => {
            setTimeout(() => this.execute(botController, transmissionRepository, messageController, botId), loopTime)
          })

      }
    } else {
      setTimeout(() => this.execute(botController, transmissionRepository, messageController, botId), loopTime)
      // console.log("Não há transmissão no momento")
    }
  }
}