import { createSlice } from "@reduxjs/toolkit"
import { createTransaction } from "../../actions/transactions/createTransaction"
import { RootState } from "../../store"
import { posibleStatus } from "./userSlice"

type transactionType = {
    id: string | undefined,
    fecha: string | undefined,
    correoOrigen: string | undefined,
    correoDestino: string | undefined,
    valor: Number | undefined,    
}

interface initialStateTransactionsType {
    transactions: initialStateTransactionsType[]
    status: posibleStatus
    error: string | null
}

const initialState: initialStateTransactionsType ={
    transactions:[],
    status: posibleStatus.IDLE,
    error: null,
}

const transactionSlice = createSlice({
    name:'transactions',
    initialState,
    reducers:{

    },
    extraReducers: (builder) =>{
        //post create transaction
        builder.addCase(createTransaction.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(createTransaction.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.transactions.push(action.payload)
        })
        builder.addCase(createTransaction.rejected,(state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se solicitaba la información"
        })
    }
})

export type {transactionType}
export type {initialStateTransactionsType}
export default transactionSlice.reducer

//extra reducers
export const selectTransactionsState = () => (state:RootState) => state.accounts.accounts
export const selectTransactionsStatus = () => (state:RootState) => state.accounts.status
export const selectTransactionsFetchError = () => (state:RootState) => state.accounts.error