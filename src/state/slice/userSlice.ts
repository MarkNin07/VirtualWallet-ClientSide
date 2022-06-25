import { createSlice } from "@reduxjs/toolkit"
import { createUser } from "../../actions/createUser"
import { getAllUsers } from "../../actions/getAllUsers"
import { RootState } from "../../store"

export enum posibleStatus{
    IDLE = 'idle',
    COMPLETED = 'completed',
    FAILED = 'failed',
    PENDING = 'pending',
}

type userType = {
    id: string,
    nombre: string,
    correo: string,
    contraseña: string,
    rol: string,
    estaActivo: boolean,
    correoVerificado: boolean,
}

interface initialStateType {
    users: userType[]
    status: posibleStatus
    error: string | null
}

const initialState: initialStateType ={
    users:[],
    status: posibleStatus.IDLE,
    error: null,
}

const userSlice = createSlice({
    name:'usuarios',
    initialState,
    reducers:{

    },
    extraReducers: (builder)=>{
        //GET users
        builder.addCase(getAllUsers.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(getAllUsers.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.users = action.payload
        })
        builder.addCase(getAllUsers.rejected, (state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se solicitaba la información"
            state.users = []
        })
        //post users
        builder.addCase(createUser.pending,(state)=>{
            state.status = posibleStatus.PENDING
        })
        builder.addCase(createUser.fulfilled,(state,action)=>{
            state.status = posibleStatus.COMPLETED
            state.users.push(action.payload)
        })
        builder.addCase(createUser.rejected,(state)=>{
            state.status = posibleStatus.FAILED
            state.error = "Ocurrio algún error mientras se solicitaba la información"
        })
    }
})

export type {userType}
export type {initialStateType}
export default userSlice.reducer

//extra reducers
export const selectUsersState = () => (state:RootState) => state.users.users
export const selectUsersStatus = () => (state:RootState) => state.users.status
export const selectUsersFetchError = () => (state:RootState) => state.users.error