import * as React from 'react';
import { Link } from 'react-router-dom';
import {useLocation} from 'react-router-dom'

interface IVerifyEmailProps {
}

const VerifyEmail: React.FunctionComponent<IVerifyEmailProps> = (props) => {

  return (
    <div>
        <h1>
        Por favor verfica tu cuenta. Revisa tu bandeja de entrada o Spam por favor.
        </h1>
        <Link to= '/'> <button className='button button-block'> Regresar </button></Link>
        <div>
      
        </div>
    </div>
  )
};

export default VerifyEmail;
