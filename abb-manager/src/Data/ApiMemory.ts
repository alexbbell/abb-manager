import { SiteVars } from "./constants"
import { ICountDown } from "./interfaces"
import axios from "axios"
import { parseJwt } from "../Helpers/AuthFunc"
import { IWord, IWordsResponse } from "../Components/WordMemory/data"


export class ApiMemory {

    private _apiUrl = `${SiteVars.mainApiUrl}`
    private _cntdwnUrl = `${SiteVars.mainApiUrl}Countdowns/`


    SetTimer = async (token: string, option: 'start' | 'stop' ):Promise<ICountDown> => {
        const t = parseJwt(token)
        const userName = t['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        return new Promise<ICountDown>( (resolve, reject) => {
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userName: userName, action: option})
            }
            fetch(this._cntdwnUrl, requestOptions)
                .then(res => res.json())
                .then(result => {
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
            const url = `${this._cntdwnUrl}${userName}`
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


    SaveHistory = async (token: string, word: IWord) => {
        const t = parseJwt(token)
        const userName = t['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        const url: string = `${this._cntdwnUrl}`
    }


    GetWordsFromCollection = async (): Promise<IWordsResponse> => {
        const url = `${this._apiUrl}Word/collections/8`
        return new Promise<IWordsResponse>((resolve, reject) => {

            axios(url)
                .then(result => {
                    const t: IWordsResponse = {
                        words: result.data[0].WordsCollection,
                    }
                    resolve(t)
                }).catch(err => {
                    console.error(err)
                    reject({ words: [], isError: true, errorText: err })
                })
        })
    }



}