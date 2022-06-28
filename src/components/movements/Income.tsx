import * as React from 'react';
import { Link } from 'react-router-dom';

interface IIncomeProps {
}

const Income: React.FunctionComponent<IIncomeProps> = (props) => {
  return (
    <div>
        Hola desde income 7u7
        <Link to= '/perfil'>
        <button>Regresar al Perfil</button>
        </Link>
    </div>
  )
};

export default Income;
