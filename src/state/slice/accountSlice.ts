import { createSlice } from '@reduxjs/toolkit'
import { createAccount } from "../../actions/account/createAccount"
import { getAllAccountsFinal } from "../../actions/account/getAllAccounts"
import { updateAccount } from "../../actions/account/updateAccount"
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
        //GET account
        builder.addCase(getAllAccountsFinal.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(getAllAccountsFinal.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.accounts = action.payload
        })
        builder.addCase(getAllAccountsFinal.rejected,(state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se solicitaba la información"
            state.accounts = []
        })

        //POST account
        builder.addCase(createAccount.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(createAccount.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.accounts.push(action.payload)
        })
        builder.addCase(createAccount.rejected,(state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se enviaba la información"            
        })

        //PUT account
        builder.addCase(updateAccount.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(updateAccount.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            let accountUpdated = state.accounts.filter(account=>account.id===action.payload.id)[0]
            let positionAccountUpdated = state.accounts.indexOf(accountUpdated)
            state.accounts[positionAccountUpdated] = action.payload
        })
        builder.addCase(updateAccount.rejected,(state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se actualizaba la información"            
        })
    }
})

export type {accountType}
export type {initialStateAccountType}
export default accountSlice.reducer

//extra reducers
export const selectAccountsState = () => (state:RootState) => state.accounts.accounts
export const selectAccountsStatus = () => (state:RootState) => state.accounts.status
export const selectAccountsFetchError = () => (state:RootState) => state.accounts.error