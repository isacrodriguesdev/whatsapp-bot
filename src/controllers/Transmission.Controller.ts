
import { TransmissionRepository } from "../repositories/TransmissionRepository";
import { BotController } from "./Bot.Controller";
import { IMessageController } from "./Message.Controller";

export interface TransmissionController {
  execute(botController: BotController,
    transmissionRepository: TransmissionRepository,
    messageController: IMessageController,
    botId: string
  ): Promise<void>
}