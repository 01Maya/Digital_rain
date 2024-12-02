"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const MatrixDigitalRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [updateDimensions])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const getFontSize = () => {
      return Math.max(24, Math.min(36, Math.floor(dimensions.width / 35))) // Slightly increased font size
    }

    const fontSize = getFontSize()
    const columns = Math.ceil(canvas.width / fontSize)

    const drops: number[] = new Array(columns).fill(1)
    const matrix = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%'

    const color = '#00FF00' // Bright green color

    let animationFrameId: number

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)' // Increased opacity for better contrast
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `bold ${fontSize}px monospace` // Made font bold for better visibility
      ctx.fillStyle = color

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Calculate distance from mouse
        const dx = x - mousePosition.x
        const dy = y - mousePosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Adjust character position based on mouse proximity
        const maxDistance = 100
        const push = Math.max(0, 1 - distance / maxDistance)
        const offsetX = dx * push * 0.2
        const offsetY = dy * push * 0.2

        // Add a subtle glow effect
        ctx.shadowColor = color
        ctx.shadowBlur = 5
        ctx.fillText(text, x + offsetX, y + offsetY)
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += 0.2 + Math.random() * 0.1 // Slightly increased speed for better visibility
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, mousePosition])

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black w-full h-full" />
}

export default MatrixDigitalRain

