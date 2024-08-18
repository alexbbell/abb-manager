console.log('process.env', process.env)

export interface IConstant {
    mainApiUrl: string,
}
const siteObjectsDev:IConstant = {
    mainApiUrl: "https://localhost:5001/api/"
}

const siteObjectsProd:IConstant = {
    mainApiUrl: "https://alexey.beliaeff.ru:5001/api/"
}

export const SiteVars: IConstant = (process.env.REACT_APP_ENV === "dev") ? siteObjectsDev : siteObjectsProd

