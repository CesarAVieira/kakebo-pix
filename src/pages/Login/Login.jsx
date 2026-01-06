import { useState, useEffect } from 'react'
import styles from './Login.module.scss'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const {
        user,
        loginEmail,
        registerEmail,
        loginGoogle,
        loginFacebook,
        loginGithub,
        resetPassword
    } = useAuth()

    const [isRegister, setIsRegister] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showReset, setShowReset] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const getAuthError = code => {
        switch (code) {
            case 'auth/weak-password':
                return 'A senha deve ter no mínimo 6 caracteres'
            case 'auth/email-already-in-use':
                return 'Este email já está em uso'
            case 'auth/invalid-email':
                return 'Email inválido'
            case 'auth/user-not-found':
                return 'Usuário não encontrado'
            case 'auth/wrong-password':
                return 'Senha incorreta'
            default:
                return 'Erro ao autenticar'
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} ${isRegister ? styles.active : ''}`}>

                {/* LOGIN */}
                <div className={`${styles.formBox} ${styles.login}`}>
                    <form
                        className={styles.form}
                        onSubmit={async e => {
                            e.preventDefault()
                            setMessage('')

                            try {
                                await loginEmail(email, password)
                            } catch (err) {
                                setMessage(getAuthError(err.code))
                            }
                        }}
                    >
                        <h1 className={styles.title}>Login</h1>

                        <div className={styles.inputBox}>
                            <input
                                type="email"
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <i className="bx bxs-user" />
                        </div>

                        <div className={styles.inputBox}>
                            <input
                                type="password"
                                placeholder="Senha"
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock-alt" />
                        </div>

                        <div className={styles.forgot}>
                            <button type="button" onClick={() => setShowReset(true)}>
                                Forgot password?
                            </button>
                        </div>

                        <button className={styles.btn}>Login</button>

                        <p className={styles.text}>ou entrar com</p>

                        <div className={styles.social}>
                            <button type="button" onClick={loginFacebook}>
                                <i className="bx bxl-facebook" />
                            </button>
                            <button type="button" onClick={loginGoogle}>
                                <i className="bx bxl-google" />
                            </button>
                            <button type="button" onClick={loginGithub}>
                                <i className="bx bxl-github" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* REGISTER */}
                <div className={`${styles.formBox} ${styles.register}`}>
                    <form
                        className={styles.form}
                        onSubmit={async e => {
                            e.preventDefault()
                            setMessage('')

                            if (password.length < 6) {
                                setMessage('A senha deve ter no mínimo 6 caracteres')
                                return
                            }

                            try {
                                await registerEmail(email, password, username)
                            } catch (err) {
                                setMessage(getAuthError(err.code))
                            }
                        }}
                    >
                        <h1 className={styles.title}>Registro</h1>

                        <div className={styles.inputBox}>
                            <input
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <i className="bx bxs-user" />
                        </div>

                        <div className={styles.inputBox}>
                            <input
                                type="email"
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <i className="bx bx-envelope" />
                        </div>

                        <div className={styles.inputBox}>
                            <input
                                type="password"
                                placeholder="Senha"
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock-alt" />
                        </div>

                        {message && <small className={styles.error}>{message}</small>}

                        <button className={styles.btn}>Registrar</button>
                    </form>
                </div>

                {/* TOGGLE */}
                <div className={styles.toggleBox}>
                    <div className={`${styles.togglePanel} ${styles.left}`}>
                        <h1>Olá! Bem Vindo!</h1>
                        <p>Não tem conta?</p>
                        <button className={styles.btnTogglePanel} onClick={() => setIsRegister(true)}>
                            Registrar
                        </button>
                    </div>

                    <div className={`${styles.togglePanel} ${styles.right}`}>
                        <h1>Bem-vindo!</h1>
                        <p>Já tem conta?</p>
                        <button className={styles.btnTogglePanel} onClick={() => setIsRegister(false)}>
                            Login
                        </button>
                    </div>
                </div>

                {/* RESET PASSWORD */}
                {showReset && (
                    <div className={styles.resetOverlay}>
                        <div className={styles.resetBox}>
                            <h2>Resetar senha</h2>
                            <p>Digite seu email para receber o link</p>

                            <input
                                type="email"
                                placeholder="Seu email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            {message && <small>{message}</small>}

                            <div className={styles.resetActions}>
                                <button
                                    onClick={async () => {
                                        try {
                                            await resetPassword(email)
                                            setMessage('Email enviado com sucesso!')
                                        } catch {
                                            setMessage('Erro ao enviar email')
                                        }
                                    }}
                                >
                                    Enviar
                                </button>

                                <button onClick={() => setShowReset(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
