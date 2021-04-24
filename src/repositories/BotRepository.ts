import { Bot } from "../entities/Bot";

export interface IBotRepository {
	getAll(): Promise<Bot[]>
	getOne(): Promise<Bot>
	getInitialMessages(botId: string): Promise<any>,
	getBotQuestionsUser(botId: string, userId: string): Promise<any>
}