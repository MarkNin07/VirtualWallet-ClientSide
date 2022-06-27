import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

//cambiar por el endpoint correto
const updateAccountUrl = 'http://localhost:8080/update/cuenta'

export const updateAccount = createAsyncThunk('updateAccount', async(account:accountType)=>{
    const response = await fetch(updateAccountUrl,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(account)
    })
    return (await response.json()) as accountType
})