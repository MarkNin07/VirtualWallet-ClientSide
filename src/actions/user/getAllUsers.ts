import { createAsyncThunk } from "@reduxjs/toolkit";
import { userType } from "../../state/slice/userSlice";

const getUsersUrl = 'https://virtualwalletproject.herokuapp.com/getall/users'

export const getAllUsers = createAsyncThunk('getAllUsers', async () => {
    const response = await fetch(getUsersUrl)
    return (await response.json() as userType[])
})
