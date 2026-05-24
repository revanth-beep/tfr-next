'use client'

import { useEffect, useState } from 'react'

type Phase = 'intro' | 'opening' | 'done'

export function Loader() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setPhase('opening'), 2300)
    const t2 = setTimeout(() => setPhase('done'), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!mounted || phase === 'done') return null

  const opening = phase === 'opening'

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}
    >
      {/* Top panel */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: '51%',
        background: '#09162A',
        transform: opening ? 'translateY(-100%)' : 'translateY(0)',
        transition: opening ? 'transform 1.1s cubic-bezier(0.16,1,0.3,1)' : 'none',
        willChange: 'transform',
      }} />

      {/* Bottom panel */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '51%',
        background: '#09162A',
        transform: opening ? 'translateY(100%)' : 'translateY(0)',
        transition: opening ? 'transform 1.1s cubic-bezier(0.16,1,0.3,1)' : 'none',
        willChange: 'transform',
      }} />

      {/* Seam line */}
      <div
        className="ld-seam"
        style={{
          position: 'absolute', left: 0, right: 0,
          top: '50%', height: '1px',
          background: 'rgba(200,168,75,0.3)',
          transformOrigin: 'center',
          opacity: opening ? 0 : 1,
          transition: opening ? 'opacity 0.25s ease-in' : 'none',
          animation: !opening ? 'ldSeam 0.85s cubic-bezier(0.87,0,0.13,1) 0.25s both' : 'none',
        }}
      />

      {/* Left dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '52px',
        width: 5, height: 5, borderRadius: '50%',
        background: '#C8A84B',
        transform: 'translateY(-50%)',
        opacity: opening ? 0 : undefined,
        transition: opening ? 'opacity 0.2s ease-in' : 'none',
        animation: !opening ? 'ldDot 0.3s ease-out 0.9s both' : 'none',
      }} />

      {/* Right dot */}
      <div style={{
        position: 'absolute', top: '50%', right: '52px',
        width: 5, height: 5, borderRadius: '50%',
        background: '#C8A84B',
        transform: 'translateY(-50%)',
        opacity: opening ? 0 : undefined,
        transition: opening ? 'opacity 0.2s ease-in' : 'none',
        animation: !opening ? 'ldDot 0.3s ease-out 0.95s both' : 'none',
      }} />

      {/* Brand — logo + meta, sits above the seam */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -100%)',
        paddingBottom: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
        opacity: opening ? 0 : undefined,
        transition: opening ? 'opacity 0.25s ease-in' : 'none',
        pointerEvents: 'none',
      }}>
        <img
          src="/logo.png"
          alt="The Finance Room"
          style={{
            height: 'clamp(52px,8vw,96px)', width: 'auto',
            filter: 'brightness(0) invert(1)',
            opacity: 0.92,
            animation: !opening ? 'ldLogo 0.8s cubic-bezier(0.16,1,0.3,1) 1.0s both' : 'none',
          }}
        />
      </div>
    </div>
  )
}
