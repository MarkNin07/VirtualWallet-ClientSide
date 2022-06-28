import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionType } from "../../state/slice/transactionSlice";

const getTransactionssUrl = 'https://virtualwalletproject.herokuapp.com/getAllTransaccion'

export const getAllTransactions = createAsyncThunk('getAllTransactions', async () => {
    const response = await fetch(getTransactionssUrl)
    return (await response.json() as transactionType[])
})