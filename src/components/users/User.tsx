import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllAccountsFinal } from '../../actions/account/getAllAccounts';
import { selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { posibleStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';

type userPropsType = {
  props: userType | undefined
}

const User: React.FunctionComponent<userPropsType> = ({ props }) => {
  const status = useSelector(selectAccountsStatus())
  const getAccounts = useSelector(selectAccountsState())

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === posibleStatus.IDLE) {
      dispatch(getAllAccountsFinal())
    }
  }, [dispatch])

  const { emailState } = useSelector((state: RootState) => state.logged)
  const userAccount = getAccounts.find((account) => account.correoUsuario === emailState)

  return (
    <tbody>
      <tr>
        <td>{props?.nombre}</td>
        <td>{props?.rol}</td>
        <td>{props?.correo}</td>
        <td>{userAccount?.monto}</td>
        <td>
          <Link to='/sendMoney' style={{ textDecoration: 'none' }} state={{ stateSend: props?.id }}>
            <button>Enviar Dinero</button>
          </Link>
        </td>
      </tr>

    </tbody>
  )
};

export default User;
