import React, { useState, useRef, useEffect } from 'react';
import '../styles/ScratchCard.scss';

const ScratchCard = ({
    hiddenContent = '🎉 Você Ganhou!',
    coverColor = '#888888',
    scratchRadius = 30,
    onComplete
}) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealPercentage, setRevealPercentage] = useState(0);
    const [isScratching, setIsScratching] = useState(false);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const scratchPositions = useRef([]);
    const [completed, setCompleted] = useState(false);
    const lastPoint = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const [canvasSize] = useState(() => {
        const isDesktop = window.innerWidth >= 1024

        return isDesktop
            ? { width: 480, height: 300 }
            : { width: 300, height: 200 }
    })

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

        if (percentage >= 70 && !isRevealed) {
            setIsRevealed(true)
            setCompleted(true)

            setTimeout(() => {
                if (onComplete) onComplete()
            }, 500)

            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    };

    // Handlers para mouse (web)
    const handleMouseDown = (e) => {
        setIsScratching(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        lastPoint.current = { x, y };
        drawScratch(x, y);
    };

    const handleMouseMove = (e) => {
        if (!isScratching) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

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

    return (
        <div className="scratch-card-container" ref={containerRef}>
            <div className="scratch-card-wrapper">

                {/* CARD */}
                <div className="scratch-card">
                    <div className="hidden-content">
                        {typeof hiddenContent === 'string' ? (
                            <div className={`hidden-text ${completed ? 'reveal-animate' : ''}`}>
                                {hiddenContent}
                            </div>
                        ) : (
                            hiddenContent
                        )}
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
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
                            width: '100%',
                            height: '100%',
                            cursor: isMobile ? 'pointer' : 'crosshair'
                        }}
                    />

                    {revealPercentage === 0 && (
                        <div className="instruction-overlay">
                            {isMobile ? 'Esfregue com o dedo' : 'Arraste o mouse'}
                        </div>
                    )}
                </div>

                {/* BARRA VERTICAL */}
                <div className="scratch-progress-vertical">
                    <div
                        className="progress-fill"
                        style={{
                            height: `${Math.min(
                                (revealPercentage / 70) * 100,
                                100
                            )}%`
                        }}
                    />
                    <span>
                        {Math.min(
                            Math.round((revealPercentage / 70) * 100),
                            100
                        )}%
                    </span>
                </div>

            </div>
        </div>
    );

};

export default ScratchCard;