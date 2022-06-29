import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getAllTransactions } from '../../actions/transactions/getAllTransactions';
import { selectTransactionsState, selectTransactionsStatus } from '../../state/slice/transactionSlice';
import { posibleStatus } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';

interface stateBecauseSend {
}

const Expenses: React.FunctionComponent = (props) => {

  const dispatch = useAppDispatch()

  const statusTransactions = useSelector(selectTransactionsStatus())
  React.useEffect(() => {
    if (statusTransactions === posibleStatus.IDLE) {
      dispatch(getAllTransactions())
    }
  }, [dispatch])

  const allTransactions = useSelector(selectTransactionsState())

  const { emailState } = useSelector((state: RootState) => state.logged)

  const egresos = allTransactions.filter((transaction) => transaction.correoOrigen === emailState)



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
          {egresos.map((egreso) => {
            return <tbody key={egreso.id}>
              <tr>
                <td>{egreso.correoOrigen}</td>
                <td>{egreso.correoDestino}</td>
                <td>{Number(egreso.valor)}</td>
                <td>{egreso.fecha}</td>
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

export default Expenses;
