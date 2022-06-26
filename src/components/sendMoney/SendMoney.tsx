import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAllAccounts } from '../../actions/account/getAllAccounts';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { useAppDispatch } from '../../store';

interface stateBecauseSend {
  stateSend: string
}

const SendMoney: React.FunctionComponent = (props) => {
  const [productoDestino, setProductoDestino] = useState('')
  const [monto, setMonto] = useState(0)

  //dispatch de getUusarios
  const dispatch = useAppDispatch()
  const statusUsers = useSelector(selectUsersStatus())

  useEffect(() => {
    if (statusUsers === posibleStatus.IDLE) {
      dispatch(getAllUsers())
    }
  }, [dispatch])

  //dispatch de getAccounts
  const statusAccounts = useSelector(selectAccountsStatus())
  useEffect(() => {
    if (statusAccounts === posibleStatus.IDLE) {
      dispatch(getAllAccounts())
    }
  }, [dispatch])

  const location = useLocation()
  const state = location.state as stateBecauseSend
  const {stateSend} = state

  const getUsers = useSelector(selectUsersState())

  //con el id puedo saber quien es el usuario origen
  const usuarioOrigen = getUsers.find((user)=>user.id === stateSend) as userType

  //debo traer la cuenta origen y la cuenta destino (getAccounts) para afectarlas con el Monto y hacer el update  
  const getAccounts = useSelector(selectAccountsState())

  let cuentaOrigen = getAccounts.find((account)=>account.correoUsuario === usuarioOrigen.correo)
  //console.log(cuentaOrigen);
  
  let cuentaDestino = getAccounts.find((account)=>account.correoUsuario === productoDestino)
  
  const onSendMoney = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(productoDestino && monto){
      
    }else{
      alert('Los cambos de Producto Destino y Monto deben contener información')
    }
  }

  return (
    <div>
        Formulario para enviar dinero con el que creo la transaccion
        <form>
          <div>
            <label>Producto de Origen</label>
            <input disabled type='text' value={usuarioOrigen.correo!}></input>
          </div>
          <br/>
          <div>
            <label>Producto Destino</label>
            <input onChange={(e)=> setProductoDestino(e.target.value)} type='text' value={productoDestino} placeholder='Correo destino'></input>
          </div>
          <br/>
          <div>
            <label>Monto a Enviar</label>
            <input onChange={(e)=> setMonto(Number(e.target.value))} type='number' min='0' value={monto}></input>
          </div>
          <br/>
          <input type='submit' value='Enviar dinero'/>
        </form>
    </div>
  )
};

export default SendMoney;
