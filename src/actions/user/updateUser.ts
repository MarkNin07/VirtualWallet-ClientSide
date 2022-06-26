import { createAsyncThunk } from "@reduxjs/toolkit";
import { userType } from "../../state/slice/userSlice";


const updateUserUrl = 'http://localhost:8080/api/update-user'

export const updateUser = createAsyncThunk('updateUser', async(user:userType)=>{
    const response = await fetch(updateUserUrl,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user)
    })
    return (await response.json()) as userType
})