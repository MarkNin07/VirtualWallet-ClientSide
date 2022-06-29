import * as React from "react"
import { Aside, MediaQuery, ScrollArea, Text } from "@mantine/core";
import { Table } from '@mantine/core';
import { posibleStatus, selectUsersState, userType } from "../../../state/slice/userSlice";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../../actions/user/getAllUsers";
import { RootState, useAppDispatch } from "../../../store";

interface IProps {
}

const ShellAside: React.FC<IProps> = () => {

    const dispatch = useAppDispatch();
  const { emailState } = useSelector((state: RootState) => state.logged)

    React.useEffect(() => {
        if (status === posibleStatus.IDLE) {
            dispatch(getAllUsers())
        }
    }, [dispatch])

    const getUsers = useSelector(selectUsersState())

    const realUser: userType | undefined = getUsers.find((user) => user.correo === emailState)

    const ths = (
        <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Correo</th>
            <th>Saldo</th>
        </tr>
    );

    const rows = (
        <tr key={realUser?.id}>
            <td>{realUser?.nombre!}</td>
            <td>{realUser?.rol}</td>
            <td>{realUser?.correo}</td>
            <td>{0}</td>
        </tr>
    );

    return (<>

        <Table style={{marginTop:"10%", justifyContent:"flex-start", height:"10%", width:"80%", alignItems:"center"}} highlightOnHover captionSide="top">
            <caption>Resumen de cuenta</caption>
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
        </Table>
    </>
    )
}

export default ShellAside

