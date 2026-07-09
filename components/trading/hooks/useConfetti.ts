"use client";

import { useEffect, useRef } from "react";

type ConfettiParticle = {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocityX: number;
    velocityY: number;
    rotation: number;
    rotationSpeed: number;
};

export const useConfetti = (enabled: boolean) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!enabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const colors = ["#F6D860", "#9E7CF6", "#5BD384", "#F47878", "#63B3ED"];
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const createParticle = (): ConfettiParticle => ({
            x: Math.random() * width,
            y: Math.random() * height * 0.3,
            radius: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
        });

        const particles: ConfettiParticle[] = Array.from({ length: 50 }, createParticle);
        let animationFrame = 0;
        let running = true;
        let wrapCount = 0;
        const maxWrapCount = 1 * particles.length;

        const draw = () => {
            if (!running) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.x += p.velocityX;
                p.y += p.velocityY;
                p.rotation += p.rotationSpeed;
                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                    wrapCount += 1;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.rect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                ctx.fill();
                ctx.restore();
            });

            if (wrapCount < maxWrapCount) {
                animationFrame = requestAnimationFrame(draw);
            } else {
                animationFrame = requestAnimationFrame(draw);
                const canvasElement = canvasRef.current;
                if (canvasElement) {
                    canvasElement.style.transition = "opacity 0.6s ease-out";
                    canvasElement.style.opacity = "0";
                    window.setTimeout(() => {
                        canvasElement.remove();
                    }, 600);
                }
            }
        };

        window.addEventListener("resize", resize);
        animationFrame = requestAnimationFrame(draw);

        return () => {
            running = false;
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
        };
    }, [enabled]);

    return canvasRef;
};