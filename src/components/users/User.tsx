import * as React from 'react';
import { Link } from 'react-router-dom';
import { userType } from '../../state/slice/userSlice';

type userPropsType = {
    props: userType|undefined
}

const User: React.FunctionComponent<userPropsType> = ({props}) => {
  console.log('este es el verificado luego de iniciar sesion',props?.correoVerificado);
  return (
    <tbody>
      <tr>
        <td>{props?.nombre}</td>
        <td>{props?.rol}</td>
        <td>{props?.correo}</td>
        <td>
        <Link to='/sendMoney' style={{ textDecoration: 'none' }}>
          <button>Enviar Dinero</button>
        </Link>
      </td>
      </tr>
       
    </tbody>
  )
};

export default User;
