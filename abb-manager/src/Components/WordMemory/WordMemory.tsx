// @flow
import * as React from 'react';
import './WordMemory.css'
import { IAnswer, IWord, IWordButton, WordEmpty } from './data';
import Grid2 from '@mui/material/Grid2';
import { ArrayFuncs }  from './../../Helpers/ArrayFuncs'
import Box from '@mui/material/Box';
import { Button, Dialog, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from '@mui/material';
import Countdown from '../Countdown/Countdown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { ApiMemory } from '../../Data/ApiMemory';
import dayjs from 'dayjs';
import { ICountDown, ITokens } from '../../Data/interfaces';
import { addItem,  cleanItems} from './../../Store/answerSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import WordReport from '../WordReport/WordReport';

export const bgStyles: SxProps<Theme> = {
    p: 1,
    background: "rgba(0, 0, 0, 0.3)",
    color: "white"
  };
  
type BtnColor = 'green' | 'blue' | 'red'
type Props = {

};
export const WordMemory = (props: Props) => {
    // const items = words
    const arFuncs = new ArrayFuncs()
    const api = new ApiMemory()
    const [cntDown, setCntDown] = React.useState<string>( (new Date()).toDateString())
    const [cWord, setCWord] = React.useState<IWord>( WordEmpty);
    const [altWords, setAltWords] = React.useState<IWordButton[]>([]);
    const [attempt, setAttempt] = React.useState<number>(0);
    const [isLoaded, setIsLoaded] = React.useState(false)
    // const [isAnswerCorrect, setIsAnswerCorrect] = React.useState(false)
    const maxAttempts = 20;
    const [wordsLoaded, setWordsLoaded] = React.useState<boolean>(false);

    // comment for redux
    // const [answers, setAnswers] = React.useState<IAnswer[]>([])

    const answers = useSelector((state: RootState) => state.answers.answers) as IAnswer[];
    const dispatch = useDispatch();


    const [colorResults, setColorResults ] = React.useState<BtnColor[]>([]);
    const delay: number = 1000
    const [isDisabled, setIsDisabled] = React.useState(false)

    const [timer, setTimer] = React.useState<number>(delay)

    const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
    const tokens: ITokens = JSON.parse(isTokenStr)

    const [items, setItems ] = React.useState<IWord[]>([])
    const [timerOut, setTimerOut] = React.useState(true)
    const [showDialog, setShowDialog] = React.useState(false)
    
    const dialogClose = React.useCallback ( () =>{
        setShowDialog(false)
    }, [showDialog])



    const handleTimeOut = () => {
        setTimerOut(true)
      };

    const GetTimer = async():Promise<void> => {
        let  timerEnd: ICountDown =  {endtime: ''}
        try {
            timerEnd = await api.GetTimerEnd(tokens.accessToken)
        } catch( err) {
            console.error(err)
            timerEnd = { endtime: new Date().toString()}
        }

        try {

            if(timerEnd.endtime === '') {
                setIsLoaded(true)
                setIsDisabled(true)
                return
            }

            if (timerEnd.endtime > dayjs().format('YYYY-MM-DDTHH:mm:ss')) {
                setIsDisabled(false)
            } else {
                setIsDisabled(true)
            }
            setCntDown(timerEnd.endtime)
        } catch (ex) {
            console.error(ex)
        }
    }

    const InitialWordLoad = async():Promise<void> => {
        api.GetWordsFromCollection(1).then( res => {
            const items = res.words
            setItems(items)
            setWordsLoaded(true)
         }).catch(err => {
            console.error(err)
            setItems([])
         })
    }

    const SetWordCombination = async() : Promise<void> => {
        const item:IWord = items[Math.floor(Math.random()*items.length)];
        const itemBtns:IWordButton[] = items.map( (x) => {
            return {
                ...x,
                answerSuccess: false
            }
        })
        setAltWords(fillAnswers2Choose(item, items))
        setTimer(delay)
        setCWord(item)

    }

    React.useEffect( () => {
        if(!wordsLoaded) InitialWordLoad()
        GetTimer().then( res => {
            setIsLoaded(true)
        })
    }, [cntDown])

    const fillAnswers2Choose = (correctItem:IWord, allItems: IWord[]): IWordButton[] => {
        let allVariants:IWordButton[] = []
        // add to the start of the array the correct answer
        allVariants.push( correctItem as IWordButton )
        while (allVariants.length < 4) {
            const newValue = allItems[Math.floor(Math.random()*allItems.length)];
            if (allVariants.filter(x => x === newValue).length === 0) allVariants.push(newValue as IWordButton)
          }
        allVariants = arFuncs.shuffleArray(allVariants)
        return allVariants
    }

    const checkIfCorrect = (obj1: IWord, obj2: IWord): boolean => {
        return obj1.id === obj2.id
    }

    

      const renderButton = (word:IWordButton, index:number):JSX.Element  => {
        return (

        <button key={`btn${word.translate1}`}
        className={`button word ${colorResults[index]} item${index+1}`}
        disabled={isDisabled || timerOut}
        onClick={ ()=> {

            setIsDisabled(true)
            const result = checkIfCorrect(cWord, word)

            const colors: BtnColor[]= []
            colors[index] = (result && word.id === cWord.id) ? 'green' : 'red'
            console.log({colors})
            setColorResults(colors)
            const newAnswers = [...answers]
            const newAnswer:IAnswer = { word: cWord, success: result}
            newAnswers.push( )

            const tmpaltWord = {...altWords[index]}
            tmpaltWord.answerSuccess = result
            altWords[index] = tmpaltWord
            console.log('altWords', altWords)
                setAltWords( altWords)

            setTimeout(() => {
                SetWordCombination()

                //setAnswers(newAnswers)
                dispatch(addItem(newAnswer))
                
                api.SaveHistory(tokens.accessToken, newAnswer)
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
    //(dayjs(cntDown).toDate() < dayjs().toDate()) ?
    (timerOut) ?
<Button variant='contained'  sx={{width: '100%'}}
    onClick={ async () => {
        const t =  await api.SetTimer(tokens.accessToken, 'start')
        const newTime = dayjs(t.endtime).format('YYYY-MM-DDTHH:mm:ss')
        dispatch(cleanItems())
        setTimerOut(false)
        setCntDown(newTime)
        GetTimer()
        SetWordCombination()
}}>Start</Button>
:
<Button variant='contained' color='primary' title='End' sx={{width: '100%'}}
onClick={ async () => {
    const t =  await api.SetTimer(tokens.accessToken, 'stop')
        const newTime = dayjs(t.endtime).format('YYYY-MM-DDTHH:mm:ss')
        setTimerOut(true)
        setCntDown(newTime)
        setShowDialog(true)
}}
>End</Button>
}
</Grid2>
<Grid2 size={ { sm: 8 } } sx={{ px: '10px'}}>
<Box sx={bgStyles}><Countdown targetDate={cntDown} onTimeOut={handleTimeOut} isActive={!timerOut} /></Box>
</Grid2>



    <Grid2 size={ { md: 1} } ></Grid2>

    <Grid2 size={ { sm: 12, md: 12 } } >

    {
        !timerOut ?
        <div className='gcont'>
            <div className='wordCenter question'>{cWord.translate1}</div>
            {
                altWords.map((word, index) => {
                    return (
                        renderButton(word, index)
                    )
                })
            }
        </div> : <Box sx={bgStyles}>Press Start to start the game</Box>
    }
    </Grid2>

    <Grid2 size={ { md: 1} } ></Grid2>

    <Grid2 size={ 2 } ></Grid2>
    <Grid2 size={ 7 } >
    <Box sx={bgStyles}>
        Results:  { answers.filter(a=>a.success).length} / {answers.length}</Box>
    </Grid2>
    <Grid2 size={ 2 } ></Grid2>

<Dialog open={showDialog} 
    onClose={() => setShowDialog(false)} 
    style={{ background: 'rgba(0, 0, 0, 0.1) '}}

>
    <WordReport showDialog={ dialogClose} />

</Dialog>

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
                        <TableRow key={`hd_${a.word.translate1}${index}${a.success}`}>
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