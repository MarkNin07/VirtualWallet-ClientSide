import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionType } from "../../state/slice/transactionSlice";

const getTransactionssUrl = 'http://localhost:8080/getAllTransaccion'

export const getAllTransactions = createAsyncThunk('getAllTransactions', async () => {
    const response = await fetch(getTransactionssUrl)
    return (await response.json() as transactionType[])
})