
import { MenuRepository } from "../../../repositories/MenuRespository"
import knexConnection from "../knexConnection"
export class MenuRepositoryAdapter implements MenuRepository {

  constructor() {
  }

  getByChildren(parent: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus").where({ parent: parent, branch_id: botId }).orderBy("order", "asc")
  }

  getById(parent: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus")
      .where({ id: parent, branch_id:botId })
  }

  getOneById(parent: string | null, botId: string): Promise<any[]> {
    return knexConnection("menus")
      .where({ id: parent, branch_id:botId })
  }
}