import { createAsyncThunk } from '@reduxjs/toolkit';
import { userType } from '../../state/slice/userSlice'

const createUserUrl = 'https://virtualwalletproject.herokuapp.com/post/user' 

export const createUser = createAsyncThunk('createUser', async(user:userType)=>{
    const response = await fetch(createUserUrl,{
        method:'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user)
    })
    return (await response.json()) as userType;
})