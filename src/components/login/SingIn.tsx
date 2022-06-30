import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../../fireabseConfig'
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../store';
import { createUser } from '../../actions/user/createUser';
import { useSelector } from 'react-redux';
import { accountType } from '../../state/slice/accountSlice';
import { createAccount } from '../../actions/account/createAccount';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { At } from 'tabler-icons-react';
import { Container, Group, PasswordInput, TextInput, Input } from '@mantine/core';
import Swal from 'sweetalert2';

interface ISingInProps {
}

const SingIn: React.FunctionComponent<ISingInProps> = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const dispatch = useAppDispatch()
    const status = useSelector(selectUsersStatus())

    useEffect(() => {
        if (status === posibleStatus.IDLE) {
            dispatch(getAllUsers())
        }
    }, [dispatch])

    const getUsers = useSelector(selectUsersState())

    const signInForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        const regularExpression = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        const nameRegularExpresion = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/

        if (email && password.match(regularExpression) && name.match(nameRegularExpresion)) {

            if (getUsers.find(user => user.correo === email)) {
                Swal.fire({
                    title: 'Algo Falló!',
                    text: "El correo ingresado ya existe en la base de datos, por favor ingresa otro.",
                    icon: 'error'
                })
            } else {
                const newUser: userType = {
                    id: nanoid(),
                    nombre: name,
                    correo: email,
                    contrasena: password,
                    rol: 'colaborador',
                    estaActivo: false,
                    correoVerificado: false
                }
                dispatch(createUser(newUser))

                const newAccount: accountType = {
                    id: nanoid(),
                    correoUsuario: email,
                    monto: 0
                }
                dispatch(createAccount(newAccount))

                createUserWithEmailAndPassword(auth, email, password)
                    .then((result) => {
                        sendEmailVerification(result.user)
                        Swal.fire({
                            title: 'Solicitud Enviada!',
                            text: "Se ha enviado un correo de verificación. Revisa tu bandeja de entrada o de correos no deseados " + result.user.email,
                            icon: 'success'
                        })
                    })
                    .catch((error) => {
                        const errorMessage = error.message
                        if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
                            Swal.fire({
                                title: 'Algo Falló!',
                                text: "El correo ingresado ya existe en la base de datos, por favor ingresa otro.",
                                icon: 'error'
                            })
                        }

                        if (errorMessage === "Firebase: Error (auth/invalid-email).") {
                            Swal.fire({
                                title: 'Algo Falló!',
                                text: "Has ingresado un correo incorrecto",
                                icon: 'error'
                            })
                        }
                    });
            }
            setEmail('')
            setPassword('')
            setName('')
        } else {
            if (!name.match(nameRegularExpresion)) {
                Swal.fire({
                    title: 'Algo Falló!',
                    text: "El nombre no debe contener caracteres especiales ni numeros. Se debe tener mínimo un nombre de dos letras para realizar el registro",
                    icon: 'error'
                })
            }
            if (!password.match(regularExpression)) {
                Swal.fire({
                    title: 'Algo Falló!',
                    text: "La contraseña debe contar con al menos: Una letra en mayúscula, Una letra en minúscula, Un dígito, Un caracter especiales, y al menos ocho caracteres.",
                    icon: 'error'
                })
            }
            if (!email || !password || !name) {
                Swal.fire({
                    title: 'Algo Falló!',
                    text: "Todos los campos deben tener información.",
                    icon: 'error'
                })
            }
        }
    }

    return (
        <>
            <Container size="xs" px="xs" my='xs'>
                <form >
                    <Group position='left' my='xs'>
                        <TextInput
                            placeholder="Your name"
                            label="Name"
                            className="w-full"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </Group>

                    <Group position='left'>
                        <Input
                            onChange={(e: any) => setEmail(e.target.value)}
                            icon={<At />}
                            variant="filled"
                            className="w-full"
                            placeholder="Your email"
                            radius="md"
                            value={email}
                        />
                    </Group>
                    <Group position='left' my='xs'>
                        <PasswordInput
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            value={password}
                            placeholder="Password"
                            description="La contraseña debe contener al menos 8 caracteres, minúscula, mayúscula, al menos un número y al menos un caracter especial"
                            variant="filled"
                            radius="md"
                            required
                        />
                    </Group>
                    <button role="button"
                        onClick={(e) => signInForm(e)}
                        data-bs-dismiss="modal"
                        className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full">
                        Regístrese
                    </button>
                </form>
            </Container>
        </>
    )
};

export default SingIn;
