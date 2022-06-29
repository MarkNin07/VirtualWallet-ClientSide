import React from 'react'
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import './App.css'
import UserProfile from './components/users/UserProfile'
import SendMoney from './components/sendMoney/SendMoney'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import VerifyEmail from './components/login/VerifyEmail'
import AllMovements from './components/movements/AllMovements'
import Income from './components/movements/Income'
import Expenses from './components/movements/Expenses'
import PagePpal from './components/login/Page'
import Payroll from './components/payroll/Payroll'

type Props = {}

const AppRoutes : React.FC<Props> = () => {

    const { emailState } = useSelector((state: RootState) => state.logged)
    return (
        <BrowserRouter>
            {emailState === null ?
                <>
                </>
                :
                <Link to='/perfil'></Link>}

            <Routes>
                <Route path='perfil' element={<UserProfile />} />
                <Route path='sendMoney' element={<SendMoney />} />
                <Route path='verifyEmail' element={<VerifyEmail />} />

                <Route path='movimientos' element={<AllMovements />} />
                <Route path='ingresos' element={<Income />} />
                <Route path='egresos' element={<Expenses />} />
                <Route path='payroll' element={<Payroll />} />
                <Route path='/' element={<PagePpal />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes