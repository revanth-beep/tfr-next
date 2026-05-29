'use client'

import { useEffect, useRef, useState } from 'react'
import { loaderDone, heroReady } from './loader-state'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function Reveal({ children, delay = 0, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function startObserving() {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        },
        { threshold: 0.08 },
      )
      obs.observe(el!)
      return () => obs.disconnect()
    }

    // Navigation: start immediately so elements animate as page fades in
    if (loaderDone || heroReady) return startObserving()

    // First load: wait until loader opens so Reveal fires in sync with page fade-in
    let cleanup: (() => void) | undefined
    function onReady() { cleanup = startObserving() }
    window.addEventListener('tfr:hero-ready', onReady, { once: true })
    const fallback = setTimeout(onReady, 4000)

    return () => {
      window.removeEventListener('tfr:hero-ready', onReady)
      clearTimeout(fallback)
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
