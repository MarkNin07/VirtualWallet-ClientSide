import { configureStore } from "@reduxjs/toolkit"; 
import { useDispatch } from 'react-redux'
import usuarioReducer from './state/slice/userSlice'


const store = configureStore({
    reducer:{
        users: usuarioReducer
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()