import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { posibleStatus } from "./userSlice"

type accountType = {
    id: string | undefined,
    correoUsuario: string | undefined,
    monto: number | undefined
}


interface initialStateAccountType {
    accounts: accountType[]
    status: posibleStatus
    error: string | null
}

const initialState: initialStateAccountType ={
    accounts:[],
    status: posibleStatus.IDLE,
    error: null,
}

const accountSlice = createSlice({
    name:'accounts',
    initialState,
    reducers:{

    },
    extraReducers: (builder)=>{

    }
})

export type {accountType}
export type {initialStateAccountType}
export default accountSlice.reducer

//extra reducers
export const selectAccountsState = () => (state:RootState) => state.accounts.accounts
export const selectAccountsStatus = () => (state:RootState) => state.accounts.status
export const selectAccountsFetchError = () => (state:RootState) => state.accounts.error