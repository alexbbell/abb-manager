import React, { useEffect } from 'react'
import { ApiMemory } from '../../Data/ApiMemory'
import { ITokens } from '../../Data/interfaces'
import { emptyGameReport, IGameReport } from '../WordMemory/data'

export default function WordReport() {
    const [report, setReport ] = React.useState<IGameReport>(emptyGameReport)
    const api = new ApiMemory()
    const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
    const tokens: ITokens = JSON.parse(isTokenStr)

    useEffect( () => {
        api.RenderGameReport(tokens.accessToken).then(res => {
            console.log('r', res)
            setReport(res)
        }).catch(err => {
            console.error(err)
        })

    }, [])

  return (
    <div style={{ background: '#FFF'}}>
        <h1>WordReport</h1>
        <div> Attemps:  {report.attempts}</div>
        <div> The time:  {report.theTime}</div>
        <div> Correct answers:  {report.correctAnswers}</div>
        <div> Incorrect answers:  {report.attempts - report.correctAnswers}</div>


    </div>

  )
}
