interface ChatRepository {
    getOne(chat_id: string|number):Promise<Chat>
  }