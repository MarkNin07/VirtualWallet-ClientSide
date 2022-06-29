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

interface ILogInProps {
}

const LogIn: React.FunctionComponent<ILogInProps> = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    <div>
      <h1>Iniciar Sesión</h1>
      <form>
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
            name="password"
            placeholder="contraseña"
            value={password} />
        </div>

        <br />

        <button className='button button-block' onClick={(e) => logInForm(e)}>Ingresar</button>

      </form>
    </div>
  )
};

export default LogIn;
