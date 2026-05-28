import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import '../styles/home.scss'
import logo from '../assets/logo.png'
import coinImg from '../assets/coin.png'

export default function Home() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const heroRef = useRef(null)

    const isAuthenticated = !!user
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    const mouseRef = useRef({ x: -9999, y: -9999 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX
            mouseRef.current.y = e.clientY
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY

            if (heroRef.current) {
                heroRef.current.style.transform = `translateY(${scrollY * 0.15}px)`
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const steps = document.querySelectorAll('.step')
        const list = document.querySelector('.steps-list')
        if (!steps.length || !list) return

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')

                        const lastVisible = entry.target
                        const listRect = list.getBoundingClientRect()
                        const stepRect = lastVisible.getBoundingClientRect()

                        const height =
                            stepRect.top - listRect.top + stepRect.height / 2

                        list.style.setProperty('--line-height', `${height}px`)
                    }
                })
            },
            { threshold: 0.3 }
        )

        steps.forEach(step => observer.observe(step))

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const container = document.querySelector('.coins-background')
        if (!container) return

        const isMobile = window.matchMedia('(max-width: 768px)').matches
        const MAX_COINS = isMobile ? 4 : 14

        const coins = []
        const timeScale = isMobile ? 0.25 : 0.45

        const containerRect = container.getBoundingClientRect()
        const floor = containerRect.height - 10

        const createCoin = () => {
            const coin = document.createElement('div')
            coin.className = 'coin'

            const img = document.createElement('img')
            img.src = coinImg
            img.className = 'coin-img'

            coin.appendChild(img)

            const size = Math.random() * 16 + 22
            const spin = Math.random() * 6 + 6

            coin.style.setProperty('--size', `${size}px`)
            coin.style.setProperty('--spin', `${spin}s`)

            const x = Math.random() * (containerRect.width - size)
            coin.style.left = `${x}px`

            const isBig = size > 32
            if (isBig) coin.classList.add('big')

            container.appendChild(coin)

            return {
                el: coin,
                x,
                y: Math.random() * -containerRect.height,

                velocityY: isBig ? Math.random() * 0.18 + 0.05 : Math.random() * 0.3 + 0.12,
                velocityX: 0,

                gravity: isBig ? 0.08 : 0.12,
                friction: 0.98,

                bounce: isBig ? 0.25 : 0.35,
                bounceCount: 0,
                maxBounces: isBig ? 1 : 2,

                size,
                isBig,
                sparkleCooldown: 0
            }
        }

        for (let i = 0; i < MAX_COINS; i++) {
            coins.push(createCoin())
        }

        let isVisible = true

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting
            },
            { threshold: 0.1 }
        )

        observer.observe(container)

        let rafId

        const animate = () => {
            if (!isVisible) {
                rafId = requestAnimationFrame(animate)
                return
            }

            coins.forEach(coin => {
                /* =====================
                   MOVIMENTO
                ===================== */

                if (isMobile) {
                    coin.y += 0.6

                    if (coin.y > floor) {
                        coin.y = -coin.size - Math.random() * 100
                        coin.x = Math.random() * (containerRect.width - coin.size)
                    }
                } else {
                    coin.velocityY += coin.gravity * timeScale
                    coin.y += coin.velocityY * timeScale

                    /* =====================
                       INTERAÇÃO COM MOUSE
                    ===================== */

                    const influenceRadius = 110
                    const pushStrength = 0.75

                    const rect = coin.el.getBoundingClientRect()
                    const cx = rect.left + rect.width / 2
                    const cy = rect.top + rect.height / 2

                    const dx = cx - mouseRef.current.x
                    const dy = cy - mouseRef.current.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < influenceRadius) {
                        const force = (1 - distance / influenceRadius) * pushStrength
                        coin.velocityX += (dx / distance) * force
                        coin.velocityY -= force * 0.18
                    }

                    /* =====================
                       MOVIMENTO HORIZONTAL
                    ===================== */

                    coin.x += coin.velocityX * timeScale
                    coin.velocityX *= coin.friction

                    /* =====================
                       CHÃO / RESET
                    ===================== */

                    if (coin.y >= floor) {
                        coin.y = floor

                        if (coin.bounceCount < coin.maxBounces) {
                            coin.velocityY *= -coin.bounce
                            coin.bounceCount++
                        } else {
                            coin.y = -coin.size - Math.random() * 120
                            coin.velocityY = Math.random() * 0.3 + 0.12
                            coin.velocityX = 0
                            coin.bounceCount = 0
                            coin.x = Math.random() * (containerRect.width - coin.size)
                        }
                    }

                    /* =====================
                       SPARKLE (DESKTOP)
                    ===================== */

                    if (coin.isBig && Math.random() < 0.002) {
                        if (coin.sparkleCooldown <= 0) {
                            coin.el.classList.add('has-sparkle')
                            coin.sparkleCooldown = 120
                        }
                    }
                }

                /* =====================
                   SPARKLE COOLDOWN
                ===================== */

                if (coin.sparkleCooldown > 0) {
                    coin.sparkleCooldown--
                    if (coin.sparkleCooldown === 45) {
                        coin.el.classList.remove('has-sparkle')
                    }
                }

                /* =====================
                   TRANSFORM FINAL
                ===================== */

                coin.el.style.transform = `translate3d(${coin.x}px, ${coin.y}px, 0)`
            })

            rafId = requestAnimationFrame(animate)
        }



        animate()

        return () => {
            cancelAnimationFrame(rafId)
            container.innerHTML = ''
        }
    }, [])

    return (
        <div className="home">
            {/* NAVBAR */}
            <header className="home-header">
                <div className="container header-content">
                    <div className="logo">
                        <img src={logo} alt="Kakebox Pix" />
                    </div>

                    <div className="actions">
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/dashboard')}>
                                Dashboard
                            </button>
                        ) : (
                            <button
                                className="primary"
                                onClick={() => navigate('/login')}
                            >
                                Começar agora
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="hero">
                <div className="coins-background" />

                <div className="hero-content">
                    <h1>
                        Economizar dinheiro
                        <br />
                        ficou simples.
                    </h1>

                    <p>
                        O Kakebox Pix combina o método de poupança japonês Kakebo com a tecnologia Pix para ajudar você a atingir seus objetivos financeiros de forma fácil e segura.
                    </p>

                    <div className="hero-actions">
                        <button
                            className="hero-cta primary"
                            onClick={() => navigate('/login')}
                        >
                            Começar agora
                        </button>

                        <button
                            className="hero-cta secondary"
                            onClick={() => {
                                const section = document.getElementById('como-funciona')
                                section?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            Ver como funciona
                        </button>
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="features" id="como-funciona">
                <div className="container">
                    <h2>Como funciona?</h2>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3>🎯 Crie um desafio</h3>
                            <p>
                                Defina o valor total que deseja economizar e o
                                intervalo dos depósitos.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>🎲 Valores aleatórios</h3>
                            <p>
                                O sistema gera valores aleatórios para tornar o
                                processo mais motivador.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>⚡ Pague com Pix</h3>
                            <p>
                                Faça depósitos instantâneos via Pix e acompanhe
                                tudo em tempo real.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PASSOS */}
            <section className="steps">
                <div className="container">
                    <h2>Comece em poucos passos</h2>

                    <ol className="steps-list">
                        <li className="step">
                            <h3>Crie sua conta</h3>
                            <p>
                                Faça login e tenha acesso a todas as funcionalidades
                                do Kakebox Pix.
                            </p>
                        </li>

                        <li className="step">
                            <h3>Cadastre sua chave Pix</h3>
                            <p>
                                Configure sua chave Pix (CPF, e-mail, telefone ou CNPJ)
                                para receber seus depósitos.
                            </p>
                        </li>

                        <li className="step">
                            <h3>Crie seu primeiro cofre</h3>
                            <p>
                                Defina sua meta de economia, nome do cofre e o intervalo
                                de valores sugeridos.
                            </p>
                        </li>

                        <li className="step">
                            <h3>Comece a economizar</h3>
                            <p>
                                Escolha um valor sugerido, escaneie o QR Code Pix
                                e realize seu depósito.
                            </p>
                        </li>
                    </ol>
                </div>
            </section>


            {/* BENEFÍCIOS */}
            <section className="benefits">
                <div className="container">
                    <h2>Por que usar o Kakebox Pix?</h2>

                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <span className="benefit-icon">🔒</span>
                            <h3>Seguro e confiável</h3>
                            <p>
                                Seus dados estão protegidos e todos os depósitos
                                são realizados exclusivamente através do sistema
                                Pix oficial.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <span className="benefit-icon">📱</span>
                            <h3>100% digital</h3>
                            <p>
                                Acesse de qualquer dispositivo. Seu cofre
                                digital sempre com você, no bolso.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <span className="benefit-icon">📊</span>
                            <h3>Visualize seu progresso</h3>
                            <p>
                                Gráficos intuitivos mostram exatamente quanto você
                                já economizou e o que falta para atingir seu objetivo.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <span className="benefit-icon">📘</span>
                            <h3>Método comprovado</h3>
                            <p>
                                Baseado no Kakebo, um método japonês de educação
                                financeira com mais de 100 anos de sucesso.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="cta">
                <div className="container">
                    <h2>Pronto para mudar sua relação com o dinheiro?</h2>
                    <p>
                        Transforme o hábito de poupar em algo simples e
                        prazeroso.
                    </p>

                    {!isAuthenticated && (
                        <button
                            className="cta-final-button"
                            onClick={() => navigate('/login')}
                        >
                            Começar agora
                        </button>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="container">
                    <p>
                        © {new Date().getFullYear()} Kakebox Pix — Todos os
                        direitos reservados
                    </p>
                </div>
            </footer>
        </div>
    )
}
