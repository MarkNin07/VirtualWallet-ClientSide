import React, { useEffect } from "react"
import { Aside, MediaQuery, ScrollArea, Text } from "@mantine/core";
import { Table } from '@mantine/core';
import { useSelector } from "react-redux";
import { getAllAccountsFinal } from "../../../actions/account/getAllAccounts";
import { getAllUsers } from "../../../actions/user/getAllUsers";
import { selectAccountsStatus, selectAccountsState } from "../../../state/slice/accountSlice";
import { selectUsersStatus, posibleStatus, selectUsersState, userType } from "../../../state/slice/userSlice";
import { useAppDispatch, RootState } from "../../../store";

interface IProps {
}

const Profile: React.FC<IProps> = () => {

    const dispatch = useAppDispatch();
    const { emailState } = useSelector((state: RootState) => state.logged)

    const statusUser = useSelector(selectUsersStatus())

    useEffect(() => {
        if (statusUser === posibleStatus.IDLE) {
            dispatch(getAllUsers())
        }
    }, [dispatch])

    const getUsers = useSelector(selectUsersState())

    const realUser: userType | undefined = getUsers.find((user) => user.correo === emailState)

    const statusAccount = useSelector(selectAccountsStatus())

    useEffect(() => {
        if (statusAccount === posibleStatus.IDLE) {
            dispatch(getAllAccountsFinal())
        }
    }, [dispatch])

    const getAccounts = useSelector(selectAccountsState())

    const userAccount = getAccounts.find((account) => account.correoUsuario === realUser!.correo)

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
            <td>{userAccount?.monto}</td>
        </tr>
    );

    return (<>

        <Table style={{ marginTop: "10%", justifyContent: "flex-start", height: "10%", width: "80%", alignItems: "center" }} highlightOnHover captionSide="top">
            <caption>Resumen de cuenta</caption>
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
        </Table>
    </>
    )
}

export default Profile