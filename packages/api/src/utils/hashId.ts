import { assertTruthy } from '@yoota/common'
import Hashids from 'hashids'

interface HasNumericId {
    id: number
}

const HASHIDS_SALT = 'ExtremelySecretSaltyBallz'
const hasher = new Hashids(HASHIDS_SALT, 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789')

export const createHashFromNumber = (id: number) => hasher.encode(id)
export const createNumberFromHash = (hash: string) => {
    const [id] = hasher.decode(hash)
    assertTruthy(typeof id === 'number', `Invalid hash: ${hash}`)
    return id as number
}

export const withHashId = <T extends HasNumericId>(obj: T): Omit<T, 'id'> & { id: string } => {
    const { id, ...rest } = obj
    return { ...rest, id: createHashFromNumber(id) }
}

export const hasNumericId = <T extends Partial<HasNumericId>>(value: T): value is T & Omit<T, 'id'> & HasNumericId =>
    'id' in value
