import { BotController } from "./src/controllers/Bot.Controller";
import { IMessageController } from "./src/controllers/Message.Controller";
import { MenuRepository } from "./src/repositories/MenuRespository";
import { UserRepository } from "./src/repositories/UserRepository";
import { Bot } from "./src/entities/Bot";
import { Menu } from "./src/entities/Menu";
import { isNumber } from "./src/helpers/MsgHelper";
import { MsgRequest } from "./src/protocols/MsgRequest";
// factories
import { OpenAttendanceClientFactory } from "./src/infra/socketio/factories/OpenAttendanceClientFactory";
import { SendMessageClientFactory } from "./src/infra/socketio/factories/SendMessageClientFactory";
import { IAttendanceRepository } from "./src/repositories/AttendanceRepository";
import { CreateUserFactory } from "./src/factories/CreateUserFactory";
import { UpdateUserRegisterFactory } from "./src/factories/UpdateUserRegisterFactory";
import { BotQuestionsUserFactory } from "./src/infra/factories/BotQuestionsUserFactory";
import { MenuFactory } from "./src/factories/MenuFactory"

export class App {

	constructor(
		private readonly robot: Bot,
		private readonly botController: BotController,
		private readonly messageController: IMessageController,
		private readonly menuRepository: MenuRepository,
		private readonly userRepository: UserRepository,
		private readonly attendanceRepository: IAttendanceRepository,
	) { }

	public async execute() {

		let userRegistrationSteps: any[] = []
		let postAttendance: string[] = []

		this.botController.onMessage(async (msg: any) => {

			const menuController = MenuFactory(this.botController)
			const sendMessageController = SendMessageClientFactory(this.botController)
			const botQuestionsUserController = BotQuestionsUserFactory(this.botController)
			const updateUserRegisterController = UpdateUserRegisterFactory(this.botController)

			const chatId = msg.chatId
			const userExists = await this.userRepository.getOne(chatId, this.robot.id)

			if (!userExists) {
				const initialUser = {
					chat: chatId,
					bot_id: this.robot.id,
					menu_id: null,
					name: msg.name,
				}
				await CreateUserFactory(this.botController)
					.execute(initialUser, msg)
			}

			let user = await this.userRepository.getOne(chatId, this.robot.id)

			if (!userRegistrationSteps.find(userRegistration => userRegistration.id === user.id)) {
				const botRegistrationSteps: any[] = await botQuestionsUserController.execute(this.robot.id, user.id)
				if (botRegistrationSteps.length > 0) {
					userRegistrationSteps.push({ id: user.id, steps: [null, ...botRegistrationSteps] })
				} else {
					userRegistrationSteps.push({ id: user.id, steps: [] })
				}
			}

			const currentUserRegistrationStep = userRegistrationSteps.find(userRegistration => userRegistration.id === user.id)

			if (currentUserRegistrationStep && currentUserRegistrationStep.steps.length > 0) {
				return updateUserRegisterController.execute(currentUserRegistrationStep.steps, msg, user)
			}

			if (!user.name) {
				await this.userRepository.update(chatId, this.robot.id, { name: msg.name })
			}

			const attendance = await this.attendanceRepository.getAttendance(user.id)

			if (attendance || postAttendance.find((id: string) => id === user.id)) {
				return sendMessageController.execute({ ...msg, attendance })
			}

			let botMenu: any[] = []

			// @ts-ignore
			if (msg.text && ["voltar", "#"].includes(msg.text.toLowerCase())) {

				await this.userRepository.saveCurrentMenu(user, null)
				const userMenu = await this.menuRepository.getByChildren(null, this.robot.id)

				//@modify
				botMenu = userMenu
				user = { ...user, menu_id: null }
			}

			//@modify
			botMenu = await this.menuRepository.getByChildren(user.menu_id, this.robot.id)

			let msgNext = false

			if (isNumber(msg.text)) {
				await Promise.all(
					botMenu.map(async ({ id, order, is_attendment, department_id }: Menu) => {
						if (msg.text == order) {

							msgNext = true
							const menu = await this.menuRepository.getByChildren(id, this.robot.id)

							if (is_attendment && department_id) {

								const menu = await this.menuRepository.getById(id, this.robot.id)
								const queue = postAttendance.find((id: string) => id === user.id)

								if (!queue) {
									postAttendance.push(id)
									await OpenAttendanceClientFactory(this.messageController).execute(menu, { ...msg, user }, department_id)
									setTimeout(() => {
										postAttendance = postAttendance.filter((id: string) => id !== user.id)
									}, 1000 * 10)
								}

							} else {
								await this.userRepository.saveCurrentMenu(user, id)
								return menuController.sendNextMenu({ ...user, chat: chatId }, id, menu, this.robot.id)
							}
						}
					})
				)

				if (msgNext === false) {

				}

			}
			else
				menuController.sendHomeOrSameMenu({ ...user, chat: chatId })
		})
	}
}