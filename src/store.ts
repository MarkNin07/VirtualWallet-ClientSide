import { configureStore } from "@reduxjs/toolkit"; 
import { useDispatch } from 'react-redux'
import usuarioReducer from './state/slice/userSlice'
import loggedInReducer from './state/slice/loggedInSlice'
import verifiedInReducer from './state/slice/verifiedSlice'
import accountReducer from './state/slice/accountSlice'



const store = configureStore({
    reducer:{
        users: usuarioReducer,
        logged: loggedInReducer,
        verified: verifiedInReducer,
        accounts: accountReducer
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()