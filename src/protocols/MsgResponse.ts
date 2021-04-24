export interface MsgResponse {
  type: "text" | "voice" | "location" | "video" | "photo" | "document" | "contact" // tipo de mensagem
  message: string  // messagem
  file: string // qualquer tipo de arquivo
  location: string // localização
  phone_firstname: string // nome para contato
  phone_number: string // numero de telefone
}