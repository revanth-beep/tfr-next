'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal() {
  const path = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.visible)'))

    // Reveal elements already in the viewport synchronously — no waiting for observer
    const remaining: HTMLElement[] = []
    for (const el of els) {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight - 30) {
        el.classList.add('visible')
      } else {
        remaining.push(el)
      }
    }

    if (!remaining.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' },
    )

    remaining.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [path])

  return null
}
