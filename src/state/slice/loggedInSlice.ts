import { createSlice } from '@reduxjs/toolkit';

const initialState={
    emailState:null,
}

const loggedInSlice = createSlice({
    name:'logged',
    initialState,
    reducers:{
        logInInReducer(state,action){
            const stateLoggedIn = {...state, emailState: action.payload}
            return stateLoggedIn
        },
        logOutInReducer(){
            return { emailState: null}
        }
    }
})

export default loggedInSlice.reducer
export const {logInInReducer, logOutInReducer} = loggedInSlice.actions