'use client'

import { useEffect, useState } from 'react'

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const alreadyLoaded = !!sessionStorage.getItem('tfr-loader-done')
    const delay = alreadyLoaded ? 80 : 3600
    const t = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(t)
  }, [])

  return (
    <div data-ready={ready} className="hero-reveal">
      {children}
    </div>
  )
}
