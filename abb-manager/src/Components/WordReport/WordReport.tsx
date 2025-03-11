import React, { useEffect } from 'react'
import { ApiMemory } from '../../Data/ApiMemory'
import { ITokens } from '../../Data/interfaces'
import { emptyGameReport, IGameReport } from '../WordMemory/data'
import Box from '@mui/material/Box'
import { Button, Divider } from '@mui/material'


type Props = {
    showDialog: () => void,
}
export default function WordReport(props:Props) {
    const [report, setReport ] = React.useState<IGameReport>(emptyGameReport)
    const api = new ApiMemory()
    const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
    const tokens: ITokens = JSON.parse(isTokenStr)
    const closeClick = () => {
        props.showDialog()
    }
    useEffect( () => {
        api.RenderGameReport(tokens.accessToken).then(res => {
            setReport(res)
        }).catch(err => {
            console.error(err)
        })

    }, [])

  return (
      <Box >

          <div className=' report'>
              <h1>Statistics</h1>
              <div> Attemps:  {report.attempts}</div>
              <Divider />
              <div> The time:  {report.theTime}</div>

              <Divider />
              <div> Correct answers:  {report.correctAnswers}</div>
              <Divider />
              <div> Incorrect answers:  {report.attempts - report.correctAnswers}</div>
          <div style={{ justifySelf: 'center'}}>
            <Button variant='contained' type='button' color='success'
            onClick={closeClick}
            >Close</Button>
            </div>
            </div>
      </Box>

  )
}
