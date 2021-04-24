
import { BotController } from "../../../../controllers/Bot.Controller"
import { TransmissionController } from "../../../../controllers/Transmission.Controller"
import { IMessageController } from "../../../../controllers/Message.Controller"
import { TransmissionRepository } from "../../../../repositories/TransmissionRepository"

export class TransmissionWhatsappControllerAdapter implements TransmissionController {

  async execute(
    botController: BotController,
    transmissionRepository: TransmissionRepository,
    messageController: IMessageController,
    botId: string
  ): Promise<void> {

    const loopTime = 1000 * 120

    const transmission = await transmissionRepository.getOne(botId)
    const sendTransmissionNow = transmission && Date.now() >= new Date(transmission.date).getTime()

    if (sendTransmissionNow) {

      // const totalLimit = transmission.max_send - transmission.total_sended
      const transmissionsDevice: any[] = await botController.getTransmissionUsers()
      const transmissionsRepo: any[] = await transmissionRepository.getTransmissionUsers(transmission.id, botId)

      const transmissions = transmissionsDevice.map((t, i) => {
        if (!transmissionsRepo.find(repo => repo.chat_id === t.id)) {
          return t.id
        }
      }).filter(t => t !== undefined)
        .slice(0, 3)

      if (transmissions.length > 0) {
        const requests = transmissions.map(async (broadcast, i: number) => {
          return new Promise((resolve, reject) => {

            setTimeout(async () => {
              if (broadcast) {
                try {

                  messageController.execute(broadcast, {
                    type: "text",
                    message: "Teste de campanha 004",
                    file: transmission.message_file,
                    location: transmission.message_location,
                    phone_firstname: transmission.message_phone_firstname,
                    phone_number: transmission.message_phone_number
                  })

                  resolve(
                    transmissionRepository.createTransmissionUser(transmission.id, broadcast, botId, "success")
                  )

                } catch (error) {
                  resolve(
                    transmissionRepository.createTransmissionUser(transmission.id, broadcast, botId, "failed"
                    ))
                }
              }
            }, i * 25000)
          })
        })

        try {

          await Promise.all(requests)

          const today = new Date()
          const tomorrow = new Date()

          await transmissionRepository.updateTransmissionBot(transmission.id, {
            total_sended: transmission.total_sended + requests.length,
            date_send: new Date(tomorrow.setMinutes(today.getMinutes() + 5))
          })

          if(transmission.status === "waiting") {
            await transmissionRepository.updateTransmissionBotStatus(transmission.id, "ongoing")
          }

        } catch (error) {

          console.log(error)

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