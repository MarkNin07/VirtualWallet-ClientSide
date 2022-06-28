import * as React from 'react';
import { Link } from 'react-router-dom';

interface IExpensesProps {
}

const Expenses: React.FunctionComponent<IExpensesProps> = (props) => {
  return (
    <div>
        Hola desde expenses 7u7
        <Link to= '/perfil'>
        <button>Regresar al Perfil</button>
        </Link>
    </div>
  )
};

export default Expenses;
