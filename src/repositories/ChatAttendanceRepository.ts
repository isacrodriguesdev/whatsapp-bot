import { ChatAttendance } from "../entities/ChatAttendance";

export interface ChatAttendanceRepository {
  store(message: ChatAttendance): Promise<any>
}