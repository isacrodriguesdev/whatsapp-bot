import { IAttendanceRepository } from "../../../repositories/AttendanceRepository"
import knexConnection from "../knexConnection"

export class AttendanceRepositoryAdapter implements IAttendanceRepository {

  updateToOnGoing(attendmentId: string): Promise<any> {
    return knexConnection("attendance")
      .where("id", attendmentId).update("status", "ongoing")
  }

  updateToWaiting(attendmentId: string): Promise<any> {
    return knexConnection("attendance")
      .where({
        id: attendmentId,
      }).update("status", "waiting")
  }

  updateToClosed(attendmentId: string): Promise<any> {
    return knexConnection("attendance")
      .where("id", attendmentId).update("status", "closed")
  }

  updateToCancelled(attendmentId: string): Promise<any> {
    return knexConnection("attendance")
      .where("id", attendmentId).update("status", "cancelled")
  }

  createAttendance(attendance: any): Promise<any> {
    return knexConnection('attendance').insert({ ...attendance })
  }

  getRandomOperator(departmentId: string): Promise<any> {
    return knexConnection('operators_bots')
      .where({ 'operators.status': 'active', 'operators_bots.department_id': departmentId })
      .join('operators', function () {
        this.on('operators_bots.operator_id', '=', 'operators.id')
          .onNotExists(function () {
            this.select('*').from('attendance')
              .whereRaw("operators.id = operators_bots.operator_id and attendance.status = 'closed'");
          })
      }).orderByRaw('random()')
      .first()
  }

  getLastOperator(departmentId: string): Promise<any> {
    return knexConnection('attendance')
      .select(
        'attendance.*',
        'operators.first_name',
        'operators.socket_id'
      )
      .join('operators', { 'attendance.operator_id': 'operators.id' })
      .where({
        'attendance.department_id': departmentId
      }).orWhere({
        'attendance.status': "closed",
        'attendance.department_id': departmentId
      })
      .orderBy('created_at', 'desc').first()
  }

  getAttendance(userId: string): Promise<any> {
    return knexConnection('attendance')
      .select(
        'attendance.*',
        'users.name',
        'users.photo',
        'users.chat',
        'users.cpf',
        'users.email',
        'users.phone'
      ).where({
        "attendance.user_id": userId,
        "attendance.status": "ongoing"
      }).orWhere({
        "attendance.user_id": userId,
        "attendance.status": "waiting"
      })
      .join('users', { 'attendance.user_id': 'users.id' })
      .first()
  }
}