export interface IAccount {
    login: string,
    password: string,
}
export const emptyAuthParams: IAccount = {
    login: '', password: ''
}

export interface ITokens {
    accessToken: string,
    refreshToken: string,
}
export interface IAuthResponse {
    loginSuccess: boolean,
    loginResultMessage: string,
    tokens?: ITokens,
}