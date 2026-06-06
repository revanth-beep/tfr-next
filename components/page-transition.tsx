'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loaderDone, heroReady } from './loader-state'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Navigation: loaderDone is already true → reveal immediately
  // First load: heroReady starts false → wait for tfr:hero-ready (loader opens)
  const [ready, setReady] = useState(() => {
    if (typeof window !== 'undefined') {
      return loaderDone || heroReady || !!sessionStorage.getItem('tfr:loader-shown')
    }
    return false
  })

  useEffect(() => {
    if (loaderDone || heroReady) { setReady(true); return }
    function onReady() { setReady(true) }
    window.addEventListener('tfr:hero-ready', onReady, { once: true })
    const fallback = setTimeout(onReady, 4000)
    return () => {
      window.removeEventListener('tfr:hero-ready', onReady)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
