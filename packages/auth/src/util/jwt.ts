import jwt from 'jsonwebtoken'
import { CSRF_TOKEN_KEY, SESSION_TOKEN_KEY } from '../data/constants'
export interface SignedTokenPayload {
    [CSRF_TOKEN_KEY]: string
    [SESSION_TOKEN_KEY]: string
}

const { SIGN_TOKEN_SECRET = 'secret' } = process.env

export const createSignedToken = (payload: SignedTokenPayload) =>
    jwt.sign(
        { [CSRF_TOKEN_KEY]: payload[CSRF_TOKEN_KEY], [SESSION_TOKEN_KEY]: payload[SESSION_TOKEN_KEY] },
        SIGN_TOKEN_SECRET
    )

export const verifySignedToken = (token: string) => jwt.verify(token, SIGN_TOKEN_SECRET) as SignedTokenPayload
