import * as React from "react"
import { Menu, Avatar, Burger, Group, Header, MediaQuery, Title, UnstyledButton, useMantineTheme } from "@mantine/core";
import ToggleDarkButton from "../ToggleDarkButton";
import { forwardRef } from "react";
import { ChevronRight } from 'tabler-icons-react';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../../actions/user/getAllUsers';
import { posibleStatus, selectUsersState, selectUsersStatus, userType } from '../../../state/slice/userSlice';
import { RootState, useAppDispatch } from '../../../store';
import User from '../User';
import { auth } from '../../../fireabseConfig';
import { updateUser } from '../../../actions/user/updateUser';

interface IProps {
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}
interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    image: string;

    icon?: React.ReactNode;
}

const ShellHeader: React.FC<IProps> = ({ setOpened, opened }) => {


    const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
        ({ image, icon, ...others }: UserButtonProps, ref) => (
            <UnstyledButton
                ref={ref}
                sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.md,
                    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    },
                })}
                {...others}
            >
                <Group>
                    <Avatar src={image} radius="xl" />

                    {icon || <ChevronRight size={16} />}
                </Group>
            </UnstyledButton>
        ))

    const theme = useMantineTheme();


    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    React.useEffect(() => {
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

    return <Header height={70} p="md">
        <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'space-between'
        }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color={theme.colors.gray[6]}
                    mr="xl"
                />
            </MediaQuery>

            <Title order={3}>Virtual Wallet </Title>

            <ToggleDarkButton />

            <Group position="center">
                <Menu
                    withArrow
                    placement="center"
                    control={
                        <UserButton
                            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                        />
                    }
                >
                            <button onClick={(e) => closeSession(e)} className='separacion'>Cerrar Sesión</button>
                </Menu>
            </Group>
        </div>
    </Header>
}

export default ShellHeader


