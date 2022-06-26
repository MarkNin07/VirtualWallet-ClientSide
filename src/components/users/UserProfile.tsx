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

  const getUsers = useSelector(selectUsersState())
  const status = useSelector(selectUsersStatus())

  const { emailState } = useSelector((state: RootState) => state.logged)
  //console.log('este es el email en el estado', emailState);

  const realUser: userType | undefined = getUsers.find((user) => user.correo === emailState)
  //console.log('este es el usuario real que tengo luego de encontrarlo',realUser);


  useEffect(() => {
    if (status === posibleStatus.IDLE) {
      dispatch(getAllUsers())
    }
  }, [dispatch])

  return (
    <div>
      <h1>Tu Perfil</h1>
      <table>
        <thead>
          <tr>
            <td>Nombre</td>
            <td>Rol</td>
            <td>Correo</td>
          </tr>
        </thead>
        {<User key={realUser?.id} props={realUser} />}
      </table>
      <br />
      <div>
        <button>Ver Movimientos</button>
      </div>
    </div>
  )
};

export default UserList;
