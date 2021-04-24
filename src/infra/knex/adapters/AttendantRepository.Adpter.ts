import { IAttendantRepository } from "../../../repositories/AttendantRepository"
import knexConnection from "../knexConnection"

export class AttendantRepositoryAdapter implements IAttendantRepository {

  getServiceWaiting(departmentId: string): Promise<any[]> {
    return knexConnection('operators_bots')
      .select(
        'operators.socket_id',
        'operators_bots.attendant_id',
      )
      .where({
        "operators_bots.department_id": departmentId,
        "attendance_waiting.provided": true
      })
      .join('operators', { 'operators.id': 'operators_bots.attendant_id' })
      .join('attendance_waiting', { 'operators_bots.attendant_id': 'attendance_waiting.attendant_id' })
      .first()
  }

  getOne(attendantId: string): Promise<any> {
    return knexConnection('operators')
      .where("id", attendantId)
  }

  update(attendantId: string, data: any): Promise<any> {
    return knexConnection('operators')
      .where("id", attendantId)
      .update({ ...data })
  }

}