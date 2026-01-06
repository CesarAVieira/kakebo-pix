import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function UserSettings() {
    const { user, updateUser } = useAuth()

    const [nome, setNome] = useState(user.nome)
    const [chavePix, setChavePix] = useState(user.chavePix)
    const [cidade, setCidade] = useState(user.cidade)

    const salvar = () => {
        updateUser({ nome, chavePix, cidade })
        alert('Configurações salvas')
    }

    return (
        <section className="settings">
            <h3>Configurações PIX</h3>

            <input value={nome} onChange={e => setNome(e.target.value)} />
            <input value={chavePix} onChange={e => setChavePix(e.target.value)} />
            <input value={cidade} onChange={e => setCidade(e.target.value)} />

            <button onClick={salvar}>Salvar</button>
        </section>
    )
}