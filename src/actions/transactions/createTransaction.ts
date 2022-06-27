import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionType } from "../../state/slice/transactionSlice";

//cambiar por el endpoint correcto
const createTransactionUrl = 'http://localhost:8080/createTransaccion'

export const createTransaction = createAsyncThunk('createTransaction', async(transaction:transactionType)=>{
    const response = await fetch(createTransactionUrl,{
        method:'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(transaction)
    })
    return (await response.json()) as transactionType;
})