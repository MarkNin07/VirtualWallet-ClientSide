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
      <table>
        <tr>
          <td>Nombre</td>
          <td>Rol</td>
        </tr>
        {getUsers.map((user) => <User key={user.id} props={user} />)}
      </table>

      <div>
        <Link to='/sendMoney' style={{ textDecoration: 'none' }}>
          <button>Enviar Dinero</button>
        </Link>
      </div>

      <br />

      <div>
        <button>Ver Movimientos</button>
      </div>


    </div>
  )
};

export default UserList;
