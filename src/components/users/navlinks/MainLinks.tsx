import React from 'react';
import {BrandPaypal, ClipboardText, Coin, Home, ReportMoney, ZoomMoney} from 'tabler-icons-react';
import {Group, Text, ThemeIcon, UnstyledButton} from '@mantine/core';
import {useNavigate} from "react-router-dom";

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    path: string
}

function MainLink({ icon, color, label, path }: MainLinkProps) {
    const navigate = useNavigate()
    return (
        <UnstyledButton
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
            onClick={() => navigate(path)}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}


const data = [

    { icon: <ZoomMoney size={16} />, color: 'blue', label: 'Movimientos', path: '/perfil/movimientos' },
    { icon: <ReportMoney size={16} />, color:'green', strokeWidth:2, label: 'Ingresos', path: '/perfil/ingresos' },
    { icon: <Coin size={16} />, color: 'orange', label: 'Egresos', path: '/perfil/egresos' },
    { icon: <BrandPaypal size={16} />, color: 'pink', label: 'Enviar Dinero', path: '/perfil/sendMoney' }
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div>{links}</div>;
}