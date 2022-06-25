import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../../fireabseConfig'

interface ISingInProps {
}

const SingIn: React.FunctionComponent<ISingInProps> = (props) => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    

    const signInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if(email && password){
        createUserWithEmailAndPassword(auth, email, password)
        .then((result)=>{            
            sendEmailVerification(result.user)
            console.log(result.user.emailVerified)
        })
        .catch((error)=>{
            const errorMessage = error.message
            if(errorMessage === "Firebase: Error (auth/email-already-in-use)."){
                alert('Revisa tu bandeja de entrada o Spam. Verifica el correo con el link enviado')          
            }
            console.log(errorMessage);
            
        });
        setEmail('')
        setPassword('')
    }
    
    }

    return (
        <div>
            <h1>Registrarse</h1>
            <form>
                <div>
                    <label htmlFor="username">Email</label>
                    <input 
                     onChange={(e) => setEmail(e.target.value)}
                     type='text' 
                     name='Email'
                     value={email} />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    name="contraseña" 
                    value={password} />
                </div>

                <br />

                <button onClick={(e) => signInForm(e)}>Registrarse</button>

            </form>
        </div>
    )
};

export default SingIn;
