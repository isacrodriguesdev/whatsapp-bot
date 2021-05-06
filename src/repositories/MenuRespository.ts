export interface MenuRepository {
    getByChildren(parent: string | null, botId: string): Promise<any[]>
    getById(id: string | null, botId: string): Promise<any[]>
    getOneById(id: string | null, botId: string): Promise<any>
  }