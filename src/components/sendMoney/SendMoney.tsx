import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllAccountsFinal } from '../../actions/account/getAllAccounts';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { accountType, selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { transactionType } from '../../state/slice/transactionSlice';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';
import moment from 'moment';
import { createTransaction } from '../../actions/transactions/createTransaction';
import { updateAccount } from '../../actions/account/updateAccount';

interface stateBecauseSend {
  stateSend: string
}

const SendMoney: React.FunctionComponent = (props) => {
  const navigate = useNavigate()
  const [productoDestino, setProductoDestino] = useState('')
  const [monto, setMonto] = useState(0)

  const dispatch = useAppDispatch()
  const statusUsers = useSelector(selectUsersStatus())

  useEffect(() => {
    if (statusUsers === posibleStatus.IDLE) {
      dispatch(getAllUsers())
    }
  }, [dispatch])

  const statusAccounts = useSelector(selectAccountsStatus())
  useEffect(() => {
    if (statusAccounts === posibleStatus.IDLE) {
      dispatch(getAllAccountsFinal())
    }
  }, [dispatch])

  /*
  const location = useLocation()
  const state = location.state as stateBecauseSend
  const { stateSend } = state*/

  const getUsers = useSelector(selectUsersState())

  //const usuarioOrigen = getUsers.find((user) => user.id === stateSend) as userType

  const getAccounts = useSelector(selectAccountsState())

  const { emailState } = useSelector((state: RootState) => state.logged)

  let cuentaOrigen = getAccounts.find((account) => account.correoUsuario === emailState)

  const onSendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (productoDestino && monto && (monto <= cuentaOrigen?.monto!) && productoDestino !== cuentaOrigen?.correoUsuario) {

      if (productoDestino === cuentaOrigen?.correoUsuario) {
        alert('No puedes enviar dinero a ti mismo desde la misma cuenta')
      }

      let cuentaDestino = getAccounts.find((account) => account.correoUsuario === productoDestino)

      if (cuentaDestino) {
        const newTransaction: transactionType = {
          id: nanoid(),
          fecha: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
          correoOrigen: emailState!,
          correoDestino: cuentaDestino?.correoUsuario,
          valor: monto
        }

        dispatch(createTransaction(newTransaction))
        alert('se ha generado la transaccion')

        const cuentaOrigenUpdated: accountType = {
          id: cuentaOrigen?.id,
          correoUsuario: cuentaOrigen?.correoUsuario,
          monto: cuentaOrigen?.monto! - monto
        }

        const cuentaDestinoUpdated: accountType = {
          id: cuentaDestino.id,
          correoUsuario: cuentaDestino.correoUsuario,
          monto: cuentaDestino.monto! + monto
        }

        dispatch(updateAccount(cuentaOrigenUpdated))
        dispatch(updateAccount(cuentaDestinoUpdated))

        setProductoDestino('')
        setMonto(0)
        
        navigate('/perfil')
      } else {
        alert('El usuario al que se le envia la informacion no existe en la base de datos')
        setProductoDestino('')
      }
    } else {
      alert('Los campos de Producto Destino y Monto deben contener información o el monto ingresado excede a la cantidad que tienes en tu cuenta')
      setProductoDestino('')
      setMonto(0)
    }
  }

  return (
    <div>
      <h1>FORMULARIO DE TRANSFERENCIA</h1>
      <form onSubmit={(e) => onSendMoney(e)}>
        <div>
          <label>Producto de Origen</label>
          <input disabled type='text' style={{ 'backgroundColor': '#DAD7D7' }} value={emailState!}></input>
        </div>
        <br />
        <div>
          <label>Saldo en cuenta</label>
          <input disabled type='text' style={{ 'backgroundColor': '#DAD7D7' }} value={cuentaOrigen?.monto}></input>
        </div>
        <br />

        <div>
          <label>Producto Destino</label>
          <input onChange={(e) => setProductoDestino(e.target.value)} type='text' value={productoDestino} placeholder='Correo destino'></input>
        </div>
        <br />
        <div>
          <label>Monto a Enviar</label>
          <input onChange={(e) => setMonto(Number(e.target.value))} type='number' min='0' value={monto}></input>
        </div>
        <br />
        <input type='submit' value='Enviar Dinero' style={{ 'backgroundColor': '#E5E5E5' }} />
      </form>
      <br />
      <Link to='/perfil'>
        <button>Regresar</button>
      </Link>
    </div>
  )
};

export default SendMoney;
