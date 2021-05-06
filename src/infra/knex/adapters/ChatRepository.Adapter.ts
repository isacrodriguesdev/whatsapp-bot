import knexConnection from "../knexConnection";

export class ChatRepositoryAdapter {

	store(message: any) {
		return knexConnection('attendment_messages')
			.insert(message)
	}
}