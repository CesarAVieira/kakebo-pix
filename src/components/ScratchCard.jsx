import React, { useState, useRef, useEffect } from 'react';
import '../styles/ScratchCard.scss';

const ScratchCard = ({
    hiddenContent = '🎉 Você Ganhou!',
    coverColor = '#888888',
    scratchRadius = 30,
    revealThreshold = 70 // porcentagem
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealPercentage, setRevealPercentage] = useState(0);
    const [isScratching, setIsScratching] = useState(false);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const scratchPositions = useRef([]);
    const lastPoint = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Inicializa o canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Preenche com a cor de cobertura
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';

        // Configura qualidade do traço
        ctx.lineWidth = scratchRadius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [coverColor, scratchRadius]);

    // Desenha no canvas
    const drawScratch = (x, y) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();

        if (lastPoint.current) {
            ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Desenha um círculo no ponto atual para melhor cobertura
        ctx.beginPath();
        ctx.arc(x, y, scratchRadius, 0, Math.PI * 2);
        ctx.fill();

        lastPoint.current = { x, y };
        scratchPositions.current.push({ x, y });

        // Calcula porcentagem revelada
        calculateRevealedPercentage();
    };

    // Calcula porcentagem da área revelada
    const calculateRevealedPercentage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Pega dados da imagem para análise
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        // Conta pixels transparentes (já "arranhados")
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
                transparentPixels++;
            }
        }

        const totalPixels = canvas.width * canvas.height;
        const percentage = (transparentPixels / totalPixels) * 100;

        setRevealPercentage(percentage);

        // Se revelou o suficiente, mostra completamente
        if (percentage >= revealThreshold && !isRevealed) {
            setIsRevealed(true);
            // Remove completamente a cobertura
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Handlers para mouse (web)
    const handleMouseDown = (e) => {
        setIsScratching(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        lastPoint.current = { x, y };
        drawScratch(x, y);
    };

    const handleMouseMove = (e) => {
        if (!isScratching) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        drawScratch(x, y);
    };

    const handleMouseUp = () => {
        setIsScratching(false);
        lastPoint.current = null;
    };

    const handleMouseLeave = () => {
        setIsScratching(false);
        lastPoint.current = null;
    };

    // Handlers para touch (mobile)
    const handleTouchStart = (e) => {
        e.preventDefault();
        setIsScratching(true);
        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        lastPoint.current = { x, y };
        drawScratch(x, y);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isScratching) return;

        const touch = e.touches[0];
        const rect = canvasRef.current.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        drawScratch(x, y);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        setIsScratching(false);
        lastPoint.current = null;
    };

    // Reset do componente
    const handleReset = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Reseta o canvas
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';

        // Reseta os estados
        setIsRevealed(false);
        setRevealPercentage(0);
        scratchPositions.current = [];
        lastPoint.current = null;
    };

    return (
        <div className="scratch-card-container" ref={containerRef}>
            <div className="scratch-card">
                {/* Conteúdo oculto (fundo) */}
                <div className="hidden-content">
                    {typeof hiddenContent === 'string' ? (
                        <div className="hidden-text">{hiddenContent}</div>
                    ) : (
                        hiddenContent
                    )}
                </div>

                {/* Camada de raspadinha (canvas) */}
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={200}
                    className={`scratch-canvas ${isRevealed ? 'revealed' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    style={{
                        cursor: isMobile ? 'pointer' : 'crosshair',
                        touchAction: 'none' // Importante para mobile
                    }}
                />

                {/* Overlay de instruções */}
                {revealPercentage === 0 && (
                    <div className="instruction-overlay">
                        {isMobile ? 'Esfregue com o dedo' : 'Arraste o mouse'}
                    </div>
                )}
            </div>

            {/* Controles e informações */}
            <div className="scratch-card-info">
                <div className="reveal-progress">
                    <div
                        className="progress-bar"
                        style={{ width: `${Math.min(revealPercentage, 100)}%` }}
                    />
                    <span>{Math.round(revealPercentage)}% revelado</span>
                </div>

                <button
                    onClick={handleReset}
                    className="reset-button"
                    disabled={revealPercentage === 0}
                >
                    Resetar Raspadinha
                </button>

                {isRevealed && (
                    <div className="completion-message">
                        🎊 Conteúdo completamente revelado!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScratchCard;