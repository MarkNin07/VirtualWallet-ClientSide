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

    dispatch(getAllUsers())

    const getUsers = useSelector(selectUsersState())

    const signInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]{2}).{8,}$/
        const reGexName = /([a-zA-ZÀ-ÿ\u00f1\u00d1]{2,})*[\s]{1,1}([a-zA-ZÀ-ÿ\u00f1\u00d1]{2,})/

        if (email && password.match(regularExpression) && name.match(reGexName)) {

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
                        alert("Se ha enviado un correo de verificación. Revisa tu bandeja de entrada o de correos no deseados" + result.user.email)
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
            alert("Ambos campos deben estar con información valida. La contraseña debe contar con al menos: Una letra en mayúscula, Una letra en minúscula, Un dígito, Dos caracteres especiales, y al menos ocho caracteres")
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
