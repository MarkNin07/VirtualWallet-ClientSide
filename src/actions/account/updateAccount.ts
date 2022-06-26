import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

//cambiar por el endpoint correto
const updateAccountUrl = 'algun endpoint de put'

export const updateUser = createAsyncThunk('updateUser', async(account:accountType)=>{
    const response = await fetch(updateAccountUrl,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(account)
    })
    return (await response.json()) as accountType
})