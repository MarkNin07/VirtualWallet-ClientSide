import { createSlice } from "@reduxjs/toolkit"
import { createTransaction } from "../../actions/transactions/createTransaction"
import { getAllTransactions } from "../../actions/transactions/getAllTransactions"
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
    transactions: transactionType[]
    status: posibleStatus
    error: string | null
}

const initialState: initialStateTransactionsType ={
    transactions:[],
    status: posibleStatus.IDLE,
    error: null,
}

const transactionSlice = createSlice({
    name:'transacciones',
    initialState,
    reducers:{

    },
    extraReducers: (builder) =>{
        //getAllUsers
        builder.addCase(getAllTransactions.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(getAllTransactions.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.transactions = action.payload
        })
        builder.addCase(getAllTransactions.rejected, (state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se solicitaba la información"
            state.transactions = []
        })
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
export const selectTransactionsState = () => (state:RootState) => state.transactions.transactions
export const selectTransactionsStatus = () => (state:RootState) => state.transactions.status
export const selectTransactionsFetchError = () => (state:RootState) => state.transactions.error