import { createSlice } from "@reduxjs/toolkit";

const initialState={
    emailVerifiedState:false,
}


const verifiedInSlice = createSlice({
    name:'verified',
    initialState,
    reducers:{
        verifiedInInReducer(state,action){
            const stateLoggedIn = {...state, emailVerified: action.payload}
            return stateLoggedIn
        }       
    }
})

export default verifiedInSlice.reducer
export const {verifiedInInReducer} = verifiedInSlice.actions