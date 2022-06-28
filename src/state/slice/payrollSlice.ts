import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define a type for the slice state
interface PayrollState {
  accounts: account[]
}

export interface account {
  ID: string
  Monto: number
  __rowNum__: number
}

// Define the initial state using that type
const initialState: PayrollState = {
  accounts: []
}

export const payrollSlice = createSlice({
  name: 'payroll',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: state => {
    },
  }
})

export const { increment } = payrollSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAccounts = (state: RootState) => state.payroll.accounts

export default payrollSlice.reducer