import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, useMantineTheme, } from '@mantine/core';
import ShellNavbar from './navlinks/ShellNavbar';
import ShellFooter from './navlinks/ShellFooter';
import ShellHeader from './navlinks/ShellHeader';

interface IUserListProps {
}

const UserList: React.FunctionComponent<IUserListProps> = (props) => {

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const main = { background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.white, }

  return (

    <AppShell
      styles={{ main }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<ShellNavbar opened={opened} />}
      footer={<ShellFooter />}
      header={<ShellHeader opened={opened} setOpened={setOpened} />}
    >
      <Outlet />
    </AppShell>
  );

}

export default UserList;
function useAppNavigate() {
  throw new Error('Function not implemented.');
}

