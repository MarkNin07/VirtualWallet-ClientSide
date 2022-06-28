import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountType } from "../../state/slice/accountSlice";

const updateAccountUrl = 'https://virtualwalletproject.herokuapp.com/update/cuenta'

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