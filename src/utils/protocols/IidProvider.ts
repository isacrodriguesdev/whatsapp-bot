export type uuid = string
export interface IidProvider {
    newID(): string
}