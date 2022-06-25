import { createAsyncThunk } from "@reduxjs/toolkit";
import { userType } from '../state/slice/userSlice'

//mock API
const getUsersUrl = 'http://localhost:8080/api/get-users'

export const getAllUsers = createAsyncThunk('getAllUsers', async () => {
    const response = await fetch(getUsersUrl)
    return (await response.json() as userType[])
})
