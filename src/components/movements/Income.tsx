import { Table } from '@mantine/core';
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


  const ths = (
    <tr>
        <th>Origen</th>
        <th>Destino</th>
        <th>Valor</th>
        <th>Fecha</th>
    </tr>
);

const rows = ingresos.map((transacciones) => (
    <tr key={transacciones.id}>
        <td>{transacciones.correoOrigen}</td>
        <td>{transacciones.correoDestino}</td>
        <td>{Number(transacciones.valor)}</td>
        <td>{transacciones.fecha}</td>
    </tr>
));
  return (
    <div>
            <Link to='/perfil' style={{justifyContent:"right", display:"flex"}}>
                <button role="button"
                    className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-2 w-40">
                    Regresar</button>
            </Link>

            <Table striped highlightOnHover>
                <caption>Resumen de ingresos</caption>
                <thead>{ths}</thead>
                <tbody>{rows}</tbody>
            </Table>
    </div>
  )
};

export default Income;
