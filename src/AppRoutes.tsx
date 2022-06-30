import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom";
import './App.css'
import UserProfile from './components/users/UserProfile'
import SendMoney from './components/sendMoney/SendMoney'
import { RootState, useAppSelector } from './store'
import VerifyEmail from './components/login/VerifyEmail'
import AllMovements from './components/movements/AllMovements'
import Income from './components/movements/Income'
import Expenses from './components/movements/Expenses'
import PagePpal from './components/login/Page'
import Payroll from './components/payroll/Payroll'
import Profile from './components/users/navlinks/Profile';

type Props = {}

const AppRoutes: React.FC<Props> = () => {

    const { emailState } = useAppSelector((state: RootState) => state.logged)

    const navigate = useNavigate()

    useEffect(() => {
        if (emailState === null) {
            navigate('/')
        }
    }, [])

    return (
        <>
            {
                emailState ?
                    <Routes>
                        < Route path='/perfil' element={< UserProfile />} >
                            <Route index element={<Profile />} />
                            <Route path='sendMoney' element={<SendMoney />} />
                            <Route path='movimientos' element={<AllMovements />} />
                            <Route path='ingresos' element={<Income />} />
                            <Route path='egresos' element={<Expenses />} />
                        </Route >
                        <Route path='verifyEmail' element={<VerifyEmail />} />
                        <Route path='payroll' element={<Payroll />} />
                        <Route path='/' element={<PagePpal />} />
                    </Routes > :

                    <Routes>
                        <Route path='/' element={<PagePpal />} />
                        <Route path='*' element={<PagePpal />} />
                    </Routes>}
        </>

    )
}

export default AppRoutes