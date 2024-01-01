export enum AnalyticsPlatform {
    MOBILE = 'mobile',
    WEB = 'web',
    API = 'api'
}

export interface AnalyticsEvent {
    type: string
    platform: AnalyticsPlatform
    meta?: unknown
}
