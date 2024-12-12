import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAnswer } from '../Components/WordMemory/data'

export interface CounterState {
  answers: IAnswer[],
}

const initialState: CounterState = {
  answers: [],
}

export const answerSlice = createSlice({
  name: 'answerSlice',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IAnswer>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.answers.push(action.payload)
    },
    cleanItems: (state) => {
      state.answers = []
    }

  },
})

// Action creators are generated for each case reducer function
export const { addItem, cleanItems } = answerSlice.actions

export default answerSlice.reducer
