import * as React from 'react';
import { Link } from 'react-router-dom';
import { userType } from '../../state/slice/userSlice';

type userPropsType = {
    props: userType
}

const User: React.FunctionComponent<userPropsType> = ({props}) => {
  return (
    <tbody>
      <tr>
        <td>{props.nombre}</td>
        <td>{props.rol}</td>

        <div>
        <Link to='/sendMoney' style={{ textDecoration: 'none' }}>
          <button>Enviar Dinero</button>
        </Link>
      </div>
      </tr>
       
    </tbody>
  )
};

export default User;
