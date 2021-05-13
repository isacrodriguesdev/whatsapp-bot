import { App } from './src/App'
import { TransmissionTelegramControllerAdapter } from './src/infra/telegram/infra/controllers/TransmissionTelegramControllerAdapter'
import { TransmissionWhatsappControllerAdapter } from './src/infra/whatsapp/infra/controllers/TransmissionWhatsappControllerAdapter'
import { BotRepositoryAdapter } from './src/infra/knex/adapters/BotRepository.Adapter'
// transmissions
import { TransmissionWhatsappRepositoryAdapter } from './src/infra/whatsapp/infra/adapters/knex/TransmissionRepository.Adapter'
// menu
import { MenuRepositoryAdapter } from './src/infra/knex/adapters/MenuRepository.Adapter'
import { MenuBuilder } from './src/builders/MenuBuilder'
// user
import { UserRepositoryAdapter } from './src/infra/knex/adapters/UserRepository.Adapter'
// attendments
// socket
import { SocketControllerFactory } from './src/infra/socketio/factories/SocketControllerFactory'
import { AttendanceRepositoryAdapter } from './src/infra/knex/adapters/AttendanceRepository.Adpter'
import { MessageControllerAdapter } from './src/infra/controllers/MessageController.Adapter'
import { WhatsappBotControllerAdapter } from './src/infra/whatsapp/WhatsappBot.Adapter'

const botRepositoryAdapter = new BotRepositoryAdapter()
const userRepositoryAdapter = new UserRepositoryAdapter()

const socketControllerFactory = SocketControllerFactory()
// faça 2 seletores knex para multi plataforma

botRepositoryAdapter.getAll()
	.then(async robots => {

		const controllers = robots.map(async robot => {

			console.log("🔥", robot.username, "iniciado")

			const botController = new WhatsappBotControllerAdapter()
			await botController.initialize(`session-${robot.id}`)

			const menuRepositoryAdapter = new MenuRepositoryAdapter()

			const menuBuilder = new MenuBuilder(menuRepositoryAdapter, botRepositoryAdapter)
			// @ts-ignore
			const messageController = new MessageControllerAdapter(botController, menuBuilder)
			const attendanceRepository = new AttendanceRepositoryAdapter()
			const transmissionRepository = new TransmissionWhatsappRepositoryAdapter()
			const transmissionController = new TransmissionWhatsappControllerAdapter()

			const appController = new App(
				robot,
				// @ts-ignore
				botController,
				messageController,
				menuRepositoryAdapter,
				userRepositoryAdapter,
				attendanceRepository,
			)

			transmissionController.execute(
				// @ts-ignore
				botController,
				transmissionRepository,
				messageController,
				robot.id
			)

			appController.execute()

			return {
				id: robot.id,
				botController,
				messageController
			}
		})

		const bots = await Promise.all(
			controllers.map(async data => {
				return data
			})
		)

		socketControllerFactory.execute(bots)
	})
