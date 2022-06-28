import { useState } from 'react'
import './App.css'
import SingIn from './components/login/SingIn'
import LogIn from './components/login/LogIn'
import UserProfile from './components/users/UserProfile'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import SendMoney from './components/sendMoney/SendMoney'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import VerifyEmail from './components/login/VerifyEmail'
import AllMovements from './components/movements/AllMovements'
import Income from './components/movements/Income'
import Expenses from './components/movements/Expenses'

function App() {
  const { emailState } = useSelector((state: RootState) => state.logged)

  return (
    <div className="App">

      <BrowserRouter>
        {emailState === null ?
          <div>
            <SingIn />
            <br />
            <br />
            <br />
            <LogIn />
          </div>
          :
          <Link to='/perfil'></Link>}

        <Routes>
          <Route path='perfil' element={<UserProfile />} />
          <Route path='sendMoney' element={<SendMoney />} />
          <Route path='verifyEmail' element={<VerifyEmail />} />

          <Route path='movimientos' element={<AllMovements />} />
          <Route path='ingresos' element={<Income />} />
          <Route path='egresos' element={<Expenses />} />
          <Route path='/' />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
