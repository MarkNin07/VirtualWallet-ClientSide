import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAccountsFinal } from '../../actions/account/getAllAccounts';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { accountType, selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { transactionType } from '../../state/slice/transactionSlice';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import moment from 'moment';
import { createTransaction } from '../../actions/transactions/createTransaction';
import { updateAccount } from '../../actions/account/updateAccount';
import Swal from 'sweetalert2';

interface stateBecauseSend {
   stateSend: string
}

const SendMoney: React.FunctionComponent = (props) => {
   const navigate = useNavigate()
   const [productoDestino, setProductoDestino] = useState('')
   const [monto, setMonto] = useState(0)

   const dispatch = useAppDispatch()
   const statusUsers = useAppSelector(selectUsersStatus())

   useEffect(() => {
      if (statusUsers === posibleStatus.IDLE) {
         dispatch(getAllUsers())
      }
   }, [dispatch])

   const statusAccounts = useAppSelector(selectAccountsStatus())
   useEffect(() => {
      if (statusAccounts === posibleStatus.IDLE) {
         dispatch(getAllAccountsFinal())
      }
   }, [dispatch])

   const getAccounts = useAppSelector(selectAccountsState())

   const { emailState } = useAppSelector((state: RootState) => state.logged)

   let cuentaOrigen = getAccounts.find((account) => account.correoUsuario === emailState)

   const onSendMoney = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (productoDestino && monto && (monto > 0) && (monto <= cuentaOrigen?.monto!) && productoDestino !== cuentaOrigen?.correoUsuario) {

         if (productoDestino === cuentaOrigen?.correoUsuario) {
            Swal.fire({
               title: 'Algo falló!',
               text: "No te puedes enviar dinero a ti mismo, desde tu misma cuenta",
               icon: 'error'
            })
         }

         let cuentaDestino = getAccounts.find((account) => account.correoUsuario === productoDestino)
         console.log(productoDestino)
         console.log(getAccounts)
         console.log(cuentaDestino)

         if (cuentaDestino) {
            const newTransaction: transactionType = {
               id: nanoid(),
               fecha: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
               correoOrigen: emailState!,
               correoDestino: cuentaDestino?.correoUsuario,
               valor: monto
            }

            dispatch(createTransaction(newTransaction))
            Swal.fire({
               title: 'Transferencia Exitosa!',
               text: "Se ha generado la transaccion",
               icon: 'success'
            })

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
            Swal.fire({
               title: 'Algo falló!',
               text: "El usuario al que se le envia la informacion no existe en la base de datos",
               icon: 'error'
            })
            setProductoDestino('')
         }
      } else {
         Swal.fire({
            title: 'Algo falló!',
            text: "Los campos de Producto Destino y Monto deben contener información o el monto ingresado excede a la cantidad que tienes en tu cuenta",
            icon: 'error'
         })
         setProductoDestino('')
         setMonto(0)
      }
   }

   return (
      <>
      <div >
         <Link to='/perfil' style={{ justifyContent: "right", display: "flex" }}>
            <button role="button"
               className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-2 w-40">
               Regresar</button>
         </Link>

         <div className="flex flex-col items-start justify-between w-full px-10 pt-5 pb-20 lg:pt-1 lg:flex-row">
            <div className="relative z-10 w-full max-w-2xl mt-20 lg:mt-10 lg:w-5/12" >
               <div className="relative z-10 flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl">
                  <h4 className="w-full text-2xl font-medium leading-snug">FORMULARIO DE TRANSFERENCIA</h4>
                  <form onSubmit={(e) => onSendMoney(e)} className="relative w-full mt-6 space-y-8">

                     <div style={{ padding: "2" }} className="relative">
                        <label style={{ fontSize: "100%" }} className="absolute px-2 ml-2 -mt-6 font-medium text-gray-600 bg-white">Producto de Origen</label>
                        <input disabled type="text" className=" block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black" value={emailState!} />
                     </div>
                     <div className="relative">
                        <label style={{ fontSize: "100%" }} className="absolute px-2 ml-2 -mt-6 font-medium text-gray-600 bg-white">Saldo en cuenta</label>
                        <input disabled value={cuentaOrigen?.monto} type="text" className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black" placeholder="Doe" />
                     </div>
                     <div className="relative">
                        <label style={{ fontSize: "100%" }} className="absolute px-2 ml-2 -mt-6 font-medium text-gray-600 bg-white">Producto Destino</label>
                        <input onChange={(e) => setProductoDestino(e.target.value)} type='text' value={productoDestino} placeholder='Correo destino' className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black" />
                     </div>
                     <div className="relative">
                        <label style={{ fontSize: "100%" }} className="absolute px-2 ml-2 -mt-6 font-medium text-gray-600 bg-white">Monto a Enviar</label>
                        <input onChange={(e) => setMonto(Number(e.target.value))} type='number' min='0' value={monto} className="block w-full px-4 py-2 mt-2 text-base placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-black" />
                     </div>
                     <div className="relative">
                        <button type='submit' value='Enviar Dinero' className="inline-block w-full px-5 py-2 text-xl font-medium text-center text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 ease">Enviar Dinero</button>
                     </div>
                  </form>
               </div>
               <svg className="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-gray-200 fill-current" viewBox="0 0 91 91" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="none" stroke-width="1" fill-rule="evenodd">
                     <g fill-rule="nonzero">
                        <g>
                           <g>
                              <circle cx="3.261" cy="3.445" r="2.72"></circle>
                              <circle cx="15.296" cy="3.445" r="2.719"></circle>
                              <circle cx="27.333" cy="3.445" r="2.72"></circle>
                              <circle cx="39.369" cy="3.445" r="2.72"></circle>
                              <circle cx="51.405" cy="3.445" r="2.72"></circle>
                              <circle cx="63.441" cy="3.445" r="2.72"></circle>
                              <circle cx="75.479" cy="3.445" r="2.72"></circle>
                              <circle cx="87.514" cy="3.445" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 12)">
                              <circle cx="3.261" cy="3.525" r="2.72"></circle>
                              <circle cx="15.296" cy="3.525" r="2.719"></circle>
                              <circle cx="27.333" cy="3.525" r="2.72"></circle>
                              <circle cx="39.369" cy="3.525" r="2.72"></circle>
                              <circle cx="51.405" cy="3.525" r="2.72"></circle>
                              <circle cx="63.441" cy="3.525" r="2.72"></circle>
                              <circle cx="75.479" cy="3.525" r="2.72"></circle>
                              <circle cx="87.514" cy="3.525" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 24)">
                              <circle cx="3.261" cy="3.605" r="2.72"></circle>
                              <circle cx="15.296" cy="3.605" r="2.719"></circle>
                              <circle cx="27.333" cy="3.605" r="2.72"></circle>
                              <circle cx="39.369" cy="3.605" r="2.72"></circle>
                              <circle cx="51.405" cy="3.605" r="2.72"></circle>
                              <circle cx="63.441" cy="3.605" r="2.72"></circle>
                              <circle cx="75.479" cy="3.605" r="2.72"></circle>
                              <circle cx="87.514" cy="3.605" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 36)">
                              <circle cx="3.261" cy="3.686" r="2.72"></circle>
                              <circle cx="15.296" cy="3.686" r="2.719"></circle>
                              <circle cx="27.333" cy="3.686" r="2.72"></circle>
                              <circle cx="39.369" cy="3.686" r="2.72"></circle>
                              <circle cx="51.405" cy="3.686" r="2.72"></circle>
                              <circle cx="63.441" cy="3.686" r="2.72"></circle>
                              <circle cx="75.479" cy="3.686" r="2.72"></circle>
                              <circle cx="87.514" cy="3.686" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 49)">
                              <circle cx="3.261" cy="2.767" r="2.72"></circle>
                              <circle cx="15.296" cy="2.767" r="2.719"></circle>
                              <circle cx="27.333" cy="2.767" r="2.72"></circle>
                              <circle cx="39.369" cy="2.767" r="2.72"></circle>
                              <circle cx="51.405" cy="2.767" r="2.72"></circle>
                              <circle cx="63.441" cy="2.767" r="2.72"></circle>
                              <circle cx="75.479" cy="2.767" r="2.72"></circle>
                              <circle cx="87.514" cy="2.767" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 61)">
                              <circle cx="3.261" cy="2.846" r="2.72"></circle>
                              <circle cx="15.296" cy="2.846" r="2.719"></circle>
                              <circle cx="27.333" cy="2.846" r="2.72"></circle>
                              <circle cx="39.369" cy="2.846" r="2.72"></circle>
                              <circle cx="51.405" cy="2.846" r="2.72"></circle>
                              <circle cx="63.441" cy="2.846" r="2.72"></circle>
                              <circle cx="75.479" cy="2.846" r="2.72"></circle>
                              <circle cx="87.514" cy="2.846" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 73)">
                              <circle cx="3.261" cy="2.926" r="2.72"></circle>
                              <circle cx="15.296" cy="2.926" r="2.719"></circle>
                              <circle cx="27.333" cy="2.926" r="2.72"></circle>
                              <circle cx="39.369" cy="2.926" r="2.72"></circle>
                              <circle cx="51.405" cy="2.926" r="2.72"></circle>
                              <circle cx="63.441" cy="2.926" r="2.72"></circle>
                              <circle cx="75.479" cy="2.926" r="2.72"></circle>
                              <circle cx="87.514" cy="2.926" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 85)">
                              <circle cx="3.261" cy="3.006" r="2.72"></circle>
                              <circle cx="15.296" cy="3.006" r="2.719"></circle>
                              <circle cx="27.333" cy="3.006" r="2.72"></circle>
                              <circle cx="39.369" cy="3.006" r="2.72"></circle>
                              <circle cx="51.405" cy="3.006" r="2.72"></circle>
                              <circle cx="63.441" cy="3.006" r="2.72"></circle>
                              <circle cx="75.479" cy="3.006" r="2.72"></circle>
                              <circle cx="87.514" cy="3.006" r="2.719"></circle>
                           </g>
                        </g>
                     </g>
                  </g>
               </svg>
               <svg className="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-blue-600 fill-current" viewBox="0 0 91 91" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="none" stroke-width="1" fill-rule="evenodd">
                     <g fill-rule="nonzero">
                        <g>
                           <g>
                              <circle cx="3.261" cy="3.445" r="2.72"></circle>
                              <circle cx="15.296" cy="3.445" r="2.719"></circle>
                              <circle cx="27.333" cy="3.445" r="2.72"></circle>
                              <circle cx="39.369" cy="3.445" r="2.72"></circle>
                              <circle cx="51.405" cy="3.445" r="2.72"></circle>
                              <circle cx="63.441" cy="3.445" r="2.72"></circle>
                              <circle cx="75.479" cy="3.445" r="2.72"></circle>
                              <circle cx="87.514" cy="3.445" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 12)">
                              <circle cx="3.261" cy="3.525" r="2.72"></circle>
                              <circle cx="15.296" cy="3.525" r="2.719"></circle>
                              <circle cx="27.333" cy="3.525" r="2.72"></circle>
                              <circle cx="39.369" cy="3.525" r="2.72"></circle>
                              <circle cx="51.405" cy="3.525" r="2.72"></circle>
                              <circle cx="63.441" cy="3.525" r="2.72"></circle>
                              <circle cx="75.479" cy="3.525" r="2.72"></circle>
                              <circle cx="87.514" cy="3.525" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 24)">
                              <circle cx="3.261" cy="3.605" r="2.72"></circle>
                              <circle cx="15.296" cy="3.605" r="2.719"></circle>
                              <circle cx="27.333" cy="3.605" r="2.72"></circle>
                              <circle cx="39.369" cy="3.605" r="2.72"></circle>
                              <circle cx="51.405" cy="3.605" r="2.72"></circle>
                              <circle cx="63.441" cy="3.605" r="2.72"></circle>
                              <circle cx="75.479" cy="3.605" r="2.72"></circle>
                              <circle cx="87.514" cy="3.605" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 36)">
                              <circle cx="3.261" cy="3.686" r="2.72"></circle>
                              <circle cx="15.296" cy="3.686" r="2.719"></circle>
                              <circle cx="27.333" cy="3.686" r="2.72"></circle>
                              <circle cx="39.369" cy="3.686" r="2.72"></circle>
                              <circle cx="51.405" cy="3.686" r="2.72"></circle>
                              <circle cx="63.441" cy="3.686" r="2.72"></circle>
                              <circle cx="75.479" cy="3.686" r="2.72"></circle>
                              <circle cx="87.514" cy="3.686" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 49)">
                              <circle cx="3.261" cy="2.767" r="2.72"></circle>
                              <circle cx="15.296" cy="2.767" r="2.719"></circle>
                              <circle cx="27.333" cy="2.767" r="2.72"></circle>
                              <circle cx="39.369" cy="2.767" r="2.72"></circle>
                              <circle cx="51.405" cy="2.767" r="2.72"></circle>
                              <circle cx="63.441" cy="2.767" r="2.72"></circle>
                              <circle cx="75.479" cy="2.767" r="2.72"></circle>
                              <circle cx="87.514" cy="2.767" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 61)">
                              <circle cx="3.261" cy="2.846" r="2.72"></circle>
                              <circle cx="15.296" cy="2.846" r="2.719"></circle>
                              <circle cx="27.333" cy="2.846" r="2.72"></circle>
                              <circle cx="39.369" cy="2.846" r="2.72"></circle>
                              <circle cx="51.405" cy="2.846" r="2.72"></circle>
                              <circle cx="63.441" cy="2.846" r="2.72"></circle>
                              <circle cx="75.479" cy="2.846" r="2.72"></circle>
                              <circle cx="87.514" cy="2.846" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 73)">
                              <circle cx="3.261" cy="2.926" r="2.72"></circle>
                              <circle cx="15.296" cy="2.926" r="2.719"></circle>
                              <circle cx="27.333" cy="2.926" r="2.72"></circle>
                              <circle cx="39.369" cy="2.926" r="2.72"></circle>
                              <circle cx="51.405" cy="2.926" r="2.72"></circle>
                              <circle cx="63.441" cy="2.926" r="2.72"></circle>
                              <circle cx="75.479" cy="2.926" r="2.72"></circle>
                              <circle cx="87.514" cy="2.926" r="2.719"></circle>
                           </g>
                           <g transform="translate(0 85)">
                              <circle cx="3.261" cy="3.006" r="2.72"></circle>
                              <circle cx="15.296" cy="3.006" r="2.719"></circle>
                              <circle cx="27.333" cy="3.006" r="2.72"></circle>
                              <circle cx="39.369" cy="3.006" r="2.72"></circle>
                              <circle cx="51.405" cy="3.006" r="2.72"></circle>
                              <circle cx="63.441" cy="3.006" r="2.72"></circle>
                              <circle cx="75.479" cy="3.006" r="2.72"></circle>
                              <circle cx="87.514" cy="3.006" r="2.719"></circle>
                           </g>
                        </g>
                     </g>
                  </g>
               </svg>
            </div>
         </div>

         </div>
      </>


   )
};

export default SendMoney;
