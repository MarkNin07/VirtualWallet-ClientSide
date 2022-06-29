import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getAllTransactions } from '../../actions/transactions/getAllTransactions';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { selectTransactionsState, selectTransactionsStatus } from '../../state/slice/transactionSlice';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';

interface stateBecauseSend {  
}

const Income: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()

  const statusTransactions = useSelector(selectTransactionsStatus())
  React.useEffect(() => {
    if (statusTransactions === posibleStatus.IDLE) {
      dispatch(getAllTransactions())
    }
  }, [dispatch])

  const allTransactions = useSelector(selectTransactionsState())

  //trayendo usuario
  const { emailState } = useSelector((state: RootState) => state.logged)

  const ingresos = allTransactions.filter((transaction) => transaction.correoDestino === emailState)

  return (
    <div>
      <div className='display'>
        <table >
          <thead>
            <tr>
              <td>Origen</td>
              <td>Destino</td>
              <td>Valor</td>
              <td>Fecha</td>
            </tr>
          </thead>
          {ingresos.map((ingreso) => {
            return <tbody key={ingreso.id}>
              <tr>
                <td>{ingreso.correoOrigen}</td>
                <td>{ingreso.correoDestino}</td>
                <td>{Number(ingreso.valor)}</td>
                <td>{ingreso.fecha}</td>
              </tr>
            </tbody>
          })}
        </table>
      </div>
      <br />
      <Link to='/perfil'>
        <button>Regresar al Perfil</button>
      </Link>
    </div>
  )
};

export default Income;
