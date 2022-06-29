import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../../fireabseConfig'
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../store';
import { createUser } from '../../actions/user/createUser';
import { useSelector } from 'react-redux';
import { accountType } from '../../state/slice/accountSlice';
import { createAccount } from '../../actions/account/createAccount';
import { getAllUsers } from '../../actions/user/getAllUsers';

interface ISingInProps {
}

const SingIn: React.FunctionComponent<ISingInProps> = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const dispatch = useAppDispatch()
    const status = useSelector(selectUsersStatus())

    useEffect(() => {
        if (status === posibleStatus.IDLE) {
            dispatch(getAllUsers())
        }
      }, [dispatch])

    const getUsers = useSelector(selectUsersState())

    const signInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        const nameRegularExpresion = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/

        if (email && password.match(regularExpression) && name.match(nameRegularExpresion)) {

            if (getUsers.find(user => user.correo === email)) {
                alert("El correo ingresado ya existe en la base de datos, por favor ingresa otro.")
            } else {
                const newUser: userType = {
                    id: nanoid(),
                    nombre: name,
                    correo: email,
                    contrasena: password,
                    rol: 'colaborador',
                    estaActivo: false,
                    correoVerificado: false
                }
                dispatch(createUser(newUser))

                const newAccount: accountType ={
                    id:nanoid(),
                    correoUsuario: email,
                    monto: 10000
                }
                dispatch(createAccount(newAccount))

                createUserWithEmailAndPassword(auth, email, password)
                    .then((result) => {
                        sendEmailVerification(result.user)
                        alert("Se ha enviado un correo de verificación. Revisa tu bandeja de entrada o de correos no deseados")
                    })
                    .catch((error) => {
                        const errorMessage = error.message
                        if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
                            alert('Revisa tu bandeja de entrada o Spam. Verifica el correo con el link enviado')
                        }

                        if (errorMessage === "Firebase: Error (auth/invalid-email).") {
                            alert('Has ingresado un correo incorrecto')
                        }                        
                    });
            }
            setEmail('')
            setPassword('')
            setName('')
        } else {
            if(!name.match(nameRegularExpresion)){
                alert('El nombre no debe contener caracteres especiales ni numeros. Se debe tener mínimo un nombre de dos letras para realizar el registro')
            }
            if(!password.match(regularExpression)){
                alert('La contraseña debe contar con al menos: Una letra en mayúscula, Una letra en minúscula, Un dígito, Un caracter especiales, y al menos ocho caracteres.')
            }
            if(!email || !password || !name){
                alert("Todos los campos deben tener información.")
            }
            
        }

    }

    return (
        <div>
            <h1>Registrarse</h1>
            <form>

                <div className='field-wrap'>
                    <label htmlFor="">Nombre Completo</label>
                    <input onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="nombre"
                        placeholder='Ex. Juan David Guitierrez Mesa'
                        value={name} />
                </div>

                <br />

                <div>
                    <label htmlFor="username">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                        name='Email'
                        placeholder='Ex. bbeed8@amazon.de'
                        value={email} />
                </div>

                <br />

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="contraseña"
                        placeholder="Al menos 2 caracteres especiales"
                        value={password} />
                </div>

                <br />
                
                <button className='button button-block' onClick={(e) => signInForm(e)}>Registrarse</button>

            </form>
        </div>
    )
};

export default SingIn;
