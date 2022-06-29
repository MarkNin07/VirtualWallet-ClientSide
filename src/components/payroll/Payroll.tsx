import { MouseEvent, ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { account } from '../../state/slice/payrollSlice';
import * as XLSX from 'xlsx';
import { Alert, Button, Form, Stack, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { posibleStatus, selectUsersFetchError, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { getAllUsers } from '../../actions/user/getAllUsers';
import './Payroll.css'
import { selectAccountsFetchError, selectAccountsState, selectAccountsStatus } from '../../state/slice/accountSlice';
import { selectTransactionsFetchError, selectTransactionsState, selectTransactionsStatus, transactionType } from '../../state/slice/transactionSlice';
import { getAllAccountsFinal } from '../../actions/account/getAllAccounts';
import { getAllTransactions } from '../../actions/transactions/getAllTransactions';
import { createTransaction } from '../../actions/transactions/createTransaction';
import { updateAccount } from '../../actions/account/updateAccount';
import { createAccount } from '../../actions/account/createAccount';
import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import { RootState } from '../../store';
import { updateUser } from '../../actions/user/updateUser';
import { auth } from '../../fireabseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
    const [showError, setShowError] = useState<boolean>(false);
    const [showTable, setShowTable] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { emailState } = useAppSelector((state: RootState) => state.logged)

    const realUser: userType | undefined = usersLists.find((user) => user.correo === emailState)

    const readExcel = (file: any) => {
        setShowError(false);
        setShowButton(false);
        setShowTable(false);
        setErrorMessage("");
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            try {
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {

                    const bufferArray = e.target?.result;

                    try {
                        const wb = XLSX.read(bufferArray, { type: 'buffer' });
                        if (wb.Props === undefined) {
                            setErrorMessage("El archivo seleccionado NO es 'excel'")
                            setShowError(true);
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
                            setErrorMessage("El archivo seleccionado NO es 'excel'")
                            setShowError(true);
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
                setErrorMessage("El archivo seleccionado NO tiene un formato válido")
                setShowError(true);
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
                setErrorMessage("Los siguientes registros tienen Montos con datos NO numéricos, para poder procesar el archivo debe corregirlos o eliminarlos")
                setShowError(true);
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
                setErrorMessage("Los siguientes registros tienen Montos en cero (0) o negativos, para poder procesar el archivo debe corregirlos o eliminarlos")
                setShowError(true);
                setExcelState(errorData);
                setShowTable(true);
                return
            }
            const adminUser = usersLists.find((user) => user.rol === 'admin');
            if (!adminUser) {
                setErrorMessage("El sistema debe tener creada una cuenta administrador, para poder procesar el archivo comuniquese con Grupo 3")
                setShowError(true);
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
                setErrorMessage("Los siguientes registros tienen Cuentas inválidas, para poder procesar el archivo debe corregirlas o eliminarlas")
                setShowError(true);
                setExcelState(invalidUser);
                setShowTable(true);
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
                        if (account && account.monto) {
                            const newAccount = { ...account, monto: (account.monto + trans.Monto) }
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

        if (jsonData.length > 0) {
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(jsonData);

            XLSX.utils.book_append_sheet(wb, ws, "Hoja1");

            XLSX.writeFile(wb, 'plantillanomina.xlsx');
        }

    }

    return (
        <>
            <Stack gap={2}>
                <div className="bg-light border">
                    <h1 style={{ marginLeft: '1rem' }}>Pago de Nómina</h1>
                </div>
                <div className='d-grid gap-2'>
                    <Button
                        onClick={(e) => downloadTemplate(e)}
                        className='download-button'
                        size="lg"
                    >Descargar Plantilla para Pago de Nómina</Button>
                </div>
                <Form.Group controlId="formFileLg" className="mb-3">
                    <Form.Control
                        className='file-input'
                        type="file"
                        size="lg"
                        accept='.xls,.xlsx,application/msexcel'
                        required
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files != null) {
                                const file = e.target.files[0]
                                readExcel(file)
                            }
                        }}
                    />
                </Form.Group>
                <>
                    {showError &&
                        <Alert variant="warning">
                            <Alert.Heading>
                                <h5>Advertencia!!!</h5>
                            </Alert.Heading>
                            <p>{errorMessage}</p>
                            <Button onClick={() => setShowError(false)}>Cerrar</Button>
                        </Alert>
                    }
                </>
                <div className='d-grid gap-2'>
                    <Button
                        onClick={(e) => userLogout(e)}
                        variant="outline-danger"
                        size="lg"
                    >Salir</Button>
                </div>
                <>
                    {showButton &&
                        <div className='d-grid gap-2'>
                            <Button
                                className='download-button'
                                name="executePayroll"
                                size="lg"
                                onClick={(e) => executePayroll(e)}
                            >Realizar el Pago de Nómina</Button>
                        </div>
                    }
                </>
                <br />
                <>
                    {showTable &&
                        <Table striped bordered hover className='container'>
                            <thead className='table-head'>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>ID Cuenta</th>
                                    <th scope='col'>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelState.map((payment: account) => (
                                    <tr key={payment.__rowNum__}>
                                        <th scope='row'>{payment.__rowNum__}</th>
                                        <td>{payment.ID}</td>
                                        <td>{payment.Monto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    }
                </>
            </Stack>
        </>
    )
}

export default PayRoll
