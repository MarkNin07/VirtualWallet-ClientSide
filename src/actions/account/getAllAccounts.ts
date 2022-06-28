import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

const getAccountssUrl = 'https://virtualwalletproject.herokuapp.com/get/all/cuentas'

export const getAllAccountsFinal = createAsyncThunk('getAllAccounts', async () => {
    const response = await fetch(getAccountssUrl)
    return (await response.json() as accountType[])
})