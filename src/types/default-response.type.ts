export type DefaultResponseType = {
    error: boolean,
    message: string,
    validation?: {
        key: string,
        message: string
    }
}