import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../actions/getAllUsers';
import { posibleStatus, selectUsersState, selectUsersStatus } from '../../state/slice/userSlice';
import { useAppDispatch } from '../../store';
import User from './User';

interface IUserListProps {
}

const UserList: React.FunctionComponent<IUserListProps> = (props) => {

  const dispatch = useAppDispatch();

  const getUsers = useSelector(selectUsersState())
  const status = useSelector(selectUsersStatus())

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
        </tr>
        </thead>
        {getUsers.map((user) => <User key={user.id} props={user} />)}
      </table>

      <br />

      <div>
        <button>Ver Movimientos</button>
      </div>


    </div>
  )
};

export default UserList;
