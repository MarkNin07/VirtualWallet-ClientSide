import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import SingIn from './components/login/SingIn'
import LogIn from './components/login/LogIn'
import UserList from './components/users/UserList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      {/*<SingIn/>*/}
      
      <UserList />
    </div>
  )
}

export default App
