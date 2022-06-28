import { createAsyncThunk } from "@reduxjs/toolkit";
import { userType } from "../../state/slice/userSlice";

const getUsersUrl = 'http://localhost:8080/getall/users'

export const getAllUsers = createAsyncThunk('getAllUsers', async () => {
    const response = await fetch(getUsersUrl)
    return (await response.json() as userType[])
})
