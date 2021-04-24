import { v4 as uuid } from 'uuid'
import { IidProvider } from '../protocols/IidProvider'

class UuidAdapter implements IidProvider {

    newID(): string {
        return uuid()
    }

}
export default new UuidAdapter()
