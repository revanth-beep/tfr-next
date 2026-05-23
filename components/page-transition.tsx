'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          default: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          opacity:  { duration: 0.18 },
          exit:     { duration: 0.18 },
        }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
