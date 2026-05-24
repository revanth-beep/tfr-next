'use client'

import { useEffect } from 'react'

export function ChromeOffset() {
  useEffect(() => {
    const el = document.getElementById('site-chrome')
    if (!el) return

    function update() {
      document.documentElement.style.setProperty('--chrome-h', el!.offsetHeight + 'px')
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return null
}
