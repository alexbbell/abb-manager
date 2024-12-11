// @flow
import * as React from 'react';
import './WordMemory.css'
import { IAnswer, IWord, IWordButton, WordEmpty, words } from './data';
import Grid2 from '@mui/material/Grid2';
import { ArrayFuncs }  from './../../Helpers/ArrayFuncs'
import Box from '@mui/material/Box';
import { Button, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from '@mui/material';
import Countdown from '../Countdown/Countdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { ApiMemory } from '../../Data/ApiMemory';
import dayjs from 'dayjs';
import { ITokens } from '../../Data/interfaces';
import { parseJwt } from '../../Helpers/AuthFunc';

type BtnColor = 'green' | 'blue' | 'red'
type Props = {

};
export const WordMemory = (props: Props) => {
    const items = words
    const arFuncs = new ArrayFuncs()
    const api = new ApiMemory(process.env.REACT_APP_ENV??'')
    const [cntDown, setCntDown] = React.useState<string>( (new Date()).toDateString())
    const [cWord, setCWord] = React.useState<IWord>( WordEmpty);
    const [altWords, setAltWords] = React.useState<IWordButton[]>([]);
    const [attempt, setAttempt] = React.useState<number>(0);
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isAnswerCorrect, setIsAnswerCorrect] = React.useState(false)
    const [maxAttempts, setMaxAttempts] = React.useState<number>(10);
    const [answers, setAnswers] = React.useState<IAnswer[]>([])
    const [colorResults, setColorResults ] = React.useState<BtnColor[]>([]);
    const delay: number = 2000
    const [isDisabled, setIsDisabled] = React.useState(false)

    const [timer, setTimer] = React.useState<number>(delay)

    const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
    const tokens: ITokens = JSON.parse(isTokenStr)


    console.log({tokens})


    const GetTimer = async():Promise<void> => {
        const timerEnd = await api.GetTimerEnd(tokens.accessToken)
        console.log('timerEnd', timerEnd)
        if(timerEnd.endtime === '') {
            return
        }

        try {
            if (timerEnd.endtime > dayjs().format('YYYY-MM-DDTHH:mm:ss')) {
                console.log('less')
                setIsDisabled(false)
            } else {
                console.log('more')
                setIsDisabled(true)
            }
            setCntDown(timerEnd.endtime)
        } catch (ex) {
            console.error(ex)
        }
        setIsLoaded(true)
    }

    React.useEffect( () => {
        GetTimer()
        const item:IWord = items[Math.floor(Math.random()*items.length)];
        const itemBtns:IWordButton[] = items.map( (x) => {
            return {
                ...x,
                answerSuccess: false
            }
        })
        setTimer(delay)
        setCWord(item)
        setAltWords(fillAnswers2Choose(item))

    }, [attempt])

    const fillAnswers2Choose = (correctItem:IWord): IWordButton[] => {
        let allVariants:IWordButton[] = []
        // add to the start of the array the correct answer
        allVariants.push( correctItem as IWordButton )
        while (allVariants.length < 4) {
            const newValue = items[Math.floor(Math.random()*items.length)];
            if (allVariants.filter(x => x === newValue).length === 0) allVariants.push(newValue as IWordButton)
          }
        allVariants = arFuncs.shuffleArray(allVariants)
        return allVariants
    }

    const checkIfCorrect = (obj1: IWord, obj2: IWord): boolean => {
        return obj1.id === obj2.id
    }

    const bgStyles: SxProps<Theme> = {
        p: 1,
        background: "rgba(0, 0, 0, 0.3)",
        color: "white"
      };

      const renderButton = (word:IWordButton, index:number):JSX.Element  => {
        return (

        <button key={`btn${word.translate1}`}
        className={`button word ${colorResults[index]} item${index+1}`}
        disabled={isDisabled}
        onClick={ ()=> {

            setIsDisabled(true)
            const result = checkIfCorrect(cWord, word)
            const colors: BtnColor[]= []
            colors[index] = (result && word.id === cWord.id) ? 'green' : 'red'
            console.log({colors})
            setColorResults(colors)
            const newAnswers = [...answers]
            newAnswers.push( { word: cWord, success: result})
            altWords[index].answerSuccess = result
            console.log('altWords', altWords)
                setAltWords( altWords)

            setTimeout(() => {

                setAnswers(newAnswers)
                setTimer(delay)
                setAttempt(attempt + 1)
                setColorResults([])
                setIsDisabled(false)
            }, delay);
    }}> <span className='buttonContent'>{word.translate2}</span>


    {
    (colorResults[index] === 'red') ?  <ClearIcon sx={{ color: 'red', textAlign: 'right', justifyContent: 'right'}} /> : ''
        }
    {
    (colorResults[index] === 'green') ?<CheckCircleOutlineIcon sx={{ color: 'green'}} /> : ''
        }

    </button>
    )
      }


    return (
        <div>
<h1>WordMemory</h1>


{
    !isLoaded ?
     <>Loading... </> :
    <Grid2 container>
     <Grid2 size={ { sm: 2 }} sx={{ px: '10px'}} >


{
    (dayjs(cntDown).toDate() < new Date()) ?
<Button variant='contained'  sx={{width: '100%'}}
    onClick={ async () => {
        const t =  await api.SetTimer(tokens.accessToken, 'start')
        const newTime = dayjs(t.endtime).format('YYYY-MM-DDTHH:mm:ss')
        console.log('ttimer', newTime)
        setCntDown(newTime)
        GetTimer()
}}>Start</Button>
:
<Button variant='contained' color='primary' title='End' sx={{width: '100%'}}
onClick={ async () => {
    const t =  await api.SetTimer(tokens.accessToken, 'stop')
        const newTime = dayjs(t.endtime).format('YYYY-MM-DDTHH:mm:ss')
        console.log('ttimer', newTime)
        setCntDown(newTime)
}}
>End</Button>
}
</Grid2>
<Grid2 size={ { sm: 8 } } sx={{ px: '10px'}}>
<Box sx={bgStyles}><Countdown targetDate={cntDown} /></Box>

</Grid2>



    <Grid2 size={ { md: 1} } ></Grid2>

    <Grid2 size={ { sm: 12, md: 12 } } >

    <div  className='gcont'>

        <div className='wordCenter question'>{cWord.translate1}</div>
            {
            altWords.map( (word, index) => {
                return (
                    renderButton(word, index)
                )
            })
        }</div>
    </Grid2>

    <Grid2 size={ { md: 1} } ></Grid2>

    <Grid2 size={ 2 } ></Grid2>
    <Grid2 size={ 7 } >
    <Box sx={bgStyles}>
        Results:  { answers.filter(a=>a.success).length} / {answers.length}</Box>
    </Grid2>
    <Grid2 size={ 2 } ></Grid2>


    <Grid2 container>
        <Grid2 sx={bgStyles} size={12}>
            <Box >


                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow key={'hdrrow'}>
                            <TableCell>#</TableCell>
                            <TableCell>Wort</TableCell>
                            <TableCell>Ubersetzung</TableCell>
                            <TableCell>Ergebnis</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
            {

                answers.map( (a, index) => {
                        return (
                        <TableRow key={`hd_${a.word.translate1}${a.success}`}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{a.word.translate1}</TableCell>
                            <TableCell>{a.word.translate2} </TableCell>
                            <TableCell>{a.success ? 'Ja!' : 'Nein'}</TableCell>
                        </TableRow>
                    )
                })
            }
                </TableBody>
                </Table>
                </TableContainer>
                            </Box>
        </Grid2>

    </Grid2>
</Grid2>
}




        </div>
    );
};