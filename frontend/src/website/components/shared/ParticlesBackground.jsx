import { useEffect, useRef } from 'react'

const config = { linkDistance: 150, repulseDistance: 200, speed: 0.65 }

function ParticlesBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !container || !context) return undefined

    const particles = []
    const pointer = { x: 0, y: 0, active: false }
    let frame = 0
    let width = 0
    let height = 0
    let particleColor = '#36454d'
    let particleOpacity = 0.5

    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      particleColor = isDark ? '#ffffff' : '#8b949e'
      particleOpacity = isDark ? 0.5 : 0.28
    }

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2
      return { x: Math.random() * width, y: Math.random() * height, vx: Math.cos(angle) * config.speed, vy: Math.sin(angle) * config.speed, radius: 1 + Math.random() * 2 }
    }

    const resize = () => {
      const bounds = container.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const count = Math.max(32, Math.min(72, Math.round((width * height / 800) * 0.16)))
      particles.splice(0, particles.length, ...Array.from({ length: count }, createParticle))
    }

    const movePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = true
    }
    const leavePointer = () => { pointer.active = false }
    const pushParticles = () => { particles.push(...Array.from({ length: 4 }, createParticle)) }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        let offsetX = 0
        let offsetY = 0
        if (pointer.active) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < config.repulseDistance) {
            const force = (config.repulseDistance - distance) / config.repulseDistance
            offsetX = (dx / distance) * force * 12
            offsetY = (dy / distance) * force * 12
          }
        }
        particle.x += particle.vx + offsetX
        particle.y += particle.vy + offsetY
        if (particle.x < -particle.radius) particle.x = width + particle.radius
        if (particle.x > width + particle.radius) particle.x = -particle.radius
        if (particle.y < -particle.radius) particle.y = height + particle.radius
        if (particle.y > height + particle.radius) particle.y = -particle.radius
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = particleColor
        context.globalAlpha = particleOpacity
        context.fill()
      })
      particles.forEach((particle, index) => particles.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
        if (distance < config.linkDistance) {
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(other.x, other.y)
          context.strokeStyle = particleColor
          context.globalAlpha = (1 - distance / config.linkDistance) * 0.18
          context.lineWidth = 1
          context.stroke()
        }
      }))
      context.globalAlpha = 1
      frame = window.requestAnimationFrame(draw)
    }

    updateTheme()
    resize()
    const themeObserver = new MutationObserver(updateTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    window.addEventListener('resize', resize)
    container.addEventListener('pointermove', movePointer)
    container.addEventListener('pointerleave', leavePointer)
    container.addEventListener('pointerdown', pushParticles)
    draw()
    return () => {
      window.cancelAnimationFrame(frame)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      container.removeEventListener('pointermove', movePointer)
      container.removeEventListener('pointerleave', leavePointer)
      container.removeEventListener('pointerdown', pushParticles)
    }
  }, [])

  const particleMask = 'radial-gradient(circle at 100% 0%, #000 0%, #000 14%, transparent 14.75%), radial-gradient(circle at 0% 100%, #000 0%, #000 16%, transparent 16.75%)'

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-30 h-full w-full" style={{ maskImage: particleMask, WebkitMaskImage: particleMask }} aria-hidden="true" />
}

export default ParticlesBackground
