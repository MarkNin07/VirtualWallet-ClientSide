import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';
import User from './User';
import { auth } from '../../fireabseConfig';
import { updateUser } from '../../actions/user/updateUser';

interface IUserListProps {
}

const UserList: React.FunctionComponent<IUserListProps> = (props) => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === posibleStatus.IDLE) {
      dispatch(getAllUsers())
    }
  }, [dispatch])

  const getUsers = useSelector(selectUsersState())
  const status = useSelector(selectUsersStatus())

  const { emailState } = useSelector((state: RootState) => state.logged)

  const realUser: userType | undefined = getUsers.find((user) => user.correo === emailState)

  const closeSession = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const UserSessionUpdated: userType = { 
        id: realUser?.id!,
        nombre: realUser?.nombre!,
        correo: realUser?.correo!,
        contrasena: realUser?.contrasena!,
        rol: realUser?.rol,
        estaActivo: false,
        correoVerificado: realUser?.correoVerificado!
      }
      dispatch(updateUser(UserSessionUpdated))
      signOut(auth)
      navigate('/')
  }

  return (
    <div>
      <h1>Tu Perfil</h1>
      <div className='display'>
      <table >
        <thead>
          <tr>
            <td>Nombre</td>
            <td>Rol</td>
            <td>Correo</td>
            <td>Saldo en Cuenta</td>
          </tr>
        </thead>
        {<User key={realUser?.id} props={realUser} />}
      </table>
      </div>
      <br />
      <div className='display'>
        <Link to='/movimientos' state={{userSend: realUser?.correo}}>
        <button className='separacion'>Ver Movimientos</button>
        </Link>

        <Link to='/ingresos' state={{userSend: realUser?.correo}}>
        <button className='separacion'>Ver Ingresos</button>
        </Link>

        <Link to='/egresos' state={{userSend: realUser?.correo}}>
        <button className='separacion'>Ver Egresos</button>
        </Link>
      </div>

      <div className='display'>
        <button onClick={(e) => closeSession(e)} className='separacion'>Cerrar Sesión</button>
      </div>
    </div>
  )
};

export default UserList;
