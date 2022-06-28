import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getAllTransactions } from '../../actions/transactions/getAllTransactions';
import { selectTransactionsState, selectTransactionsStatus } from '../../state/slice/transactionSlice';
import { posibleStatus, selectUsersState, selectUsersStatus } from '../../state/slice/userSlice';
import { useAppDispatch } from '../../store';

interface userStateSend {
    userSend: string
}

const AllMovements: React.FunctionComponent = (props) => {

    const dispatch = useAppDispatch()

    const location = useLocation()
    const state = location.state as userStateSend
    const { userSend } = state

    const statusTransactions = useSelector(selectTransactionsStatus())
    React.useEffect(() => {
        if (statusTransactions === posibleStatus.IDLE) {
            dispatch(getAllTransactions())
        }
    }, [dispatch])

    const allTransactions = useSelector(selectTransactionsState())
    const transaccionWhereIamOriginAndDestination = allTransactions.filter((transaction) => transaction.correoDestino===userSend || transaction.correoOrigen===userSend)

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
                    {transaccionWhereIamOriginAndDestination.map((transaction) => {
                        return <tbody key={transaction.id}>
                            <tr>
                                <td>{transaction.correoOrigen}</td>
                                <td>{transaction.correoDestino}</td>
                                <td>{Number(transaction.valor)}</td>
                                <td>{transaction.fecha}</td>
                            </tr>
                        </tbody>
                    })}
                </table>
            </div>
            <Link to='/perfil'>
                <button>Regresar al Perfil</button>
            </Link>
        </div>
    )
};

export default AllMovements;
