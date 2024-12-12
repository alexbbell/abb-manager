import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './counterSlice'
import { answerSlice } from './answerSlice'


// ...

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    answers: answerSlice.reducer
    // comments: commentsReducer,
    // users: usersReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
