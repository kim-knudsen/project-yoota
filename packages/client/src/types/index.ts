import type { RouterOutput } from '@yoota/api'

export type Me = RouterOutput['me']
export type Event = RouterOutput['event']['byId']
export type Participant = Event['participants'][0]
export type User = Me
export type TimeZone = RouterOutput['timeZone']['all'][0]
export type Option = Event['options'][0]
export type Callback = () => void
