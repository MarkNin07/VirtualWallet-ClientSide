import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../actions/user/getAllUsers';

import { updateUser } from '../../actions/user/updateUser';
import { auth } from '../../fireabseConfig';
import { logInInReducer } from '../../state/slice/loggedInSlice';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { verifiedInInReducer } from '../../state/slice/verifiedSlice';
import { RootState, useAppDispatch } from '../../store';
import { Input } from '@mantine/core';
import { At } from 'tabler-icons-react';
import { Modal, Button, Group, PasswordInput } from '@mantine/core';
import SingIn from './SingIn';

interface ILogInProps {
}

const LogIn: React.FunctionComponent<ILogInProps> = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [opened, setOpened] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dispatchApp = useAppDispatch()

  const status = useSelector(selectUsersStatus())
  const getUsers = useSelector(selectUsersState())

  useEffect(() => {
    if (status === posibleStatus.IDLE) {
      dispatchApp(getAllUsers())
    }
  }, [dispatch])

  const userToChangeVerify = getUsers.filter((user) => user.correo === email)[0]

  const { emailState } = useSelector((state: RootState) => state.logged)

  useEffect(() => {
    if (emailState === null) {
      navigate('/')
    }
  }, [])

  const logInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          if (!result.user.emailVerified) {
            const verified = result.user.emailVerified
            dispatch(verifiedInInReducer(verified))
            navigate('/verifyEmail')
          }

          if (result.user.emailVerified) {
            const actualUser = getUsers.find((user) => user.correo === email)

            if (actualUser?.estaActivo!) {
              alert("ya inicio sesión en otro dispositivo")
              navigate('/')
              return
            }

            const adminUser = getUsers.find((user) => user.rol === 'admin')
                        
            const actualEmail = result.user.email
                        
            dispatch(logInInReducer(actualEmail))

            if (adminUser?.correo! === actualEmail) {
              navigate('/payroll')
              return
            }

            const updatedUser: userType = {
              id: userToChangeVerify?.id,
              nombre: userToChangeVerify?.nombre,
              correo: email,
              contrasena: password,
              rol: 'colaborador',
              estaActivo: true,
              correoVerificado: result.user.emailVerified
            }
            dispatchApp(updateUser(updatedUser))
            navigate('/perfil')
          }
        })
        .catch(error => {
          const errorMessage = error.message
          if (errorMessage === "Firebase: Error (auth/user-not-found).") {
            alert('No hay un usuario registrado en el sistema con la información ingresada. Por favor registrate')
          }
          if (errorMessage === "Firebase: Error (auth/invalid-email).") {
            alert('Has ingresado un correo incorrecto')
          }
          if (errorMessage === "Firebase: Error (auth/wrong-password).") {
            alert('Has ingresado una contraseña incorrecta')
          }
          console.log(errorMessage);
        })
      setEmail('')
      setPassword('')
    }
  }
  return (
<body className="h-screen overflow-hidden flex items-center justify-center" >
           <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Regístrese!"
          >
            {<SingIn/>}
          </Modal>
         <div className="h-full bg-gradient-to-tl from-green-400 to-indigo-900 w-full py-7 px-4">

            <div className="flex flex-col items-center justify-center">
              
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wallet" width="80" height="80" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
              <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
            </svg>



                <div className="bg-white shadow rounded lg:w-1/3  md:w-1/2 w-full p-10 mt-5">
                    <p className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">Inicie sesión</p>
                    
                    <p className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500">No tiene una cuenta? <Button className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none  text-gray-800 cursor-pointer" onClick={() => setOpened(true)}>Registrese</Button></p>

                    <div className="w-full flex items-center justify-between py-3">
                         <hr className="w-full bg-gray-400"/>

                        </div>

                        <Input
                            onChange={(e:any) => setEmail(e.target.value)}
                            icon={<At />}
                            variant="filled"
                            placeholder="Your email"
                            radius="md"
                            value={email}
                            />
                            <br />
                        <PasswordInput 
                            onChange={(e:any) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            description="La contraseña debe contener al menos 8 caracteres, minúscula, mayúscula, números y 2 caracteres especiales"
                            variant="filled"
                            radius="md"
                            required
                          />
                        <div className="mt-8">
                            <button role="button" 
                            onClick={(e) => logInForm(e)}
                            className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-3 w-full">
                              Iniciar Sesión</button>
                        </div>
                </div>
            </div>
        </div>
</body>
  )
};

export default LogIn;
