import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
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
        if(status === posibleStatus.IDLE){
          dispatch(getAllUsers())
        }   
    }, [dispatch])

  return (
    <div>
        {getUsers.map((user)=> <User key={user.id} props = {user}/>)}
    </div>
  )
};

export default UserList;
