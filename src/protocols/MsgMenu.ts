export interface IMenuMessageText {
  type: "text" // tipo de mensagem
  message: string // messagem
}
export interface IMenuMessageVideo {
  type: "video"  // tipo de mensagem
  message?: string | undefined // messagem
  file: string | undefined // qualquer tipo de arquivo (URL)
}
export interface IMenuMessagePhoto {
  type: "photo" // tipo de mensagem
  message?: string | undefined // messagem
  file: string | undefined // qualquer tipo de arquivo (URL)
}
export interface IMenuMessageDocument {
  type: "document"  // tipo de mensagem
  message?: string | undefined // messagem
  file: string | undefined // qualquer tipo de arquivo (URL)
}
export interface IMenuMessageContact {
  type: "contact" // tipo de mensagem
  message?: string | undefined // messagem
  phone_fisrtname: string | undefined// nome para contato
  phone_number: string | undefined // numero de telefone
}
export interface IMenuMessageVoice {
  type: "voice"
  file: string
  message?: string | undefined // messagem
}
