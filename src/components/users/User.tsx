import * as React from 'react';
import { userType } from '../../state/slice/userSlice';

type userPropsType = {
    props: userType
}

const User: React.FunctionComponent<userPropsType> = ({props}) => {
  return (
    <div>
        {props.nombre}
    </div>
  )
};

export default User;
