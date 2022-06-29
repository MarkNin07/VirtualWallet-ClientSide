import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../actions/user/getAllUsers';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../store';
import User from './User';
import { auth } from '../../fireabseConfig';
import { updateUser } from '../../actions/user/updateUser';
import { AppShell, Navbar, Header, Footer, Aside, Text, MediaQuery, Burger, useMantineTheme, } from '@mantine/core';
import ShellNavbar from './navlinks/ShellNavbar';
import ShellAside from './navlinks/ShellAside';
import ShellFooter from './navlinks/ShellFooter';
import ShellHeader from './navlinks/ShellHeader';


interface IUserListProps {
}

const UserList: React.FunctionComponent<IUserListProps> = (props) => {

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const main = { background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1], }

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === posibleStatus.IDLE) {
      dispatch(getAllUsers())
    }
  }, [dispatch])

  const getUsers = useSelector(selectUsersState())
  const status = useSelector(selectUsersStatus())

  const { emailState } = useSelector((state: RootState) => state.logged)

  const realUser: userType | undefined = getUsers.find((user) => user.correo === emailState)

  const closeSession = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    navigate('/')


  }


  return (

    <AppShell
      styles={{ main }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<ShellNavbar opened={opened} />}
      aside={<ShellAside />}
      footer={<ShellFooter />}
      header={<ShellHeader opened={opened} setOpened={setOpened} />}
    >

    </AppShell>
  );

}

export default UserList;
