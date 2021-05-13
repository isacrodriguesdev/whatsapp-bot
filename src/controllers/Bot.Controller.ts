import { MsgRequest } from "../protocols/MsgRequest";
import { MsgResponse } from "../protocols/MsgResponse";

export type BotControllerCallback = (message: any) => Promise<void>

export interface BotController {
    initialize(session: string): Promise<any>
    onMessage(callback: BotControllerCallback): void
    sendText(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendPhoto(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendAudio(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendVideo(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendLocation(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendDocument(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    sendContact(chatId: string | number, message: MsgResponse, options?: any): Promise<any>
    getFile(fileId: string): Promise<any>
    getFileLink(fileId: string): Promise<any>
    downloadFileChat(message: any): Promise<string>
    getAndDownloadUserPhoto(message: any): Promise<string>,
    getAllGroups(): Promise<any>
    getTransmissionUsers(limit?: number): Promise<any[]>
    isConnected(): Promise<boolean>
}