import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../../fireabseConfig';

interface ILogInProps {
}

const LogIn: React.FunctionComponent<ILogInProps> = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const logInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      if(email && password){
        signInWithEmailAndPassword(auth, email, password)
        .then((result)=>{
          if(!result.user.emailVerified){
            alert('Necesitas verificar tu cuenta antes de iniciar sesión')
          }
          console.log(result.user.emailVerified);   
        })
        .catch(error => {
          console.log(error.message);      
        }),
        setEmail('')
        setPassword('')
      }
    }
  return (
    <div>
        <h1>Iniciar Sesión</h1>
            <form>
                <div>
                    <label htmlFor="username">Email</label>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type='text' 
                    name='username' 
                    value={email} />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    name="password"
                    value={password} />
                </div>

                <br />

                <button onClick={(e) => logInForm(e)}>Ingresar</button>

            </form>
    </div>
  )
};

export default LogIn;
