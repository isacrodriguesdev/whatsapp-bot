
export interface ChatAttendance {
  id: string
  attendment_id: string
  message_id: number | null
  type: "photo" | "voice" | "video" | "video_note" | "document" | "contact" | "audio" | "game" | "sticker" | "location" | "text"
  text: string | null
  file?: string | null
  sender: string
  contact_phone_number?: string
  contact_first_name?: string
  contact_user_id?: number
  created_at: Date
}