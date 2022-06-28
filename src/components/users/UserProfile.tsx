import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';
import User from './User';

interface IUserListProps {
}

const UserList: React.FunctionComponent<IUserListProps> = (props) => {

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
    </div>
  )
};

export default UserList;
