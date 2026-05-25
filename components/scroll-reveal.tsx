'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal() {
  const path = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver | null = null

    // Delay setup so the browser has a chance to paint the initial opacity:0 state.
    // Without this, classList.add('visible') runs before the first paint and
    // the browser skips the transition entirely.
    const t = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              ;(e.target as HTMLElement).classList.add('visible')
              observer!.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
      )

      document.querySelectorAll<HTMLElement>('.reveal:not(.visible)').forEach(el => {
        observer!.observe(el)
      })
    }, 120)

    return () => {
      clearTimeout(t)
      observer?.disconnect()
    }
  }, [path])

  return null
}
