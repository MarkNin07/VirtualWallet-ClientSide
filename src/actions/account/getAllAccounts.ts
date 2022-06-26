import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

//cambiar por el endpoint correcto
const getAccountssUrl = 'url de accounts'

export const getAllAccounts = createAsyncThunk('getAllAccounts', async () => {
    const response = await fetch(getAccountssUrl)
    return (await response.json() as accountType[])
})