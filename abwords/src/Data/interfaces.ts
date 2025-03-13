export interface IAccount {
    login: string,
    password: string,
    rememberMe: boolean,
}
export const emptyAuthParams: IAccount = {
    login: '', password: '', rememberMe: false
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

export interface IBaseItem {
    id: number,
    name: string
}

export interface IMoveFiles {
    postId: number,
    files: string[]
}
export interface IBlog {
    title: string;
    preview: string;
    imageUrl: string;
    categoryName: string;
    categoryId: number;
    isDeleted: boolean;
    theText: string;
    id: number;
    pubDate: Date;
    updDate: Date;
}

export interface IBlogReponse {
    blogItems: IBlog[],
    total: number
}
export const emptyBlog:IBlog = {
    title: "",
    preview: "",
    imageUrl: "",
    theText: '',
    categoryName: "",
    categoryId: 0,
    isDeleted: false,
    id: 0,
    pubDate: new Date(),
    updDate: new Date()
}

export interface IOperationResult {
    isSuccess: boolean,
    message: string
}

export interface ICountDown {
    endtime: string,
}