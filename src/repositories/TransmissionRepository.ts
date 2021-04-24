
export type TransmissionRepositoryStatus = "completed" | "waiting" | "paused" | "cancelled" | "ongoing"

export interface TransmissionRepository {
  getOne(botId: string): Promise<any>
  getTransmissionUsers(transmissionBotId: string, botId: string, limit?: number): Promise<any>
  updateTransmissionBotStatus(transmissionBotId: string, status: TransmissionRepositoryStatus): Promise<any>
  createTransmissionUser(transmissionBotId: string, chatId: string, botId: string, status?: "success" | "failed"): Promise<any>
  updateTransmissionBot(transmissionBotId: string, data: any): Promise<any>
}