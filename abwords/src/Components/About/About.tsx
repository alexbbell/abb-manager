import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { IAnswer } from '../WordMemory/data';

import { ITokens } from '../../Data/interfaces';
import { ApiServices } from '../../Data/ApiServices';
import Grid2 from '@mui/material/Grid2';
import { Box } from '@mui/material';
import { bgStyles } from '../WordMemory/WordMemory';

function About(props) {
    const answers = useSelector((state: RootState) => state.answers.answers) as IAnswer[];
    const dispatch = useDispatch();

    const isTokenStr:string = localStorage.getItem('tokens')?? '{}'
    const tokens: ITokens = JSON.parse(isTokenStr)
    const [text, setText] = useState('')
    const api = new ApiServices()


    useEffect( () => {
        api.GetUserInfo(tokens.accessToken)
            .then(res => {
                console.log('res.theResponse', res.theResponse)
                setText(res.theResponse??'')
            }).catch(err => {
                console.error(err)
            })

    }, [])
  return (
    <>
          <Grid2 container>
              <Box sx={bgStyles}>
                  <h1>About</h1>
                  <div>The text: {text}</div>
              </Box>
          </Grid2>

    </>
  )
}

About.propTypes = {}

export default About
