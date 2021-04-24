
import { MenuRepository } from "../../../repositories/MenuRespository"
import knexConnection from "../knexConnection"
export class MenuRepositoryAdapter implements MenuRepository {

  constructor() {
  }

  getByChildren(children: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus").where({ children: children, bot_id:botId }).orderBy("order", "asc")
  }

  getById(children: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus")
      .where({ id: children, bot_id:botId })
  }

  getOneById(children: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus")
      .where({ id: children, bot_id:botId })
  }
}