import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

//cambiar por el endpoint correcto
const createAccountUrl = 'http://localhost:8080/create/cuenta'

export const createAccount = createAsyncThunk('createAccount', async(account:accountType)=>{
    const response = await fetch(createAccountUrl,{
        method:'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(account)
    })
    return (await response.json()) as accountType;
})