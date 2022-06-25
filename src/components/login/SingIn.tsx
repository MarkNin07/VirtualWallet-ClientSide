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

   const regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]{2}).{8,}$/

    if(email && password.match(regularExpression)){
        createUserWithEmailAndPassword(auth, email, password)
        .then((result)=>{            
            sendEmailVerification(result.user)
            console.log(result.user.emailVerified)
            alert("Se ha enviado un correo de verificación. Revisa tu bandeja de entrada o de correos no deseados")
        })
        .catch((error)=>{
            const errorMessage = error.message
            if(errorMessage === "Firebase: Error (auth/email-already-in-use)."){
                alert('Revisa tu bandeja de entrada o Spam. Verifica el correo con el link enviado')          
            }

            if(errorMessage === "Firebase: Error (auth/invalid-email)."){
                alert('Has ingresado un correo incorrecto')          
            }
            
            console.log(errorMessage);
            
        });
        setEmail('')
        setPassword('')
    }else{
        alert("Ambos campos deben estar con información valida. La contraseña debe contar con al menos: Una letra en mayúscula, Una letra en minúscula, Un dígito, Dos caracteres especiales, y al menos ocho caracteres")
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
                     type='email' 
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
