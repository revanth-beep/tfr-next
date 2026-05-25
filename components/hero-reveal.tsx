'use client'

import { useEffect, useState } from 'react'
import { loaderDone } from './loader-state'

export function HeroReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (loaderDone) {
      // Subsequent client-side navigation — animate immediately
      const t = setTimeout(() => setReady(true), 80)
      return () => clearTimeout(t)
    }

    // First load — start animating when loader panels begin to open (T≈2300ms)
    function onLoaderOpen() {
      setTimeout(() => setReady(true), 220)
    }

    window.addEventListener('tfr:hero-ready', onLoaderOpen, { once: true })
    // Fallback: if hydration is slow and event already fired
    const fallback = setTimeout(() => setReady(true), 4000)

    return () => {
      window.removeEventListener('tfr:hero-ready', onLoaderOpen)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <div data-ready={ready} className="hero-reveal">
      {children}
    </div>
  )
}
