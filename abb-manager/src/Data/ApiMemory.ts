import { error } from "console"
import { SiteVars } from "./constants"
import { IAccount, IAuthResponse, IBaseItem, IBlog, IBlogReponse, ICountDown, IMoveFiles, IOperationResult } from "./interfaces"
import axios from "axios"
import { parseJwt } from "../Helpers/AuthFunc"

export class ApiMemory {

    private _catUrl = `${SiteVars.mainApiUrl}Categories`
    private _apiUrl = `${SiteVars.mainApiUrl}`

    constructor(environment: string) {

    }

    SetTimer = async (token: string):Promise<ICountDown> => {
        const t = parseJwt(token)
        const userName = t['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        return new Promise<ICountDown>( (resolve, reject) => {
            const url = `https://localhost:7168/api/Countdowns?username=${userName}`
            console.log('url', url)
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({username: userName})
            }
            fetch(url, requestOptions)
                .then(res => res.json())
                .then(result => {
                    console.log('res1', result)
                    resolve(result)
                }).catch(err => {
                console.error(err)
                reject( { endTime: ''})
            })
        })
    }

    GetTimerEnd = async (token: string):Promise<ICountDown> => {
        const t = parseJwt(token)
        const userName = t['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']

        return new Promise<ICountDown>( (resolve, reject) => {
            const url = `${this._apiUrl}Countdowns/${userName}`
            console.log('url', url)
            fetch(url)
                .then(res => res.json())
                .then(result => {
                    if(result === '0001-01-01T00:00:00') reject( { endTime: ''})
                    resolve({ endtime: result })
                }).catch(err => {
                console.error(err)
                reject( { endtime: ''})
            })
        })
    }



}