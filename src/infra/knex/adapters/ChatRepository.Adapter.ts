import knexConnection from "../knexConnection";

export class ChatRepositoryAdapter {

	store(message: any) {
		return knexConnection('chat_attendance')
			.insert(message)
	}
}