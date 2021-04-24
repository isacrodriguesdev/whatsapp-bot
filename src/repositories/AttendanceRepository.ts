
export interface IAttendanceRepository {
  updateToOnGoing(attendmentId: string): Promise<any>
  updateToWaiting(attendmentId: string): Promise<any>
  updateToClosed(attendmentId: string): Promise<any>
  updateToCancelled(attendmentId: string): Promise<any>
  createAttendance(attendance: any): Promise<any>
  getLastOperator(departmentId: string): Promise<any>
  getRandomOperator(departmentId: string): Promise<any>
  getAttendance(userId: string): Promise<any>
}