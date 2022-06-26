import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../actions/getAllUsers';
import { updateUser } from '../../actions/updateUser';
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
  
  const getUsers = useSelector(selectUsersState())
  const userToChangeVerify = getUsers.find((user) => user.correo===email) 

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dispatchApp = useAppDispatch()

  const { emailState } = useSelector((state: RootState) => state.logged)

  //trae el string del email
  console.log("email de state",emailState)


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
            //alert('Necesitas verificar tu cuenta antes de iniciar sesión')
            const verified = result.user.emailVerified
            dispatch(verifiedInInReducer(verified))
            navigate('/verifyEmail')
          }

          if (result.user.emailVerified) {          
            const email = result.user.email
            dispatch(logInInReducer(email))

            //nuevo objeto de ese usuario con estado de correo verificado
            const updatedUser: userType={
              id: userToChangeVerify?.id,
              nombre: userToChangeVerify?.nombre,
              correo: email,
              contraseña: password,
              rol: 'colaborador',
              estaActivo: false,
              correoVerificado: result.user.emailVerified
            }
            dispatchApp(updateUser(updatedUser))
            console.log(updatedUser)
            navigate('/perfil')

          }

          //viene como true, si es true cambiar el objeto usuario
         /* console.log(result.user.emailVerified);
          console.log(result.user.email)
          console.log('email del email', email)
          console.log("email de state",emailState)*/
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
