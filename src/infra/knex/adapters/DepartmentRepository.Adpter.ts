import knexConnection from "../knexConnection"

export class DepartmentRepositoryAdapter {

  getOne(department_id: string): Promise<any[]> {
    return knexConnection('departments')
      .select("*")
      .where({ id: department_id })
      .first()
  }
}