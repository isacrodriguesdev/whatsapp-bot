import { MsgRequest } from "../protocols/MsgRequest"

export function getMsgType(msg: MsgRequest) {
  if (msg.photo) return "photo"
  else if (msg.voice) return "voice"
  else if (msg.video) return "video"
  else if (msg.video_note) return "video_note"
  else if (msg.document) return "document"
  else if (msg.contact) return "contact"
  else if (msg.audio) return "audio"
  else if (msg.game) return "game"
  else if (msg.sticker) return "sticker"
  else if (msg.location) return "location"
  else return "text"
}

export function isNumber(value: any = "") {
  if(value === "") {
    return false
  } else {
    return !isNaN(value)
  }
}