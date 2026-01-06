import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const navItems = [
        { label: 'Painel', path: '/dashboard' },
        { label: 'Histórico', path: '/historico' },
        { label: 'Configurações', path: '/configuracoes' }
    ]

    const linkStyle = ({ isActive }) => ({
        color: isActive ? '#00C853' : '#0f172a',
        textDecoration: 'none',
        fontWeight: isActive ? 600 : 500,
        marginRight: '20px',
        paddingBottom: '4px',
        borderBottom: isActive
            ? '2px solid #00C853'
            : '2px solid transparent',
        transition: 'all 0.2s ease'
    })

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb'
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            height: 64
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Kakebox Pix"
                            sx={{ height: 56 }}
                        />
                    </Box>

                    {/* Desktop menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {navItems.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={linkStyle}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </Box>

                    {/* Desktop logout */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{
                                color: '#dc2626',
                                borderColor: '#dc2626',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor:
                                        'rgba(220,38,38,0.08)',
                                    borderColor: '#b91c1c'
                                }
                            }}
                        >
                            Sair
                        </Button>
                    </Box>

                    {/* Mobile menu button */}
                    <IconButton
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            color: '#0f172a'
                        }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Kakebox Pix"
                            sx={{ height: 48, cursor: 'pointer' }}
                        />
                    </Box>

                    <Divider />

                    <List>
                        {navItems.map(item => (
                            <ListItem
                                button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path)
                                    setOpen(false)
                                }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>

                    <Divider />

                    <Box sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}
