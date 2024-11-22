// @flow
import * as React from 'react';
import './WordMemory.css'
import { IAnswer, IWord, WordEmpty, words } from './data';
import Grid2 from '@mui/material/Grid2';
import { ArrayFuncs }  from './../../Helpers/ArrayFuncs'
import Modal from '@mui/material/Modal';
import { modalStyle } from '../../Data/constants';
import Box from '@mui/material/Box';
import { Button, Paper, SxProps, Table, TableCell, TableContainer, TableHead, TableRow, Theme } from '@mui/material';
import Countdown from '../Countdown/Countdown';

type BtnColor = 'green' | 'blue' | 'red'
type Props = {

};
export const WordMemory = (props: Props) => {
    const items = words
    const arFuncs = new ArrayFuncs()
    const [cWord, setCWord] = React.useState<IWord>( WordEmpty);
    const [altWords, setAltWords] = React.useState<IWord[]>([]);
    const [attempt, setAttempt] = React.useState<number>(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = React.useState(false)
    const [maxAttempts, setMaxAttempts] = React.useState<number>(10);
    const [answers, setAnswers] = React.useState<IAnswer[]>([])
    const [colorResults, setColorResults ] = React.useState<BtnColor[]>([]);
    const delay: number = 2

    console.log('answers', answers)
// For modal
    const [openModalResult, setOpenModalResult] = React.useState(false);
    const handleModalOpen = () => {
        setOpenModalResult(true);
    }
    const handleModalClose = () => {
        setOpenModalResult(false);
    }
    const [timer, setTimer] = React.useState<number>(delay)

    React.useEffect( () => {
        const item:IWord = items[Math.floor(Math.random()*items.length)];
        setTimer(delay)
        setCWord(item)
        setAltWords(fillAnswers2Choose(item))
    }, [attempt])

    const fillAnswers2Choose = (correctItem:IWord): IWord[] => {
        let allVariants:IWord[] = []
        // add to the start of the array the correct answer
        allVariants.push(correctItem)
        while (allVariants.length < 4) {
            const newValue = items[Math.floor(Math.random()*items.length)];
            if (allVariants.filter(x => x === newValue).length === 0) allVariants.push(newValue)
          }
        allVariants = arFuncs.shuffleArray(allVariants)
        return allVariants
    }

    const checkIfCorrect = (obj1: IWord, obj2: IWord): boolean => {
        return obj1.id === obj2.id
    }
    const targetDate = "2024-12-31T23:59:59";
    const bgStyles: SxProps<Theme> = {
        p: 1,
        background: "rgba(0, 0, 0, 0.3)",
        color: "white",
      };

    return (
        <div>
<h1>WordMemory</h1>


    <Grid2 container>
        {/* <Grid2 size={ { sm: 12, md: 6 } }>
            <div className='word'>{cWord.translate1}</div>
        </Grid2> */}

        <Box sx={bgStyles}><Countdown targetDate={targetDate} /></Box>

        <Grid2 size={ { md: 1} } ></Grid2>

        <Grid2 size={ { sm: 12, md: 10 } } >

        <div  className='gcont'>
            <div className='wordCenter question'>{cWord.translate1}</div>
                {
                altWords.map( (word, index) => {
                    return (
                        <div role='button' key={`btn${word.translate1}`}
                            className={`word ${colorResults[index]} item${index+1}`}
                            onClick={ ()=> {

                                const result = checkIfCorrect(cWord, word)
                                setIsAnswerCorrect(result)
                                const colors: BtnColor[]= []
                                colors[index] = (result && word.id === cWord.id) ? 'green' : 'red'
                                setColorResults(colors)
                                const newAnswers = [...answers]
                                newAnswers.push( { word: cWord, success: result})
                                setAnswers(newAnswers)

                                    handleModalOpen()
                                    let intTimer = timer
                                    const countdown = setInterval(() => {
                                        setTimer((prevTimer) => prevTimer - 1);
                                        intTimer = intTimer - 1
                                        if(intTimer <= 0)  {
                                            clearInterval(countdown);
                                            setAttempt(attempt + 1)
                                            setTimer(delay)
                                            handleModalClose()
                                            setColorResults([])
                                        }
                                    }, 1000);
                        } }
                        >{word.translate2}</div>
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

        <Grid2 size={ 1 } ></Grid2>
        <Grid2 size={ 10 } >
            <Button variant='contained' color='primary' title='End'>End</Button>
        </Grid2>
        <Grid2 size={1 } ></Grid2>

        <Grid2 container>
            <Grid2 sx={bgStyles}>
                <Box >


                    <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Wort</TableCell>
                                <TableCell>Ubersetzung</TableCell>
                                <TableCell>Ergebnis</TableCell>
                            </TableRow>
                        </TableHead>
                {

                    answers.map( (a, index) => {
                            return (
                            <TableRow>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{a.word.translate1}</TableCell>
                                <TableCell>{a.word.translate2} </TableCell>
                                <TableCell>{a.success ? 'Ja!' : 'Nein'}</TableCell>
                            </TableRow>
                        )
                    })
                }
                    </Table>
                    </TableContainer>
                                </Box>
            </Grid2>

        </Grid2>
    </Grid2>

            <Modal
                 open={openModalResult}
                 // open={true}
                onClose={handleModalClose} >
                <Box sx={modalStyle} textAlign={'center'} alignContent={'center'} alignItems={'center'} alignSelf={'center'}>

                    <Grid2 container>
                        <Grid2 size={6}>
                            <div style={{
                                backgroundImage: 'url(/assets/images/iansmile.jpg)',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left top',
                                width: '300px',
                                height: '300px',
                                margin: 'auto',
                                display: 'flex', flexDirection: 'row', alignItems: 'center',
                                justifyContent: 'center'
                            }}></div>

                        </Grid2>
                        <Grid2 size={6}>
                            {
                                isAnswerCorrect ?
                                    <div className='hooray'  >
                                        HOORAY!
                                        <br />
                                        {cWord.translate1}
                                        <br />
                                        = <br />
                                         {cWord.translate2}
                                    </div> :
                                    <div className='hooray error'  >
                                        Error! <br />{cWord.translate1}
                                        <br /> &ne;
                                        <br />
                                        {cWord.translate2}
                                    </div>
                            }
                        </Grid2>
                    </Grid2>




                    <br />
                    <Button variant='contained' color='primary'
                        onClick={() => {
                            setAttempt(attempt + 1)
                            setTimer(delay)
                            handleModalClose()
                            setColorResults([])
                        }
                        }>Close ({timer})</Button>&nbsp;
                </Box>
            </Modal>

        </div>
    );
};