import { useState } from 'react'
import './App.css'
import SingIn from './components/login/SingIn'
import LogIn from './components/login/LogIn'
import UserProfile from './components/users/UserProfile'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import SendMoney from './components/sendMoney/SendMoney'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">

      <SingIn/>
      <LogIn/>
      
      
    {/*
      <BrowserRouter>
        <Link to = '/perfil'> Perfil </Link>

        <Routes>
          <Route path = 'perfil' element ={<UserProfile/>}/>
          <Route path = 'sendMoney' element ={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
  */}
    </div>
  )
}

export default App
