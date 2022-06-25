import { createAsyncThunk } from "@reduxjs/toolkit";
import { userType } from '../state/slice/userSlice'

//mock API
const getUsersUrl = 'https://my.api.mockaroo.com/usuarios_mock?key=cfbfa110'

export const getAllUsers = createAsyncThunk('getAllUsers', async () => {
    const response = await fetch(getUsersUrl)
    return (await response.json() as userType[])
})
