import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { gerarPixPayload } from '../utils/pixPayload'
import { useAuth } from '../context/AuthContext'
import '../styles/PixModal.scss'

export default function PixModal({ value, onClose, onConfirm }) {
    const { user } = useAuth()
    const [copied, setCopied] = useState(false)

    if (!user?.pix) {
        return (
            <div className="pix-modal-backdrop">
                <div className="pix-modal">
                    <h2>PIX não configurado</h2>
                    <p>
                        Configure sua chave PIX antes de realizar pagamentos.
                    </p>
                    <button className="cancel" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        )
    }

    const payload = gerarPixPayload({
        chave: user.pix.chave,
        nome: user.pix.nome,
        cidade: user.pix.cidade,
        valor: value
    })

    return (
        <div className="pix-modal-backdrop">
            <div className="pix-modal">
                <h2>Pagamento PIX</h2>

                <p>
                    Valor:{' '}
                    <strong>R$ {value.toFixed(2)}</strong>
                </p>

                <QRCodeCanvas value={payload} size={220} />

                <button
                    className="copy"
                    onClick={() => {
                        navigator.clipboard.writeText(payload)
                        setCopied(true)

                        setTimeout(() => {
                            setCopied(false)
                        }, 2000)
                    }}
                >
                    Copiar código PIX
                </button>
                {copied && (
                    <span className="pix-copy-feedback">
                        Código PIX copiado!
                    </span>
                )}

                <div className="pix-modal-actions">
                    <button className="cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="confirm"
                        onClick={onConfirm}
                    >
                        Já paguei
                    </button>
                </div>
            </div>
        </div>
    )
}
