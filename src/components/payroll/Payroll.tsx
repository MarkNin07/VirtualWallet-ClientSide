import { MouseEvent, ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { account } from '../../state/slice/payrollSlice';
import * as XLSX from 'xlsx';
import { Stack } from 'react-bootstrap';
import { posibleStatus, selectUsersFetchError, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { getAllUsers } from '../../actions/user/getAllUsers';
import './Payroll.css'
import { accountType, selectAccountsFetchError, selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { selectTransactionsFetchError, selectTransactionsState, selectTransactionsStatus, transactionType } from '../../state/slice/transactionSlice';
import { getAllAccountsFinal } from '../../actions/account/getAllAccounts';
import { getAllTransactions } from '../../actions/transactions/getAllTransactions';
import { createTransaction } from '../../actions/transactions/createTransaction';
import { updateAccount } from '../../actions/account/updateAccount';
import { createAccount } from '../../actions/account/createAccount';
import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../actions/user/updateUser';
import { auth } from '../../fireabseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from '@mantine/core';

interface IUserProps {
}

interface excelData {
    ID: string
    Monto: number
}

const PayRoll: FunctionComponent<IUserProps> = (props) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const usersLists = useAppSelector(selectUsersState());
    const usersStatus = useAppSelector(selectUsersStatus());
    const usersErrors = useAppSelector(selectUsersFetchError());

    const accountsLists = useAppSelector(selectAccountsState());
    const accountsStatus = useAppSelector(selectAccountsStatus());
    const accountsErrors = useAppSelector(selectAccountsFetchError());

    const transactionsLists = useAppSelector(selectTransactionsState());
    const transactionsStatus = useAppSelector(selectTransactionsStatus());
    const transactionsErrors = useAppSelector(selectTransactionsFetchError());

    useEffect(() => {
        if (usersStatus === posibleStatus.IDLE) {
            dispatch(getAllUsers())
        }
    }, [usersStatus, dispatch])

    useEffect(() => {
        if (accountsStatus === posibleStatus.IDLE) {
            dispatch(getAllAccountsFinal())
        }
    }, [accountsStatus, dispatch])

    useEffect(() => {
        if (transactionsStatus === posibleStatus.IDLE) {
            dispatch(getAllTransactions())
        }
    }, [transactionsStatus, dispatch])

    const [excelState, setExcelState] = useState<account[]>([]);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [showTable, setShowTable] = useState<boolean>(false);

    const { emailState } = useAppSelector((state: RootState) => state.logged)

    const realUser: userType | undefined = usersLists.find((user) => user.correo === emailState)

    const readExcel = (file: any) => {
        setShowButton(false);
        setShowTable(false);

        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            try {
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {

                    const bufferArray = e.target?.result;

                    try {
                        const wb = XLSX.read(bufferArray, { type: 'buffer' });
                        if (wb.Props === undefined) {
                            Swal.fire({
                                title: '¡Formato Incorrecto!',
                                text: "El archivo seleccionado NO es 'excel'",
                                icon: 'error'
                            })

                            setShowTable(false);
                            return
                        }
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws);
                        resolve(data);
                    } catch (e) {
                        if (typeof e === "string") {
                            console.log(e)
                        } else if (e instanceof Error) {
                            Swal.fire({
                                title: '¡Formato Incorrecto!',
                                text: "El archivo seleccionado NO es 'excel'",
                                icon: 'error'
                            })
                            setShowTable(false);
                        }
                        setExcelState([]);
                    }
                }

                fileReader.onerror = (error) => {
                    setExcelState([]);
                    reject(error);
                }

            } catch (e) {
                if (typeof e === "string") {
                    console.log(e)
                } else if (e instanceof Error) {
                    let r: string = e.message
                }
                setExcelState([]);
            }
        })

        promise.then((d) => {
            const jsonData = d as account[]
            if (jsonData.filter((account) => (
                typeof account.ID === "string" &&
                typeof account.Monto === "number"
            )).length == 0) {
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "El archivo seleccionado NO tiene un formato válido",
                    icon: 'error'
                })

                setShowTable(false);
                setExcelState([]);
                return
            }
            if (jsonData.filter((account) => (
                typeof account.Monto !== 'number'
            )).length !== 0) {
                const errorData = jsonData.filter((account) => (
                    typeof account.Monto !== 'number'
                ))
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "Los siguientes registros tienen Montos con datos NO numéricos, para poder procesar el archivo debe corregirlos o eliminarlos",
                    icon: 'error'
                })
                setExcelState(errorData);
                setShowTable(true);
                return
            }
            if (jsonData.filter((account) => (
                account.Monto <= 0
            )).length !== 0) {
                const errorData = jsonData.filter((account) => (
                    account.Monto <= 0
                ))
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "Los siguientes registros tienen Montos en cero (0) o negativos, para poder procesar el archivo debe corregirlos o eliminarlos",
                    icon: 'error'
                })

                setExcelState(errorData);
                setShowTable(true);
                return
            }
            const adminUser = usersLists.find((user) => user.rol === 'admin');
            if (!adminUser) {
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "El sistema debe tener creada una cuenta administrador, para poder procesar el archivo comuniquese con Grupo 3",
                    icon: 'error'
                })
                return
            }
            const invalidUser = jsonData.filter((account) => {
                if (account.ID === adminUser.correo) {
                    return true
                }
                if (usersLists.find((user) => user.correo === account.ID)) {
                    return false
                }
                return true
            })
            if (invalidUser.length > 0) {
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "Los siguientes registros tienen Cuentas inválidas, para poder procesar el archivo debe corregirlas o eliminarlas",
                    icon: 'error'
                })
                setExcelState(invalidUser);
                setShowTable(true);
                return
            }
            const notDuplicated = new Set()
            const Duplicated = new Array()
            jsonData.forEach((email) => {
                notDuplicated.add(email.ID)
                Duplicated.push(email.ID)
            })
            if (notDuplicated.size !== Duplicated.length) {
                Swal.fire({
                    title: '¡Formato Incorrecto!',
                    text: "Los siguientes registros tienen Cuentas duplicadas, para poder procesar el archivo debe eliminarlas",
                    icon: 'error'
                })
                return
            }
            setExcelState(jsonData);
            setShowTable(true);
            setShowButton(true);
        })
    }

    const executePayroll = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        Swal.fire({
            title: 'Esta Seguro?',
            text: "Este proceso no puede ser reversado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, efectue el pago!'
        }).then((result) => {
            if (result.isConfirmed) {
                setShowButton(false);
                const adminUser = usersLists.find((user) => user.rol === 'admin');
                if (adminUser) {
                    excelState.map((trans) => {
                        const newTransaction: transactionType = {
                            id: nanoid(),
                            fecha: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
                            correoOrigen: adminUser.correo as string,
                            correoDestino: trans.ID,
                            valor: trans.Monto
                        }
                        dispatch(createTransaction(newTransaction));
                        const account = accountsLists.find((account) => account.correoUsuario === trans.ID);
                        if (account) {
                            const newAccount: accountType = {
                                id: account.id,
                                correoUsuario: account.correoUsuario,
                                monto: account?.monto! + trans.Monto
                            }
                            dispatch(updateAccount(newAccount));
                        } else {
                            const newAccount = { id: nanoid(), correoUsuario: trans.ID, monto: trans.Monto }
                            dispatch(createAccount(newAccount));
                        }
                        // hacer el logout de la aplicacion y enviarlo al login
                    })
                }
                Swal.fire({
                    title: 'Excelente!',
                    text: 'se ha efectuado el pago de nómina',
                    icon: 'success',
                })
            }
        })
    }

    const userLogout = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();
        Swal.fire({
            title: 'Esta Seguro?',
            text: "Realmente desea salir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si'
        }).then((result) => {
            if (result.isConfirmed) {
                const UserSessionUpdated: userType = {
                    id: realUser?.id!,
                    nombre: realUser?.nombre!,
                    correo: realUser?.correo!,
                    contrasena: realUser?.contrasena!,
                    rol: realUser?.rol,
                    estaActivo: false,
                    correoVerificado: realUser?.correoVerificado!
                }
                dispatch(updateUser(UserSessionUpdated))
                signOut(auth)
                Swal.fire({
                    title: 'Gracias!',
                    text: 'Ha salido del aplicativo',
                    icon: 'success'
                })
                navigate('/')
            }
        })

    }

    const downloadTemplate = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault();

        const jsonData: excelData[] = [];

        usersLists.forEach((user) => {
            if (user.rol !== 'admin') {
                const data: excelData = {
                    ID: user.correo as string,
                    Monto: 0
                }
                jsonData.push(data);
            }
        })

        if (jsonData.length >= 0) {
            if (jsonData.length === 0) {
                jsonData.push({ ID: "", Monto: 0})
            }
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(jsonData);

            XLSX.utils.book_append_sheet(wb, ws, "Hoja1");

            XLSX.writeFile(wb, 'plantillanomina.xlsx');
        }

    }
    const ths = (
        <tr>
            <th>#</th>
            <th>Cuenta Destino</th>
            <th>Monto</th>
        </tr>
    );

    const rows = excelState.map((payment: account) => (
        <tr key={payment.__rowNum__}>
            <td>{payment.__rowNum__}</td>
            <td>{payment.ID}</td>
            <td>{payment.Monto}</td>
        </tr>
    ));
    return (
        <div style={{ padding: "5%" }}>
            <Stack gap={2}>
                <div className="bg-light border">
                    <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-blue-600">Pago de Nómina</h1>
                </div>
                <div className='d-grid gap-2'>

                    <Button onClick={(e: any) => downloadTemplate(e)} fullWidth variant="outline">
                        Descargar Plantilla para Pago de Nómina
                    </Button>

                </div>
                <>

                    <input type="file" className="text-sm text-grey-500
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700 w-full"
            accept='.xls,.xlsx,application/msexcel'
            required
            placeholder="Seleccione el archivo"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files != null) {
                    const file = e.target.files[0]
                    readExcel(file)
                }
            }} />

                </>

                <div className='d-grid gap-2'>
                    <Button color="red" onClick={(e: any) => userLogout(e)} fullWidth variant="outline">
                        Salir
                    </Button>

                </div>
                <>
                    {showButton &&
                        <div className='d-grid gap-2'>
                            <Button name="executePayroll" onClick={(e: any) => executePayroll(e)} fullWidth variant="outline">
                                Realizar el Pago de Nómina
                            </Button>


                        </div>
                    }
                </>
                <br />
                <>
                    {showTable &&

                        <Table striped highlightOnHover>
                            <caption>Relación de cuentas para pago de nómina</caption>
                            <thead>{ths}</thead>
                            <tbody>{rows}</tbody>
                        </Table>

                    }
                </>
            </Stack>
        </div>
    )
}

export default PayRoll
