
export interface IAttendantRepository {
  getOne(attendantId: string): Promise<any>
  update(attendantId: string, data: any): Promise<any>
}